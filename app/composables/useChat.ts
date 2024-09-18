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
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice('data: '.length).trim();
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
