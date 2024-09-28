export const asyncGeneratorToStream = (
  asyncGenerator: AsyncGenerator<string, void, unknown>
) => {
  let cancelled = false;
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      console.log('Client connected. Starting stream.');
      try {
        for await (const value of asyncGenerator) {
          if (cancelled) {
            break;
          }

          controller.enqueue(encoder.encode(value));
        }

        console.log('Stream ended. Closing connection.');
        controller.close();
      } catch (err) {
        controller.error(err);
        console.log('Error in stream:', err);

        throw createError({
          statusCode: 500,
          statusMessage: 'Internal Server Error',
          message:
            err instanceof Error ? err.message : 'An unknown error occurred',
        });
      }
    },
    cancel(reason) {
      console.log('Client closed connection. Reason:', reason);
      cancelled = true;
    },
  });

  return stream;
};
