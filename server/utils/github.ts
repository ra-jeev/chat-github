import { Octokit } from '@octokit/rest';
import type { H3Event } from 'h3';
import type { SearchParams } from '~~/types';

const allowedEndpoints = {
  commits: 'GET /search/commits',
  issues: 'GET /search/issues',
  repositories: 'GET /search/repositories',
  users: 'GET /search/users',
} as const;

type EndpointType = keyof typeof allowedEndpoints;

let _octokit: Octokit;

function useOctokit() {
  if (!_octokit) {
    _octokit = new Octokit({
      auth: process.env.NUXT_GITHUB_TOKEN,
    });
  }

  return _octokit;
}

export const searchGithub = defineCachedFunction(
  async (
    event: H3Event,
    endpoint: string,
    params: Omit<SearchParams, 'endpoint'>
  ) => {
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

      console.log(`Generated response for ${endpoint} with params:`, params);

      return response.data;
    } catch (error) {
      console.error(error);
      throw createError({
        statusCode: 500,
        message: 'Error searching GitHub',
      });
    }
  },
  {
    maxAge: 60 * 60,
    group: 'github',
    name: 'search',
    getKey: (
      event: H3Event,
      endpoint: string,
      params: Omit<SearchParams, 'endpoint'>
    ) => {
      const q = params.q.trim().toLowerCase().split(' ');

      const mainQuery = q.filter((term) => !term.includes(':')).join(' ');
      const qualifiers = q.filter((term) => term.includes(':')).sort();

      const finalQuery = [...(mainQuery ? [mainQuery] : []), ...qualifiers]
        .join(' ')
        .replace(/[\s:]/g, '_');

      let key = endpoint + '_q_' + finalQuery;

      if (params.per_page) {
        key += '_per_page_' + params.per_page;
      }

      if (params.order) {
        key += '_order_' + params.order;
      }

      if (params.sort) {
        key += '_sort_' + params.sort;
      }

      return key;
    },
  }
);
