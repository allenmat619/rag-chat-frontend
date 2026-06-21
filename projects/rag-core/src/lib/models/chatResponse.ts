import { Source } from "./source";

export interface ChatResponse {
  chatId?: string;
  response: string;
  sources: Source[];
}