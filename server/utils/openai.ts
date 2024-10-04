import OpenAI from 'openai';
import type { H3Event } from 'h3';
import type { UserQuery } from '~~/types';

const MODEL = 'gpt-4o-2024-08-06'; // the latest gpt-4o version
const tools: OpenAI.ChatCompletionTool[] = [
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
            description: 'Number of results to fetch per page (max 25)',
          },
        },
        required: ['endpoint', 'q', 'per_page'],
        additionalProperties: false,
      },
    },
  },
];

let _openai: OpenAI;
function useOpenAI() {
  if (!_openai) {
    _openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  return _openai;
}

export const handleMessageWithOpenAI = async function* (
  event: H3Event,
  messages: OpenAI.ChatCompletionMessageParam[],
  loggedInUser: string
) {
  const openai = useOpenAI();
  const responseStream = await openai.chat.completions.create({
    model: MODEL,
    messages,
    tools,
    stream: true,
  });

  const currentToolCalls: OpenAI.ChatCompletionMessageToolCall[] = [];

  for await (const chunk of responseStream) {
    const choice = chunk.choices[0];

    if (choice.delta.content) {
      yield choice.delta.content;
    }

    if (choice.delta.tool_calls) {
      for (const toolCall of choice.delta.tool_calls) {
        if (toolCall.index !== undefined) {
          if (!currentToolCalls[toolCall.index]) {
            currentToolCalls[toolCall.index] = {
              id: toolCall.id || '',
              type: 'function' as const,
              function: {
                name: toolCall.function?.name || '',
                arguments: '',
              },
            };
          }

          if (toolCall.function?.arguments) {
            currentToolCalls[toolCall.index].function.arguments +=
              toolCall.function.arguments;
          }
        }
      }
    }

    if (choice.finish_reason === 'tool_calls') {
      const queryToSave: UserQuery = {
        userMessage: messages[messages.length - 1].content as string,
        toolCalls: [],
        assistantReply: '',
      };

      messages.push({
        role: 'assistant',
        tool_calls: currentToolCalls,
      });

      for (const toolCall of currentToolCalls) {
        if (toolCall.function.name === 'searchGithub') {
          try {
            const functionArgs = JSON.parse(toolCall.function.arguments);
            const toolResult = await searchGithub(
              event,
              functionArgs.endpoint,
              {
                q: functionArgs.q,
                sort: functionArgs.sort,
                order: functionArgs.order,
                per_page: functionArgs.per_page,
              }
            );

            queryToSave.toolCalls.push({
              request: functionArgs,
              response: toolResult,
            });

            messages.push({
              role: 'tool',
              tool_call_id: toolCall.id,
              content: JSON.stringify(toolResult),
            });
          } catch (error) {
            console.error('Error parsing tool call arguments:', error);
            await saveFailedQuery(
              queryToSave.userMessage,
              toolCall.function.arguments
            );

            throw error;
          }
        }
      }

      try {
        const finalResponse = await openai.chat.completions.create({
          model: MODEL,
          messages,
          stream: true,
        });

        for await (const chunk of finalResponse) {
          if (chunk.choices[0].delta.content) {
            queryToSave.assistantReply += chunk.choices[0].delta.content;
            yield chunk.choices[0].delta.content;
          }
        }

        if (queryToSave.toolCalls.length) {
          await saveUserQuery(loggedInUser, queryToSave);
        }
      } catch (error) {
        console.error(
          'Error generating final response or saving user query :',
          error
        );

        throw error;
      }
    }
  }
};
