import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ChatResponse } from '../../models/chatResponse';
import { ChatRequest } from '../../models/chatRequest';
import { Chat } from '../../models/chat';
import { MessageType } from '../../models/messageType';
import { TypingIndicatorComponent } from '../typing-indicator.component/typing-indicator.component';


@Component({
  selector: 'rag-chat',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatInputModule, FormsModule, MatIconModule, CommonModule, TypingIndicatorComponent],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class ChatComponent implements OnChanges {
  message: string = '';  
  MessageType = MessageType;

  @Input() isLoading: boolean = false;

  @Input() previousMessages: Chat[] = [];

  @Input() chatResponse: ChatResponse | null = null;
  @Output('message-submitted') sendMessageEvent = new EventEmitter<ChatRequest>();

  constructor() {    
  }

  ngOnChanges(changes: any) {
    if (!changes) return;

    if (changes.chatResponse && this.chatResponse) {
      const chatMessage = Chat.fromJson(this.chatResponse);
      this.previousMessages.push(chatMessage);
      this.chatResponse = null;
    }
  }

  sendMessage() {
    if (this.message.trim() !== '') {
      const chatRequest: ChatRequest = {
        message: this.message
      };

      const chatMessage = Chat.fromJson(chatRequest);
      this.previousMessages.push(chatMessage);
      this.message = '';
      this.sendMessageEvent.emit(chatRequest);
    }
  }
}
