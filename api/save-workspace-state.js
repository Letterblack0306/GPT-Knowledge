function send(res, status, body) {
  res.status(status).setHeader('content-type', 'application/json; charset=utf-8');
  res.setHeader('cache-control', 'no-store');
  res.send(JSON.stringify(body));
}

export default function handler(_req, res) {
  res.setHeader('allow', 'GET');
  return send(res, 410, {
    ok: false,
    error: 'READ_ONLY_DEPLOYMENT',
    message: 'Workspace state mutation is disabled on GPT-K.'
  });
}
