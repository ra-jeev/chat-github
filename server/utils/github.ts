import { Octokit } from '@octokit/rest';
import type { H3Event } from 'h3';

let _octokit: Octokit;

export function useOctokit() {
  if (!_octokit) {
    _octokit = new Octokit({
      auth: process.env.NUXT_GITHUB_TOKEN,
    });
  }

  return _octokit;
}

const allowedEndpoints = {
  commits: 'GET /search/commits',
  issues: 'GET /search/issues',
  repositories: 'GET /search/repositories',
  users: 'GET /search/users',
} as const;

type EndpointType = keyof typeof allowedEndpoints;

export type SearchParams = {
  endpoint: string;
  q: string;
  order?: string;
  sort?: string;
  per_page: string;
};

export const searchGithub = defineCachedFunction(
  async (
    event: H3Event,
    endpoint: string,
    params: Omit<SearchParams, 'endpoint'>
  ) => {
    console.log(
      'incoming searchGitbub request for endpoint',
      endpoint,
      'with params: ',
      params
    );

    if (!endpoint || !allowedEndpoints[endpoint as EndpointType]) {
      throw createError({
        statusCode: 404,
        message: 'Endpoint not supported',
      });
    }

    const octokit = useOctokit();
    const endpointToUse = allowedEndpoints[endpoint as EndpointType];

    try {
      const response = await octokit.request(endpointToUse as string, params);

      return response.data;
    } catch (error) {
      console.error(error);
    }
  },
  {
    maxAge: 60 * 60,
    name: 'githubSearch',
    getKey: (
      event: H3Event,
      endpoint: string,
      params: Omit<SearchParams, 'endpoint'>
    ) =>
      `${endpoint}:q:${params.q}:per_page:${params.per_page}${
        params.order ? 'order:' + params.order : ''
      }:${params.sort ? 'sort:' + params.sort : ''}`,
  }
);

// tryGithub(
//   allowedEndpoints.issues,
//   'is:pr author:ra-jeev',
//   'asc',
//   'updated',
//   1
// ).then((data: any) => console.log(JSON.stringify(data, null, 2)));
