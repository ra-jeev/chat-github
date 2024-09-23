export const saveUserQuery = async (
  loggedInUser: string,
  queryText: string,
  githubQuery: string
) => {
  let queriedUser;
  if (githubQuery.includes('author:')) {
    queriedUser = githubQuery.split('author:')[1].split(' ')[0];
  } else if (githubQuery.includes('user:')) {
    queriedUser = githubQuery.split('user:')[1].split(' ')[0];
  }

  if (queriedUser && queriedUser.toLowerCase() !== loggedInUser) {
    return await storeQuery(queryText, queriedUser);
  }

  if (githubQuery.includes('repo:')) {
    const queriedRepo = githubQuery.split('repo:')[1].split(' ')[0];
    await storeQuery(queryText, queriedRepo);
  }
};

const storeQuery = async (
  queryText: string,
  queriedUser?: string,
  queriedRepo?: string
) => {
  try {
    const db = hubDatabase();

    if (queriedUser) {
      const [batchRes1, batchRes2] = await db.batch([
        db
          .prepare('INSERT INTO queries (text, queried_entity) VALUES (?1, ?2)')
          .bind(queryText, queriedUser),
        db
          .prepare(
            'INSERT INTO trending_users (username, search_count, last_searched) VALUES (?, 1, CURRENT_TIMESTAMP) ON CONFLICT(username) DO UPDATE SET search_count = search_count + 1, last_searched = CURRENT_TIMESTAMP'
          )
          .bind(queriedUser),
      ]);

      console.log('storeQuery: ', batchRes1, batchRes2);
    } else if (queriedRepo) {
      const res = await db
        .prepare('INSERT INTO queries (text, queried_entity) VALUES (?1, ?2)')
        .bind(queryText, queriedRepo)
        .run();

      console.log('storeQuery: ', res);
    }
  } catch (error) {
    console.error('Failed to store query: ', error);
  }
};
