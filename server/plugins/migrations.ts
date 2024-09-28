export default defineNitroPlugin(() => {
  if (import.meta.dev) {
    onHubReady(async () => {
      await hubDatabase().exec(
        `CREATE TABLE IF NOT EXISTS queries (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          text TEXT NOT NULL,
          response TEXT NOT NULL,
          github_request TEXT NOT NULL,
          github_response TEXT NOT NULL,
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
          avatar_url TEXT,
          search_count INTEGER NOT NULL,
          last_searched DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `.replace(/\n/g, '')
      );

      await hubDatabase().exec(
        `CREATE INDEX IF NOT EXISTS idx_search_count_last_searched ON trending_users(search_count DESC, last_searched DESC);
      `.replace(/\n/g, '')
      );

      await hubDatabase().exec(
        `CREATE TABLE IF NOT EXISTS registered_users (
          username TEXT PRIMARY KEY,
          avatar_url TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `.replace(/\n/g, '')
      );

      await hubDatabase().exec(
        `CREATE TABLE IF NOT EXISTS failed_queries (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          text TEXT NOT NULL,
          github_request TEXT NOT NULL,
          queried_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `.replace(/\n/g, '')
      );
    });
  }
});
