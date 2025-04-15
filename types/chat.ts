export enum EChatRole {
  USER = 'user',
  ASSISTANT = 'assistant',
}

export interface Message {
  id: string;
  content: string;
  role: EChatRole;
  timestamp: number;
}
