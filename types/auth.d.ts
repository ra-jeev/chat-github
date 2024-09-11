declare module '#auth-utils' {
  interface User {
    id: number;
    login: string;
    name: string;
    avatar_url: string;
    html_url: string;
    public_repos: number;
  }
}

export {};
