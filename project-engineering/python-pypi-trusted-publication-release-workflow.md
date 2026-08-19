# Python / PyPI Trusted Publication Release Workflow

## Purpose

Reusable release procedure derived from the `lbe-guard-inspector` 2.0.3 publication recovery performed through `praveshjannath/lbe-ci-validation`.

This document separates validation, artifact construction, Trusted Publishing, and post-publication proof. A green local build is not publication proof. A green validation matrix is not publication proof. The release is complete only after PyPI contains the intended version and the published package is verified.

## Authority model

Before release, establish all of the following explicitly:

- release repository;
- release branch/ref;
- exact commit SHA;
- package name;
- intended package version;
- workflow filename;
- PyPI Trusted Publisher repository/workflow/environment tuple.

Do not silently substitute a canonical repository, mirror, fork, branch, or historical SHA. If a release mirror is intentionally used, prove its source tree/release state before treating it as release authority.

For the 2.0.3 recovery, the release execution repository was `praveshjannath/lbe-ci-validation`, branch `main`, with workflow `publish-python-runtime.yml` and PyPI environment `pypi`.

## Proven failure history from the 2.0.3 recovery

The recovery exposed several distinct failure classes. They must not be collapsed into one generic CI failure.

### 1. GitHub account billing lock

A public repository does not guarantee GitHub Actions execution. The canonical `Letterblack0306/LBE_Presistent_Agent_wall` workflow was blocked because the GitHub account itself was locked due to a billing issue.

Classification: `ACCOUNT/CI_EXECUTION_BLOCKED`.

This is not a repository-visibility defect and not a product failure.

### 2. Missing TUI test dependency

The mirrored validation suite initially installed only `.[test]`, while the full suite required the declared TUI extra.

Repair:

```text
python -m pip install .[test,tui]
```

Classification: `RELEASE_HARNESS_DEPENDENCY_INSTALL_DEFECT`.

### 3. Missing build backend/frontend provisioning

The validation/release environment also required explicit build tooling provisioning.

Proven working preparation included:

```text
python -m pip install --upgrade pip
python -m pip install "setuptools>=75" "build"
python -m pip install .[test,tui]
```

### 4. `python -m build` resolved incorrectly

Publication run `32282854844` reached the artifact-build stage and failed before publishing with:

```text
No module named build.__main__; 'build' is a package and cannot be directly executed
```

The PyPI publish step was skipped, so this was not an OIDC or Trusted Publisher rejection.

Repair used for the publication workflow:

```text
python -I -m build .
```

and explicitly installed the PyPA `build` frontend.

The isolated local probe successfully produced:

```text
lbe_guard_inspector-2.0.3-py3-none-any.whl
lbe_guard_inspector-2.0.3.tar.gz
```

The successful local probe proves artifact construction only. It does not prove GitHub publication or PyPI mutation.

## Release procedure

### Gate 1 — establish exact release authority

Record:

```text
REPOSITORY=<owner/repository>
BRANCH=<release branch>
HEAD=<exact SHA>
PACKAGE=<distribution name>
VERSION=<intended version>
VALIDATION_WORKFLOW=<workflow>
PUBLICATION_WORKFLOW=<workflow>
PYPI_ENVIRONMENT=<environment>
```

Require local HEAD, remote release ref, and intended release SHA to agree before dispatch.

### Gate 2 — verify version uniqueness

Before publication, query PyPI and prove that the intended version is absent.

If the version already exists, stop. PyPI releases are immutable for normal release purposes; do not assume an existing version can simply be overwritten.

### Gate 3 — run full validation matrix

Run the validation workflow on the exact release SHA.

For the recovered LBE workflow the matrix covered:

- Ubuntu: Python 3.11, 3.12, 3.13, 3.14;
- Windows: Python 3.11, 3.12, 3.13, 3.14.

Required stages include dependency installation, the full Python test suite, and wheel construction.

Do not publish merely because some matrix jobs are green. All required jobs must succeed on the same exact SHA.

### Gate 4 — prove artifact construction

The publication environment must explicitly provision the packaging frontend/backend required by the workflow.

Reference preparation:

```text
python -m pip install --upgrade pip
python -m pip install "setuptools>=75" "build"
python -m pip install .[test,tui]
```

Reference artifact command:

```text
python -I -m build .
```

Expected output is both the exact-version wheel and source distribution.

Artifact verification must check package name and exact version rather than merely checking that `dist/` contains files.

### Gate 5 — Trusted Publisher identity check

Before dispatch, verify the PyPI project's OpenID Connect Trusted Publisher tuple matches the actual execution boundary:

```text
Repository: <owner/repository>
Workflow: <workflow filename>
Environment: <environment name>
```

GitHub workflow permissions must permit OIDC token issuance (`id-token: write`), and the publishing job must use the configured environment where required.

Do not diagnose Trusted Publishing until the workflow actually reaches the publishing step. Failures in checkout, tests, dependency installation, or artifact construction are pre-publish failures.

### Gate 6 — publication dispatch

Dispatch the publication workflow once against the proven release ref.

Observe each boundary independently:

```text
checkout
→ runtime setup
→ metadata/version read
→ dependency installation
→ full tests
→ exact artifact build
→ artifact verification
→ PyPI Trusted Publishing
```

If any stage fails, stop. Capture the first decisive failure and classify it. Do not blindly re-run.

### Gate 7 — post-publication proof

A green GitHub Actions run is necessary but not sufficient as the final external proof.

After the workflow reports success:

1. Verify the exact version exists on PyPI.
2. Confirm the published distribution name/version are correct.
3. Install the exact version into a clean environment from PyPI.
4. Run a minimal import/CLI smoke test against the installed distribution.
5. Record workflow run ID, release SHA, version, artifact names, and verification result.

Only then classify the release as successfully published.

## Failure classification

Use the earliest proven failing boundary.

```text
ACCOUNT/CI_EXECUTION_BLOCKED
RELEASE_AUTHORITY_MISMATCH
VERSION_ALREADY_EXISTS
RELEASE_HARNESS_DEPENDENCY_INSTALL_DEFECT
RELEASE_HARNESS_BUILD_BACKEND_PROVISIONING_DEFECT
TEST_FAILURE
ARTIFACT_BUILD_FAILURE
ARTIFACT_VERIFICATION_FAILURE
TRUSTED_PUBLISHING_EXECUTION_FAILURE
POST_PUBLICATION_VERIFICATION_FAILURE
```

Do not call a pre-publish build failure a Trusted Publisher/OIDC failure merely because it occurred in the publication workflow.

## Retry rule

Retries are forbidden until the previous failure has been classified and the corresponding cause has been repaired or disproven.

Correct loop:

```text
observe first failing boundary
→ capture evidence
→ classify
→ authorize bounded repair
→ prove repair locally when possible
→ commit/push exact repair
→ re-run validation on new SHA
→ only then attempt publication
```

Avoid patch-and-retry loops that mutate multiple product/runtime surfaces while debugging release infrastructure.

## Evidence record template

```text
RELEASE_REPOSITORY=
RELEASE_BRANCH=
RELEASE_SHA=
PACKAGE=
VERSION=
VALIDATION_RUN=
VALIDATION_RESULT=
PUBLICATION_RUN=
BUILD_RESULT=
ARTIFACT_VERIFICATION_RESULT=
TRUSTED_PUBLISHING_RESULT=
PYPI_VERSION_PRESENT=
CLEAN_INSTALL_RESULT=
FINAL_CLASSIFICATION=
```

## Proven successful release — lbe-guard-inspector 2.0.3

Final publication evidence:

```text
RELEASE_REPOSITORY=praveshjannath/lbe-ci-validation
RELEASE_BRANCH=main
RELEASE_SHA=c911b511387e9ac675275faab903be4a97ff0a6d
PACKAGE=lbe-guard-inspector
VERSION=2.0.3
PUBLICATION_WORKFLOW=publish-python-runtime.yml
PYPI_ENVIRONMENT=pypi
PUBLICATION_RUN=32287537950
PUBLICATION_JOB=96180530962
BUILD_RESULT=PASS
ARTIFACT_VERIFICATION_RESULT=PASS
TRUSTED_PUBLISHING_RESULT=PASS
PYPI_VERSION_PRESENT=PASS
CLEAN_INSTALL_RESULT=PASS
CLI_SMOKE_RESULT=PASS
FINAL_CLASSIFICATION=PROVEN_SUCCESSFUL_PUBLICATION
```

The publication workflow completed every required stage successfully:

```text
checkout
→ setup Python/Node
→ canonical package metadata read
→ build/test dependency installation
→ full Python suite
→ exact artifact build
→ artifact verification
→ Publish Python runtime to PyPI
```

The immediate visibility check performed directly after workflow completion did not yet observe `2.0.3`. That was a propagation/visibility timing condition, not a publication failure, because the publish step itself had already completed successfully.

Decisive post-publication verification then proved:

- PyPI release endpoint returned version `2.0.3`;
- `pip install lbe-guard-inspector==2.0.3` downloaded and installed the public wheel from PyPI;
- installed metadata reported exactly `2.0.3`;
- package import resolved from the clean verification venv `site-packages`, not the repository source tree;
- `lbe --help` executed successfully from the clean PyPI installation.

The decisive local verification command result was:

```text
COMMAND_HASH=05F9E5A8F78626B5CAF9874DE1AF6681E205148563CB96B3CF336178588BC5E6
COMMAND_STATUS=PASS
PYPI_2_0_3_VISIBLE=PASS
PYPI_CLEAN_INSTALL=PASS
PYPI_INSTALLED_METADATA=PASS
PYPI_IMPORT_ORIGIN=PASS
PYPI_CLI_SMOKE=PASS
LBE_GUARD_INSPECTOR_2_0_3_RELEASE=PROVEN
```

Therefore `lbe-guard-inspector==2.0.3` is a proven successful PyPI Trusted Publishing release. This recovery is closed; no further publication retry is required.
