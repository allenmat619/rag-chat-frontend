import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ChatRequest, ChatResponse } from "rag-core";
import { Observable } from "rxjs";
import { ChatHistory } from "../models/chatHistory";

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(
    private http: HttpClient
  ) { }


  getAllChats(): Observable<ChatHistory[]> {
    return this.http.get<ChatHistory[]>('/api/chat')
  }


  sendMessage(request: ChatRequest): Observable<ChatResponse> {
    if (!request || !request.message || request.message.trim() === '') {
      throw new Error('Invalid request: response is required.');
    }
    return this.http.post<ChatResponse>(
      '/api/chat',
      request);
  }

  deleteChat(chatId: string): Observable<any> {
    if (!chatId) {
      throw new Error("Invalid chat id");
    }

    return this.http.delete(`/api/chat/${chatId}`);
  }

  deleteChats(chatIds: string[]): Observable<any> {
    if (!chatIds) {
      throw new Error("Invalid chat id");
    }

    let params = new HttpParams();

    chatIds.forEach(id => {
      params = params.append('id', id);
    });

    return this.http.delete("/api/chat", {params});
  }
}