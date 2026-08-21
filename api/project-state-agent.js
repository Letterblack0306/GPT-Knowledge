export default async function handler(req, res) {
  // GPT-Knowledge's existing deployed GitHub App credential may be exposed under
  // the legacy GITHUB_TOKEN environment name. Keep the project-state core free of
  // repository-committed secrets while adapting the deployment environment here.
  if (!process.env.GITHUB_APP_PRIVATE_KEY && process.env.GITHUB_TOKEN) {
    process.env.GITHUB_APP_PRIVATE_KEY = process.env.GITHUB_TOKEN;
  }
  const module = await import('./project-state.js');
  const core = module.default?.default || module.default || module.handler;
  if (typeof core !== 'function') {
    throw new TypeError('PROJECT_STATE_HANDLER_NOT_RESOLVED');
  }
  return core(req, res);
}
