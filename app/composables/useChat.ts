export function useChat(apiBase: string, body: Record<string, unknown>) {
  async function* chat(): AsyncGenerator<string, void, unknown> {
    try {
      const response = await $fetch(apiBase, {
        method: 'POST',
        body,
        responseType: 'stream',
      });

      let buffer = '';
      const reader = (response as ReadableStream)
        .pipeThrough(new TextDecoderStream())
        .getReader();

      while (true) {
        const { value, done } = await reader.read();

        if (done) {
          if (buffer.trim()) {
            console.warn('Stream ended with unparsed data:', buffer);
          }

          return;
        }

        buffer += value;
        const messages = buffer.split('\n\n');
        buffer = messages.pop() || '';

        for (const message of messages) {
          const lines = message.split('\n');
          let event = '';
          let data = '';

          for (const line of lines) {
            if (line.startsWith('event:')) {
              event = line.slice('event:'.length).trim();
            } else if (line.startsWith('data:')) {
              data = line.slice('data:'.length).trim();
            }
          }

          if (event === 'error') {
            const parsedError = JSON.parse(data);
            console.error('Stream error:', parsedError);

            throw new Error(
              parsedError.message ?? 'Failed to generate response'
            );
          } else if (data) {
            if (data === '[DONE]') return;

            try {
              const jsonData = JSON.parse(data);
              if (jsonData.response) {
                yield jsonData.response;
              }
            } catch (parseError) {
              console.warn('Error parsing JSON:', parseError);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  return chat;
}
