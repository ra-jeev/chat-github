import { Groq } from 'groq-sdk';
import type { H3Event } from 'h3';

let _groq: Groq;
function useGroq() {
  if (!_groq) {
    _groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
  }

  return _groq;
}

export async function handleMessageWithGroq(
  event: H3Event,
  messages: Groq.Chat.ChatCompletionMessageParam[]
) {
  const tools: Groq.Chat.ChatCompletionTool[] = [
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

  const groq = useGroq();
  const MODEL = 'llama-3.1-70b-versatile';

  const response = await groq.chat.completions.create({
    model: MODEL,
    messages,
    tools,
    tool_choice: 'auto',
    max_tokens: 4096,
  });

  const responseMessage = response.choices[0].message;
  console.log('responseMessage:: ', responseMessage);
  const toolCalls = responseMessage.tool_calls;

  if (toolCalls) {
    messages.push(responseMessage);

    for (const toolCall of toolCalls) {
      console.log('toolCall:: ', toolCall);
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

    const secondResponse = await groq.chat.completions.create({
      model: MODEL,
      messages: messages,
    });

    console.log('secondResponse:: ', secondResponse.choices[0].message);

    return secondResponse.choices[0].message.content;
  }

  return responseMessage.content;
}
