export default defineCachedEventHandler(
  async () => {
    const results = await getTrendingUsers();

    return results;
  },
  {
    maxAge: 10 * 60, // 10 minutes
  }
);
