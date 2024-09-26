export default defineCachedEventHandler(
  async () => {
    const results = await getRecentQueries();

    return results;
  },
  {
    maxAge: 10 * 60, // 10 minutes
  }
);
