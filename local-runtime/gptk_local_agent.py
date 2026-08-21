#!/usr/bin/env python3
r"""GPT-Knowledge autonomous local runtime.

Owned by the GPT-Knowledge repository.

Two independent transports share one local authority boundary:

1. Structured GPT-K actions
   LB Workspace -> /api/workspace-actions -> this runtime -> result journal.
   These requests are capability based and NEVER become arbitrary shell text.

2. Browser conversation commands
   Exact configured chat URL -> AGENT COMMAND -> workspace-contained execution
   -> AGENT RESULT. This preserves the standalone LoopTool workflow.

The browser binding is fail-closed: if the configured chat is not present, the
runtime waits. It never falls back to an arbitrary open browser tab.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import socket
import subprocess
import threading
import time
import urllib.error
import urllib.parse
import urllib.request
from dataclasses import asdict, dataclass
from pathlib import Path
from typing import Any, Optional

try:
    from playwright.sync_api import Browser, Page, Playwright, sync_playwright
except ImportError:
    Browser = Page = Playwright = None  # type: ignore[assignment]
    sync_playwright = None

VERSION = "1.0.0"
DEFAULT_API = "https://gpt-knowledge.vercel.app/api/workspace-actions"
DEFAULT_KEY = "gpt"
DEFAULT_CDP = "http://127.0.0.1:7430"
DEFAULT_POLL = 5.0
MAX_EVIDENCE_CHARS = 20_000

ALLOWED_CAPABILITIES = {
    "project.audit",
    "project.verify",
    "project.report-evidence",
    "issue.inspect",
}

COMMAND_PATTERN = re.compile(
    r"===\s*AGENT COMMAND START\s*===\s*"
    r"WORKING DIRECTORY:\s*(?P<cwd>[^\r\n]+)\s*"
    r"COMMAND:\s*(?P<command>.*?)\s*"
    r"===\s*AGENT COMMAND END\s*===",
    re.IGNORECASE | re.DOTALL,
)

ASSISTANT_SELECTORS = [
    '[data-message-author-role="assistant"]',
    'article[data-testid^="conversation-turn"] [data-message-author-role="assistant"]',
    '.assistant-message',
    '.message-assistant',
]

COMPOSER_SELECTORS = [
    '#prompt-textarea',
    '[data-testid="prompt-textarea"]',
    'div.ProseMirror[contenteditable="true"]',
    '[contenteditable="true"][role="textbox"]',
    'textarea[placeholder*="message" i]',
    'textarea[placeholder*="ask" i]',
    'textarea',
]

SEND_SELECTORS = [
    'button[data-testid="send-button"]',
    'button[aria-label="Send prompt"]',
    'button[aria-label="Send message"]',
    'button[aria-label="Send"]',
    'button[type="submit"]',
]

STOP_SELECTORS = [
    'button[data-testid="stop-button"]',
    'button[aria-label="Stop generating"]',
    'button[aria-label="Stop streaming"]',
]


@dataclass
class RuntimeConfig:
    project: str
    workspace: str
    target_url: str = ""
    cdp_url: str = DEFAULT_CDP
    action_api: str = DEFAULT_API
    save_key: str = DEFAULT_KEY
    poll_seconds: float = DEFAULT_POLL

    @property
    def workspace_path(self) -> Path:
        return Path(os.path.expandvars(os.path.expanduser(self.workspace))).resolve()


class Log:
    def __init__(self, project: str) -> None:
        root = Path.home() / ".gpt-knowledge" / "runtime" / project
        root.mkdir(parents=True, exist_ok=True)
        self.path = root / "runtime.log"
        self.lock = threading.Lock()

    def write(self, message: str) -> None:
        line = f"{time.strftime('%Y-%m-%d %H:%M:%S')} {message}"
        with self.lock:
            print(line, flush=True)
            with self.path.open("a", encoding="utf-8") as handle:
                handle.write(line + "\n")


def state_path(project: str) -> Path:
    root = Path.home() / ".gpt-knowledge" / "runtime" / project
    root.mkdir(parents=True, exist_ok=True)
    return root / "state.json"


def load_state(project: str) -> dict[str, Any]:
    try:
        return json.loads(state_path(project).read_text(encoding="utf-8"))
    except Exception:
        return {}


def save_state(config: RuntimeConfig, **patch: Any) -> None:
    current = load_state(config.project)
    current.update({"config": asdict(config), **patch})
    state_path(config.project).write_text(json.dumps(current, indent=2), encoding="utf-8")


def normalize_url(value: str) -> str:
    value = str(value or "").strip()
    if not value:
        return ""
    parsed = urllib.parse.urlsplit(value)
    return urllib.parse.urlunsplit((
        parsed.scheme.lower(),
        parsed.netloc.lower(),
        parsed.path.rstrip("/"),
        parsed.query,
        "",
    ))


def digest(command: str, cwd: Path) -> str:
    return hashlib.sha256(f"{cwd}\n{command}".encode("utf-8", errors="replace")).hexdigest().upper()


def truncate(value: str, limit: int = MAX_EVIDENCE_CHARS) -> str:
    value = str(value or "")
    if len(value) <= limit:
        return value
    marker = "\n... [truncated] ...\n"
    half = max(1, (limit - len(marker)) // 2)
    return value[:half] + marker + value[-half:]


def path_inside(root: Path, candidate: Path) -> bool:
    try:
        candidate.relative_to(root)
        return True
    except ValueError:
        return False


def run_process(cwd: Path, argv: list[str], timeout: int = 20) -> dict[str, Any]:
    try:
        completed = subprocess.run(
            argv,
            cwd=str(cwd),
            capture_output=True,
            text=True,
            errors="replace",
            timeout=timeout,
            stdin=subprocess.DEVNULL,
            creationflags=getattr(subprocess, "CREATE_NO_WINDOW", 0),
        )
        return {
            "operation": " ".join(argv),
            "ok": completed.returncode == 0,
            "code": completed.returncode,
            "stdout": truncate(completed.stdout),
            "stderr": truncate(completed.stderr),
        }
    except subprocess.TimeoutExpired as exc:
        return {
            "operation": " ".join(argv),
            "ok": False,
            "code": 124,
            "stdout": truncate(exc.stdout or ""),
            "stderr": truncate((exc.stderr or "") + "\nOperation timed out."),
        }
    except Exception as exc:
        return {
            "operation": " ".join(argv),
            "ok": False,
            "code": None,
            "stdout": "",
            "stderr": str(exc),
        }


def git(cwd: Path, *args: str, timeout: int = 20) -> dict[str, Any]:
    return run_process(cwd, ["git", *args], timeout=timeout)


def output(result: dict[str, Any]) -> str:
    return str(result.get("stdout") or "").strip()


def parse_status(text: str) -> dict[str, Any]:
    changed: list[dict[str, str]] = []
    untracked: list[str] = []
    header = None
    for line in str(text or "").splitlines():
        if line.startswith("## "):
            header = line
            continue
        if len(line) < 3:
            continue
        code = line[:2]
        name = line[3:].strip()
        if not name:
            continue
        if code == "??":
            untracked.append(name)
        else:
            changed.append({"code": code, "file": name})
    return {"status_header": header, "changed": changed, "untracked": untracked}


def common_audit(workspace: Path, operations: list[str]) -> dict[str, Any]:
    branch = git(workspace, "branch", "--show-current")
    operations.append(branch["operation"])
    head = git(workspace, "rev-parse", "HEAD")
    operations.append(head["operation"])
    status = git(workspace, "status", "--porcelain=v1", "-b")
    operations.append(status["operation"])
    recent = git(workspace, "log", "-5", "--oneline", "--decorate")
    operations.append(recent["operation"])

    origin_main = git(workspace, "rev-parse", "origin/main")
    operations.append(origin_main["operation"])
    remote_ref = "origin/main" if origin_main["ok"] else None
    remote = origin_main
    if not origin_main["ok"]:
        origin_master = git(workspace, "rev-parse", "origin/master")
        operations.append(origin_master["operation"])
        if origin_master["ok"]:
            remote_ref = "origin/master"
            remote = origin_master

    local_head = output(head) or None
    remote_head = output(remote) or None
    parsed = parse_status(output(status))
    return {
        "branch": output(branch) or None,
        "head": local_head,
        "remote_ref": remote_ref,
        "remote_head": remote_head,
        "aligned_with_remote": bool(local_head and remote_head and local_head == remote_head),
        **parsed,
        "recent_commits": [line for line in output(recent).splitlines() if line],
    }


def top_level_inventory(workspace: Path) -> list[dict[str, str]]:
    out: list[dict[str, str]] = []
    try:
        for entry in sorted(workspace.iterdir(), key=lambda p: p.name.lower())[:120]:
            out.append({"name": entry.name, "type": "directory" if entry.is_dir() else "file" if entry.is_file() else "other"})
    except Exception as exc:
        out.append({"name": "<inventory-error>", "type": str(exc)})
    return out


def execute_capability(config: RuntimeConfig, request: dict[str, Any]) -> dict[str, Any]:
    started_at = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    workspace = config.workspace_path
    capability = str(request.get("capability") or "")
    operations: list[str] = []
    identity = {
        "project": config.project,
        "workspace": str(workspace),
        "hostname": socket.gethostname(),
        "runtime": f"gptk-local-agent/{VERSION}",
    }

    if capability not in ALLOWED_CAPABILITIES:
        return {
            "status": "blocked",
            "classification": "CAPABILITY_NOT_ALLOWED_LOCALLY",
            "resolved_capability": "",
            "resolved_operations": operations,
            "workspace_identity": identity,
            "evidence": {},
            "error": f"Unsupported capability: {capability}",
            "started_at": started_at,
        }

    if not workspace.is_dir():
        return {
            "status": "blocked",
            "classification": "WORKSPACE_UNAVAILABLE",
            "resolved_capability": capability,
            "resolved_operations": operations,
            "workspace_identity": identity,
            "evidence": {},
            "error": f"Workspace does not exist: {workspace}",
            "started_at": started_at,
        }

    audit = common_audit(workspace, operations)

    if capability == "project.audit":
        return {
            "status": "completed",
            "classification": "LOCAL_AUDIT_COLLECTED",
            "resolved_capability": capability,
            "resolved_operations": operations,
            "workspace_identity": identity,
            "evidence": {"audit": audit},
            "started_at": started_at,
        }

    if capability == "project.verify":
        diff = git(workspace, "diff", "--stat")
        staged = git(workspace, "diff", "--cached", "--stat")
        operations.extend([diff["operation"], staged["operation"]])
        return {
            "status": "completed",
            "classification": "LOCAL_VERIFICATION_COLLECTED",
            "resolved_capability": capability,
            "resolved_operations": operations,
            "workspace_identity": identity,
            "evidence": {
                "audit": audit,
                "working_tree_diff_stat": output(diff),
                "staged_diff_stat": output(staged),
            },
            "started_at": started_at,
        }

    if capability == "project.report-evidence":
        diff = git(workspace, "diff", "--stat")
        remotes = git(workspace, "remote", "-v")
        operations.extend([diff["operation"], remotes["operation"]])
        return {
            "status": "completed",
            "classification": "REPORT_EVIDENCE_COLLECTED",
            "resolved_capability": capability,
            "resolved_operations": operations,
            "workspace_identity": identity,
            "evidence": {
                "audit": audit,
                "working_tree_diff_stat": output(diff),
                "remotes": [line for line in output(remotes).splitlines() if line],
                "top_level_inventory": top_level_inventory(workspace),
            },
            "started_at": started_at,
        }

    objective = str(request.get("objective") or "").strip()
    if not objective:
        return {
            "status": "blocked",
            "classification": "ISSUE_QUERY_REQUIRED",
            "resolved_capability": capability,
            "resolved_operations": operations,
            "workspace_identity": identity,
            "evidence": {"audit": audit},
            "error": "issue.inspect requires an objective.",
            "started_at": started_at,
        }

    query = objective[:200]
    grep = git(workspace, "grep", "-n", "-I", "-i", "--", query, timeout=30)
    history = git(workspace, "log", "-10", "--oneline", "--all", "--regexp-ignore-case", f"--grep={query}", timeout=30)
    operations.extend([grep["operation"], history["operation"]])
    return {
        "status": "completed",
        "classification": "ISSUE_EVIDENCE_COLLECTED",
        "resolved_capability": capability,
        "resolved_operations": operations,
        "workspace_identity": identity,
        "evidence": {
            "query": query,
            "audit": audit,
            "source_matches": [line for line in output(grep).splitlines()[:80] if line],
            "matching_commits": [line for line in output(history).splitlines() if line],
        },
        "started_at": started_at,
    }


def http_json(url: str, method: str = "GET", headers: Optional[dict[str, str]] = None, body: Optional[dict[str, Any]] = None, timeout: float = 20.0) -> dict[str, Any]:
    data = None if body is None else json.dumps(body).encode("utf-8")
    req = urllib.request.Request(url, data=data, method=method)
    req.add_header("accept", "application/json")
    if data is not None:
        req.add_header("content-type", "application/json")
    for key, value in (headers or {}).items():
        req.add_header(key, value)
    try:
        with urllib.request.urlopen(req, timeout=timeout) as response:
            raw = response.read().decode("utf-8", errors="replace")
            parsed = json.loads(raw or "{}")
            if parsed.get("ok") is False:
                raise RuntimeError(f"{parsed.get('error', 'API_ERROR')}: {parsed.get('detail', '')}".rstrip(": "))
            return parsed
    except urllib.error.HTTPError as exc:
        raw = exc.read().decode("utf-8", errors="replace")
        try:
            parsed = json.loads(raw or "{}")
        except Exception:
            parsed = {}
        detail = parsed.get("detail") or parsed.get("error") or raw or str(exc)
        raise RuntimeError(f"HTTP {exc.code}: {detail}") from exc


class ActionRuntime:
    def __init__(self, config: RuntimeConfig, log: Log, stop: threading.Event) -> None:
        self.config = config
        self.log = log
        self.stop = stop
        self.inflight: set[str] = set()

    def post_result(self, request: dict[str, Any], outcome: dict[str, Any]) -> None:
        payload = {
            "operation": "result",
            "project": self.config.project,
            "request_id": request["request_id"],
            "executor": "gptk-local-runtime",
            "executor_instance": f"{socket.gethostname()}:{os.getpid()}",
            **outcome,
        }
        http_json(
            self.config.action_api,
            method="POST",
            headers={"x-workspace-save-key": self.config.save_key},
            body=payload,
        )

    def poll_once(self) -> None:
        url = f"{self.config.action_api}?project={urllib.parse.quote(self.config.project)}&state=pending&_={int(time.time() * 1000)}"
        data = http_json(url)
        for request in data.get("items") or []:
            request_id = str(request.get("request_id") or "")
            if not request_id or request_id in self.inflight:
                continue
            self.inflight.add(request_id)
            try:
                requested = str(request.get("capability") or "")
                self.log.write(f"ACTION_RECEIVED id={request_id} requested={requested}")
                outcome = execute_capability(self.config, request)
                self.log.write(
                    f"ACTION_RESOLVED id={request_id} requested={requested} "
                    f"resolved={outcome.get('resolved_capability') or '-'} "
                    f"classification={outcome.get('classification')}"
                )
                self.post_result(request, outcome)
                self.log.write(f"ACTION_RESULT_POSTED id={request_id} status={outcome.get('status')}")
            except Exception as exc:
                self.log.write(f"ACTION_FAILED id={request_id} error={exc}")
            finally:
                self.inflight.discard(request_id)

    def run(self) -> None:
        self.log.write(f"ACTION_RUNTIME_STARTED api={self.config.action_api} project={self.config.project}")
        while not self.stop.is_set():
            try:
                self.poll_once()
            except Exception as exc:
                self.log.write(f"ACTION_POLL_FAILED error={exc}")
            self.stop.wait(max(1.0, self.config.poll_seconds))
        self.log.write("ACTION_RUNTIME_STOPPED")


class BrowserRuntime:
    def __init__(self, config: RuntimeConfig, log: Log, stop: threading.Event) -> None:
        self.config = config
        self.log = log
        self.stop = stop
        self.playwright: Optional[Playwright] = None
        self.browser: Optional[Browser] = None
        self.page: Optional[Page] = None
        state = load_state(config.project)
        self.last_completed_hash = str(state.get("last_completed_hash") or "")
        self.last_seen_hash = str(state.get("last_seen_hash") or "")
        self.last_target_state = ""

    def close(self) -> None:
        self.page = None
        if self.browser is not None:
            try:
                self.browser.close()
            except Exception:
                pass
        self.browser = None
        if self.playwright is not None:
            try:
                self.playwright.stop()
            except Exception:
                pass
        self.playwright = None

    def connect(self) -> None:
        if sync_playwright is None:
            raise RuntimeError("Playwright is not installed. Run: pip install playwright")
        self.close()
        self.playwright = sync_playwright().start()
        self.browser = self.playwright.chromium.connect_over_cdp(self.config.cdp_url)
        self.log.write(f"BROWSER_CDP_CONNECTED cdp={self.config.cdp_url}")

    def find_target(self) -> Optional[Page]:
        if self.browser is None:
            return None
        wanted = normalize_url(self.config.target_url)
        if not wanted:
            return None
        for context in self.browser.contexts:
            for page in context.pages:
                try:
                    if normalize_url(page.url) == wanted:
                        return page
                except Exception:
                    continue
        return None

    def ensure_target(self) -> Optional[Page]:
        if self.browser is None:
            self.connect()
        if self.page is not None:
            try:
                if not self.page.is_closed() and normalize_url(self.page.url) == normalize_url(self.config.target_url):
                    return self.page
            except Exception:
                self.page = None
        self.page = self.find_target()
        state = "TARGET_CHAT_BOUND" if self.page is not None else "TARGET_CHAT_NOT_PRESENT"
        if state != self.last_target_state:
            self.last_target_state = state
            suffix = f" url={self.config.target_url}" if self.config.target_url else " target_url_not_configured"
            self.log.write(state + suffix)
        return self.page

    def latest_assistant_text(self, page: Page) -> str:
        for selector in ASSISTANT_SELECTORS:
            try:
                loc = page.locator(selector)
                count = loc.count()
                if count:
                    return loc.nth(count - 1).inner_text(timeout=2500).strip()
            except Exception:
                continue
        return ""

    def is_generating(self, page: Page) -> bool:
        for selector in STOP_SELECTORS:
            try:
                loc = page.locator(selector)
                if loc.count() and loc.first.is_visible():
                    return True
            except Exception:
                continue
        return False

    def send_text(self, page: Page, text: str) -> None:
        if self.is_generating(page):
            raise RuntimeError("Target chat is still generating.")
        for selector in COMPOSER_SELECTORS:
            try:
                loc = page.locator(selector)
                if not loc.count():
                    continue
                target = loc.last
                if not target.is_visible():
                    continue
                try:
                    target.fill(text, timeout=3000)
                except Exception:
                    target.click(timeout=1500)
                    target.press("Control+A")
                    target.press("Backspace")
                    target.type(text, delay=0)
                for send_selector in SEND_SELECTORS:
                    send = page.locator(send_selector)
                    if send.count() and send.last.is_visible() and send.last.is_enabled():
                        send.last.click(timeout=2000)
                        return
                target.press("Enter")
                return
            except Exception:
                continue
        raise RuntimeError("Composer was not found in the exact target chat.")

    def execute_agent_command(self, cwd: Path, command: str) -> tuple[int, str, str, float]:
        workspace = self.config.workspace_path
        if not cwd.is_dir():
            return 1, "", f"Rejected: working directory does not exist: {cwd}", 0.0
        if not path_inside(workspace, cwd):
            return 1, "", f"Rejected: working directory is outside workspace root {workspace}", 0.0
        argv = ["pwsh", "-NoProfile", "-NonInteractive", "-Command", command] if os.name == "nt" else ["sh", "-lc", command]
        started = time.monotonic()
        try:
            completed = subprocess.run(
                argv,
                cwd=str(cwd),
                capture_output=True,
                text=True,
                errors="replace",
                timeout=300,
                stdin=subprocess.DEVNULL,
                creationflags=getattr(subprocess, "CREATE_NO_WINDOW", 0),
            )
            return completed.returncode, completed.stdout, completed.stderr, time.monotonic() - started
        except subprocess.TimeoutExpired as exc:
            return 124, str(exc.stdout or ""), str(exc.stderr or "") + "\nCommand timed out after 300 seconds.", time.monotonic() - started

    def result_envelope(self, cwd: Path, command: str, code: int, stdout: str, stderr: str, duration: float) -> str:
        chunks = [
            "=== AGENT RESULT START ===",
            f"COMMAND STATUS: {'PASS' if code == 0 else 'FAIL'}",
            f"COMMAND HASH: {digest(command, cwd)}",
            f"COMMAND: {command}",
            f"WORKING DIRECTORY: {cwd}",
            f"EXIT CODE: {code}",
            f"DURATION SECONDS: {duration:.2f}",
        ]
        if stdout.strip():
            chunks.extend(["", "STDOUT:", truncate(stdout.strip(), 12_000)])
        if stderr.strip():
            chunks.extend(["", "STDERR:", truncate(stderr.strip(), 12_000)])
        chunks.append("=== AGENT RESULT END ===")
        return "\n".join(chunks)

    def cycle(self) -> None:
        page = self.ensure_target()
        if page is None:
            return
        text = self.latest_assistant_text(page)
        match = COMMAND_PATTERN.search(text or "")
        if not match:
            return
        cwd = Path(os.path.expandvars(os.path.expanduser(match.group("cwd").strip().strip('"')))).resolve()
        command = match.group("command").strip()
        command_hash = digest(command, cwd)
        if command_hash in {self.last_seen_hash, self.last_completed_hash}:
            return
        self.last_seen_hash = command_hash
        save_state(self.config, last_seen_hash=self.last_seen_hash, last_completed_hash=self.last_completed_hash)
        self.log.write(f"COMMAND_DETECTED hash={command_hash} cwd={cwd}")
        code, stdout, stderr, duration = self.execute_agent_command(cwd, command)
        result = self.result_envelope(cwd, command, code, stdout, stderr, duration)
        while not self.stop.is_set() and self.is_generating(page):
            self.stop.wait(0.5)
        if self.stop.is_set():
            return
        self.send_text(page, result)
        self.last_completed_hash = command_hash
        save_state(self.config, last_seen_hash=self.last_seen_hash, last_completed_hash=self.last_completed_hash)
        self.log.write(f"RESULT_SENT hash={command_hash} exit={code}")

    def run(self) -> None:
        if not self.config.target_url:
            self.log.write("BROWSER_RUNTIME_WAITING target_url_not_configured")
        else:
            self.log.write(f"BROWSER_RUNTIME_STARTED target={self.config.target_url}")
        while not self.stop.is_set():
            if not self.config.target_url:
                self.stop.wait(max(1.0, self.config.poll_seconds))
                continue
            try:
                self.cycle()
            except Exception as exc:
                self.log.write(f"BROWSER_CYCLE_FAILED error={exc}")
                self.close()
            self.stop.wait(max(0.5, self.config.poll_seconds))
        self.close()
        self.log.write("BROWSER_RUNTIME_STOPPED")


def resolve_config(args: argparse.Namespace) -> RuntimeConfig:
    prior: dict[str, Any] = {}
    project_hint = args.project or os.getenv("GPTK_PROJECT") or "access-browser-agent"
    prior_state = load_state(project_hint)
    if isinstance(prior_state.get("config"), dict):
        prior = prior_state["config"]

    project = args.project or os.getenv("GPTK_PROJECT") or prior.get("project") or project_hint
    workspace = args.workspace or os.getenv("GPTK_WORKSPACE") or prior.get("workspace") or ""
    target_url = args.target_url if args.target_url is not None else os.getenv("GPTK_TARGET_URL", prior.get("target_url", ""))
    cdp_url = args.cdp_url or os.getenv("GPTK_CDP_URL") or prior.get("cdp_url") or DEFAULT_CDP
    action_api = args.action_api or os.getenv("GPTK_ACTION_API") or prior.get("action_api") or DEFAULT_API
    save_key = args.save_key or os.getenv("GPTK_WORKSPACE_SAVE_KEY") or prior.get("save_key") or DEFAULT_KEY
    poll_seconds = args.poll or float(os.getenv("GPTK_POLL_SECONDS") or prior.get("poll_seconds") or DEFAULT_POLL)

    config = RuntimeConfig(
        project=str(project).strip(),
        workspace=str(workspace).strip(),
        target_url=str(target_url or "").strip(),
        cdp_url=str(cdp_url).strip(),
        action_api=str(action_api).strip(),
        save_key=str(save_key),
        poll_seconds=max(0.5, float(poll_seconds)),
    )
    if not config.project:
        raise SystemExit("--project is required on first run.")
    if not config.workspace:
        raise SystemExit("--workspace is required on first run.")
    save_state(config)
    return config


def main() -> int:
    parser = argparse.ArgumentParser(description="GPT-Knowledge autonomous local runtime")
    parser.add_argument("--project", help="GPT-K project id, e.g. access-browser-agent")
    parser.add_argument("--workspace", help="Authoritative local workspace root")
    parser.add_argument("--target-url", help="Exact browser chat URL. Blank disables browser command transport.")
    parser.add_argument("--cdp-url", help=f"Chrome CDP endpoint (default {DEFAULT_CDP})")
    parser.add_argument("--action-api", help="GPT-K workspace action API URL")
    parser.add_argument("--save-key", help="Workspace action result key")
    parser.add_argument("--poll", type=float, help="Polling interval seconds")
    parser.add_argument("--actions-only", action="store_true", help="Disable browser command transport")
    parser.add_argument("--version", action="version", version=VERSION)
    args = parser.parse_args()

    config = resolve_config(args)
    workspace = config.workspace_path
    if not workspace.is_dir():
        raise SystemExit(f"Workspace does not exist: {workspace}")

    stop = threading.Event()
    log = Log(config.project)
    log.write(
        f"GPTK_LOCAL_RUNTIME_START version={VERSION} project={config.project} "
        f"workspace={workspace} pid={os.getpid()}"
    )

    action_runtime = ActionRuntime(config, log, stop)
    action_thread = threading.Thread(target=action_runtime.run, daemon=True, name="gptk-actions")
    action_thread.start()

    browser_thread: Optional[threading.Thread] = None
    if not args.actions_only:
        browser_runtime = BrowserRuntime(config, log, stop)
        browser_thread = threading.Thread(target=browser_runtime.run, daemon=True, name="gptk-browser")
        browser_thread.start()

    try:
        while True:
            time.sleep(1.0)
    except KeyboardInterrupt:
        log.write("GPTK_LOCAL_RUNTIME_STOP_REQUESTED")
    finally:
        stop.set()
        action_thread.join(timeout=10)
        if browser_thread is not None:
            browser_thread.join(timeout=10)
        log.write("GPTK_LOCAL_RUNTIME_STOPPED")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
