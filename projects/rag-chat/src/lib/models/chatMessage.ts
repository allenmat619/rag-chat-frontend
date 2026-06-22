import { MessageType } from "rag-core";
import { ChatHistory } from "./chatHistory";

export class ChatMessage{
  id?: string;
  chatId?: string;
  role?: string;
  content: string;
  messageType: MessageType;
  createdOn: Date;
  chatHistory: ChatHistory;

  constructor(){
    this.id = undefined;
    this.chatId = undefined;
    this.role = undefined;
    this.content = "";
    this.messageType = MessageType.Request;
    this.createdOn = new Date();
    this.chatHistory = new ChatHistory();
  }

  static fromJson(json: any): ChatMessage{
    const chatMessage = new ChatMessage();

    if(json.id){
      chatMessage.id = json.id; 
    }

    if(json.chatId){
      chatMessage.chatId = json.chatId;
    }

    if(json.role){
      chatMessage.role = json.role;
    }

    if(json.messageType){
      chatMessage.messageType = json.messageType;
    }

    if(json.content){
      chatMessage.content = json.content;
    }

    if(json.createdOn){
      chatMessage.createdOn = json.createdOn;
    }

    if(json.chatHistory){
      chatMessage.chatHistory = ChatHistory.fromJson(json.chatHistory);
    }

    return chatMessage;
  }
}