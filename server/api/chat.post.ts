import { runWithTools } from '@cloudflare/ai-utils';

const sum = (args: { a: number; b: number }): Promise<string> => {
  const { a, b } = args;
  return Promise.resolve((a + b).toString());
};

export default defineEventHandler(async (event) => {
  const { message } = await readBody(event);

  // const response = await runWithTools(
  //   event.context.cloudflare.env.AI,
  //   // Model with function calling support
  //   '@hf/nousresearch/hermes-2-pro-mistral-7b',
  //   {
  //     // Messages
  //     messages: [
  //       {
  //         role: 'user',
  //         content: 'What the result of 123123123 + 10343030?',
  //       },
  //     ],
  //     // Definition of available tools the AI model can leverage
  //     tools: [
  //       {
  //         name: 'sum',
  //         description: 'Sum up two numbers and returns the result',
  //         parameters: {
  //           type: 'object',
  //           properties: {
  //             a: { type: 'number', description: 'the first number' },
  //             b: { type: 'number', description: 'the second number' },
  //           },
  //           required: ['a', 'b'],
  //         },
  //         // reference to previously defined function
  //         function: sum,
  //       },
  //     ],
  //   }
  // );

  const tools = [
    {
      name: 'sum',
      description: 'Sum up two numbers and returns the result',
      parameters: {
        type: 'object',
        properties: {
          a: { type: 'number', description: 'the first number' },
          b: { type: 'number', description: 'the second number' },
        },
        required: ['a', 'b'],
      },
    },
  ];

  const messages = [
    {
      role: 'user',
      content: 'What the result of 123123123 + 10343030?',
    },
  ];

  const ai = hubAI();
  let result = await ai.run('@hf/nousresearch/hermes-2-pro-mistral-7b', {
    messages,
    tools,
  });

  while (result.tool_calls !== undefined) {
    for (const tool_call of result.tool_calls) {
      console.log('took tool call', tool_call);
      switch (tool_call.name) {
        case 'sum':
          const fnResponse = await sum(tool_call.arguments);
          messages.push({
            role: 'tool',
            name: tool_call.name,
            content: JSON.stringify(fnResponse),
          });
          console.log('after function call: ', {
            messages,
            messagesJSON: JSON.stringify(messages),
          });
          result = await ai.run('@hf/nousresearch/hermes-2-pro-mistral-7b', {
            messages,
            tools,
          });
          console.log('generating final response:', { result });
          if (result.response !== null) {
            messages.push({ role: 'assistant', content: result.response });
          }
          break;
        default:
          messages.push({
            role: 'tool',
            name: tool_call.name,
            content: `ERROR: Tool not found "${tool_call.name}"`,
          });
          break;
      }
    }
  }
  const finalMessage = messages[messages.length - 1];
  console.log('final message', { finalMessage });
  if (finalMessage.role !== 'assistant') {
    messages.push({ role: 'assistant', content: result.response });
  }

  return messages;
});
