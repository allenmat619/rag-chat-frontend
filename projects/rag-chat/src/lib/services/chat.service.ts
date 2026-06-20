import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ChatRequest, ChatResponse } from "rag-core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(
    private http: HttpClient
  ) {}

  sendMessage(request: ChatRequest): Observable<ChatResponse> {

    if(!request || !request.message || request.message.trim() === '') {
      throw new Error('Invalid request: response is required.');
    }

    return this.http.post<ChatResponse>(
      '/api/chat',
      request);
  }
}