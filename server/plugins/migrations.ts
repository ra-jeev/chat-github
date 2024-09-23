export default defineNitroPlugin(() => {
  // Only run migrations in development
  if (import.meta.dev) {
    onHubReady(async () => {
      await hubDatabase().exec(
        `DROP TABLE IF EXISTS queries;`.replace(/\n/g, '')
      );

      await hubDatabase().exec(
        `CREATE TABLE IF NOT EXISTS queries (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          text TEXT NOT NULL,
          queried_entity TEXT NOT NULL,
          queried_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `.replace(/\n/g, '')
      );

      await hubDatabase().exec(
        `CREATE INDEX IF NOT EXISTS idx_queried_at ON queries(queried_at);
      `.replace(/\n/g, '')
      );

      await hubDatabase().exec(
        `CREATE TABLE IF NOT EXISTS trending_users (
          username TEXT PRIMARY KEY,
          search_count INTEGER NOT NULL,
          last_searched DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `.replace(/\n/g, '')
      );

      await hubDatabase().exec(
        `CREATE INDEX IF NOT EXISTS idx_search_count_last_searched ON trending_users(search_count DESC, last_searched DESC);
      `.replace(/\n/g, '')
      );
    });
  }
});
