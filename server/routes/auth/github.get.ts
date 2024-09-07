export default oauthGitHubEventHandler({
  config: {
    emailRequired: true,
  },
  async onSuccess(event, { user, tokens }) {
    console.log('on success called with', user, tokens);
    await setUserSession(event, {
      user,
    });

    return sendRedirect(event, '/');
  },
  // Optional, will return a json error and 401 status code by default
  onError(event, error) {
    console.error('GitHub OAuth error:', error);
    return sendRedirect(event, '/');
  },
});
