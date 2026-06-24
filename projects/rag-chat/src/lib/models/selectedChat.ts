import { Chat } from "rag-core";

export interface SelectedChat{
  chatId?: string;
  chats: Chat[];
}