import type { H3Event } from 'h3';
import type { AiTextGenerationInput } from '@cloudflare/workers-types/experimental';

type ResultType = {
  response?: string;
  tool_calls?: {
    name: string;
    arguments: unknown;
  }[];
};

export const handleMessageWithHubAI = async (
  event: H3Event,
  messages: {
    role: 'system' | 'user' | 'assistant' | 'tool';
    name?: string;
    tool_call?: string;
    content: string;
  }[]
) => {
  const tools = [
    {
      type: 'function',
      function: {
        name: 'searchGithub',
        description:
          'Searches GitHub for information using the GitHub API. Call this if you need to find information on GitHub.',
        parameters: {
          type: 'object',
          properties: {
            endpoint: {
              type: 'string',
              description: `The specific search endpoint to use. One of ['commits', 'issues', 'repositories', 'users']`,
            },
            q: {
              type: 'string',
              description: 'the search query using applicable qualifiers',
            },
            sort: {
              type: 'string',
              description: 'The sort field (optional, depends on the endpoint)',
            },
            order: {
              type: 'string',
              description: 'The sort order (optional, asc or desc)',
            },
            per_page: {
              type: 'string',
              description:
                'Number of results to fetch per page (optional, max 5)',
            },
          },
          required: ['endpoint', 'q', 'per_page'],
        },
      },
    },
  ];

  const ai = hubAI();
  const model = '@hf/nousresearch/hermes-2-pro-mistral-7b';

  const result = (await ai.run(model, {
    messages,
    tools,
  } as AiTextGenerationInput)) as ResultType;

  console.log('hubAI:: initial response:', result);

  if (result.tool_calls) {
    messages.push({
      role: 'assistant',
      tool_call: result.tool_calls[0].name,
      content: '',
    });

    for (const tool_call of result.tool_calls) {
      console.log('taking tool call', tool_call);
      if (tool_call.name === 'searchGithub') {
        const functionArgs = tool_call.arguments as SearchParams;

        const functionResponse = await searchGithub(
          event,
          functionArgs.endpoint,
          {
            q: functionArgs.q,
            sort: functionArgs.sort,
            order: functionArgs.order,
            per_page: functionArgs.per_page,
          }
        );

        messages.push({
          role: 'tool',
          name: tool_call.name,
          content: JSON.stringify(functionResponse),
        });
      }
    }

    const secondResponse = (await ai.run(model, {
      messages,
      tools,
    } as AiTextGenerationInput)) as ResultType;

    console.log('hubAI:: final Response:: ', secondResponse);

    return secondResponse.response;
  }

  return result.response;
};
