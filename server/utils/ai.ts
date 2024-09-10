import type { AiTextGenerationInput } from '@cloudflare/workers-types/experimental';
import type { SearchParams } from './github';

type ResultType = {
  response?: string;
  tool_calls?: {
    name: string;
    arguments: unknown;
  }[];
};

export const handleMessageWithHubAI = async (
  messages: {
    role: 'system' | 'user' | 'assistant' | 'tool';
    name?: string;
    content: string;
  }[]
) => {
  const tools = [
    {
      type: 'function',
      function: {
        name: 'searchGithub',
        description: 'Searches GitHub for information using the GitHub API',
        parameters: {
          type: 'object',
          properties: {
            endpoint: {
              type: 'string',
              description: `The specific search endpoint to use. One of ['commits', 'issues', 'repositories', 'users']`,
            },
            q: { type: 'string', description: 'the search query' },
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

  console.log('initial response:', result);

  if (result.tool_calls) {
    for (const tool_call of result.tool_calls) {
      console.log('taking tool call', tool_call);
      if (tool_call.name === 'searchGithub') {
        const functionArgs = tool_call.arguments as SearchParams;

        const functionResponse = await searchGithub(functionArgs.endpoint, {
          ...functionArgs,
        });

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

    console.log('final Response:: ', secondResponse);

    return secondResponse.response;
  }

  return result.response;
};
