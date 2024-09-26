export type Message = {
  id: string;
  role: string;
  content: string;
};

export type SearchParams = {
  endpoint: string;
  q: string;
  order?: string;
  sort?: string;
  per_page: string;
};

export type ToolCallDetails = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  response: any;
  request: SearchParams;
};

export type UserQuery = {
  userMessage: string;
  toolCalls: ToolCallDetails[];
  assistantReply: string;
};
