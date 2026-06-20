import { ChatRequest } from "rag-core";
import { Source } from "./source";
import { MessageType } from "./messageType";
import { marked } from "marked";

export class ChatMessage {
  chatId?: string;
  message: string | Promise<string>;
  sources: Source[];
  type: MessageType;

  constructor(){
    this.chatId = undefined;
    this.message = '';
    this.sources = [];
    this.type = MessageType.Request;
  }

  static fromJson(json: any): ChatMessage {
    const chatMessage = new ChatMessage();
    if(json.chatId){
      chatMessage.chatId = json.chatId;
    }
    if(json.message){
      chatMessage.message = json.message;
      chatMessage.type = MessageType.Request;
    }
    else if(json.response){
      chatMessage.message = marked.parse(json.response);
      chatMessage.type = MessageType.Response;
    }
    if(json.sources && Array.isArray(json.sources)){
      chatMessage.sources = [...json.sources];
    }
    return chatMessage;
  }
}