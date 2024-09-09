import { Octokit } from '@octokit/rest';

let _octokit: Octokit;

export function useOctokit() {
  if (!_octokit) {
    _octokit = new Octokit({
      auth: process.env.NUXT_GITHUB_TOKEN,
    });
  }

  return _octokit;
}
