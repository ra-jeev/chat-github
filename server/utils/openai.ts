import OpenAI from 'openai';
import type { H3Event } from 'h3';

let _openai: OpenAI;
export function useOpenAI() {
  if (!_openai) {
    _openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  return _openai;
}

export const handleMessageWithOpenAI = async (
  event: H3Event,
  messages: OpenAI.Chat.ChatCompletionMessageParam[]
) => {
  const tools: OpenAI.Chat.ChatCompletionTool[] = [
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
          additionalProperties: false,
        },
      },
    },
  ];

  const MODEL = 'gpt-4o-2024-08-06'; // the latest gpt-4o version
  const openai = useOpenAI();
  const response = await openai.chat.completions.create({
    model: MODEL,
    messages,
    tools,
  });

  const responseMessage = response.choices[0].message;
  console.log('OpenAI: responseMessage:: ', responseMessage);
  const toolCalls = responseMessage.tool_calls;

  if (toolCalls) {
    messages.push(responseMessage);

    for (const toolCall of toolCalls) {
      console.log('OpenAI: toolCall:: ', toolCall);
      const functionName = toolCall.function.name;
      if (functionName === 'searchGithub') {
        const functionArgs = JSON.parse(toolCall.function.arguments);
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
          tool_call_id: toolCall.id,
          role: 'tool',
          content: JSON.stringify(functionResponse),
        });
      }
    }

    const finalResponse = await openai.chat.completions.create({
      model: MODEL,
      messages: messages,
    });

    console.log('OpenAI: finalResponse:: ', finalResponse.choices[0].message);

    return finalResponse.choices[0].message.content;
  }

  return responseMessage.content;
};
