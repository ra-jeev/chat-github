export const asyncGeneratorToStream = (
  asyncGenerator: AsyncGenerator<string, void, unknown>
) => {
  let cancelled = false;
  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const value of asyncGenerator) {
          if (cancelled) {
            break;
          }

          controller.enqueue(value);
        }

        controller.close();
      } catch (err) {
        controller.error(err);
      }
    },
    cancel(reason) {
      console.log('Client closed connection. Reason:', reason);
      cancelled = true;
    },
  });

  return stream;
};
