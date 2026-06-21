import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ChatResponse } from '../../models/chatResponse';
import { ChatRequest } from '../../models/chatRequest';
import { ChatMessage } from '../../models/chatMessage';
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
  previousMessages: ChatMessage[] = [];
  MessageType = MessageType;
  thinkingText: string = 'Thinking';
  private thinkingInterval?: number;  

  @Input()isLoading: boolean = false;

  @Input() chatResponse: ChatResponse | null = null;
  @Output('message-submitted') sendMessageEvent = new EventEmitter<ChatRequest>();

  constructor(private cdr: ChangeDetectorRef) {    
  }

  ngOnChanges(changes: any) {
    if (!changes) return;

    if (changes.chatResponse && this.chatResponse) {
      const chatMessage = ChatMessage.fromJson(this.chatResponse);
      this.previousMessages.push(chatMessage);
      this.chatResponse = null;
    }
  }

  private startThinkingAnimation(): void {
    const dots = [
      '.',
      '..',
      '...'
    ];

    let index = 0;
    this.thinkingText = 'Thinking.';
    this.thinkingInterval = window.setInterval(() => {
      this.thinkingText =
        'Thinking' + dots[index];
        this.cdr.detectChanges();
      index = (index + 1) % dots.length;
    }, 100);
  }

  private stopThinkingAnimation(): void {
    if (this.thinkingInterval) {
      clearInterval(this.thinkingInterval);
      this.thinkingInterval = undefined;
    }
  }

  sendMessage() {
    if (this.message.trim() !== '') {
      const chatRequest: ChatRequest = {
        message: this.message
      };

      const chatMessage = ChatMessage.fromJson(chatRequest);
      this.previousMessages.push(chatMessage);
      this.message = '';
      this.sendMessageEvent.emit(chatRequest);
    }
  }
}
