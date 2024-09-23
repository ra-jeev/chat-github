export default defineEventHandler(async (event) => {
  const userSession = await requireUserSession(event);

  const { messages } = await readBody(event);
  if (!messages) {
    throw createError({
      statusCode: 400,
      message: 'User messages are required',
    });
  }

  const llmMessages = [
    {
      role: 'system',
      content: getSystemPrompt(userSession.user.login),
    },
    ...messages,
  ];

  return asyncGeneratorToStream(
    handleMessageWithOpenAI(event, llmMessages, userSession.user.login)
  );
});
