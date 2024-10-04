# <img src="./public/favicon.svg" alt="chat github" style="width:28px; vertical-align: middle;"> Chat GitHub: Search GitHub in Plain English

[![CHAT GITHUB HOME](/assets/home.png)](https://chat-github.nuxt.dev)

## Try It Out

Chat GitHub Demo: <https://chat-github.nuxt.dev>

[![Deploy to NuxtHub](https://hub.nuxt.com/button.svg)](https://hub.nuxt.com/new?template=chat-github)

## Overview

Chat GitHub is an innovative tool that allows you to search and explore GitHub using natural language queries, powered by AI. Say goodbye to complex search parameters and hello to intuitive, conversation-style GitHub exploration.

[Read the blog post on how I created Chat GitHub](https://rajeev.dev/building-a-chat-interface-to-search-github?ref=github-repo).

[![CHAT GITHUB](/assets/chat.png)](https://chat-github.nuxt.dev)

## Features

- **Natural Language Search:** Query GitHub using plain English, no need for complex search parameters.
- **Comprehensive GitHub Data:** Search across multiple GitHub endpoints:
  - Users (/search/users)
  - Repositories (/search/repositories)
  - Issues (/search/issues)
  - Commits (/search/commits)
- **AI-Powered Responses:** Leverages OpenAI to interpret queries and provide concise, relevant information.
- **User Authentication:** Secure access via GitHub OAuth.
- **Trending Users:** Discover popular GitHub users based on search trends.
- **Anonymized Query Logging:** Privacy-focused logging of search queries for analytics and trending features.

## Built with

- [Nuxt](https://nuxt.com): Vue.js framework for the application foundation
- [Nuxt UI](https://ui.nuxt.com): Module for creating a sleek and responsive interface
- [Nuxt Auth Utils](https://github.com/atinux/nuxt-auth-utils): Module for user authentication
- [NuxtHub](https://hub.nuxt.com): Backend (`database`, `cache` etc.), deployment and administration platform for Nuxt, powered by Cloudflare
- [Nuxt MDC](https://github.com/nuxt-modules/mdc): For parsing and displaying chat messages
- [Open AI](https://openai.com): For intelligently searching and interpreting GitHub data in real-time.
- [OctoKit/Rest](https://github.com/octokit/rest.js): For interacting with the GitHub Rest APIs.

## Setup

### Prerequisites

Apart from the usual Node and package manager dependencies, you should have the following ready for running the project:

- **A GitHub account:** To generate GITHUB_TOKEN to make API queries, and creating an OAuth App for authentication
- **An OpenAI account:** To create an OpenAI API key

### Install dependencies

```bash
pnpm install
```

### Environment Variables

Rename `.env.example` file present in the project root to `.env` and add the following missing values:

```bash
NUXT_SESSION_PASSWORD=at_least_32_chars_string
NUXT_OAUTH_GITHUB_CLIENT_ID=github_oauth_client_id
NUXT_OAUTH_GITHUB_CLIENT_SECRET=github_oauth_client_secret
NUXT_GITHUB_TOKEN=your_personal_access_token
OPENAI_API_KEY=your_openai_api_key
```

## Usage

### Running the Development Server

```bash
pnpm dev
```

The app will be available at `http://localhost:3000`.

### Searching GitHub

After logging in with your GitHub credentials, you can start querying GitHub data using natural language. Here are some example queries to get you started:

- "How many stars does the nuxt/nuxt repo has?"
- "Which one is my most starred repo?"
- "Find atinux's first ever commit." etc.

Tips for effective searching:

- Use GitHub usernames for more accurate results when searching for specific users.
- Be as specific as possible in your queries for the best results.
- Keep queries relatively simple. Complex queries may not work as expected.
- 'Use exact dates / time range for queries involving time (e.g., prefer 2024 over last year).'.
- Remember, the app can only access public data unless your `GITHUB_TOKEN` has additional permissions.

Note: GitHub API has rate limits. If you encounter any issues, wait a few minutes before trying again.

## Deployment

[![Deploy to NuxtHub](https://hub.nuxt.com/button.svg)](https://hub.nuxt.com/new?template=chat-github)

Before you can deploy the project you should have the following:

- [NuxtHub Account](https://hub.nuxt.com): For managing NuxtHub apps, database & cache in development / production
- [Cloudflare Account](https://cloudflare.com): Used behind the scenes by NuxtHub

Once you're ready, you can deploy using either the following ways:

### Deploy via NuxtHub Admin

- Push your code to a GitHub repository.
- Link the repository with NuxtHub.
- Do not forget to add the environment variables
- Deploy from the Admin console.

[Learn more about Git integration](https://hub.nuxt.com/docs/getting-started/deploy#cloudflare-pages-ci)
  
### Deploy via NuxtHub CLI

```bash
npx nuxthub deploy
```

[Learn more about CLI deployment](https://hub.nuxt.com/docs/getting-started/deploy#nuxthub-cli)

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.
