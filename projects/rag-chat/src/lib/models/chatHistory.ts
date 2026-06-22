import { ChatMessage } from "./chatMessage";

export class ChatHistory{
  chatId?: string;
  title?: string;
  createdOn: Date;
  messages: ChatMessage[];

  constructor(){
    this.chatId = undefined;
    this.title = undefined;
    this.createdOn = new Date();
    this.messages = []
  }

  static fromJson(json: any): ChatHistory{
    const chatHistory = new ChatHistory();

    if(json.chatId){
      chatHistory.chatId = json.chatId;
    }
    if(json.title){
      chatHistory.title = json.title;
    }
    if(json.createdOn){
      chatHistory.createdOn = json.createdOn;
    }
    if(json.messages && Array.isArray(json.messages)){
      json.messages.forEach((message : any) => {
        chatHistory.messages.push(ChatMessage.fromJson(message));
      });
    }

    return chatHistory;
  }
}