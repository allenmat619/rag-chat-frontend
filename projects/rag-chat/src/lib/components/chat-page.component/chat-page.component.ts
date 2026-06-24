import { ChangeDetectorRef, Component } from '@angular/core';
import { Chat, ChatComponent, ChatRequest, ChatResponse } from 'rag-core';
import { ChatService } from '../../services/chat.service';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ChatSideNavComponent } from '../chat-side-nav.component/chat-side-nav.component';
import { SelectedChat } from '../../models/selectedChat';

@Component({
  selector: 'rag-chat-page',
  standalone: true,
  imports: [ChatComponent, MatSidenavModule, MatButton, MatIconModule, ChatSideNavComponent],
  templateUrl: './chat-page.component.html',
  styleUrl: './chat-page.component.css',
})
export class ChatPageComponent {
  chatResponse: ChatResponse | null = null;
  isLoading: boolean = false;
  showFiller = false;
  reloadChats: boolean = false;
  selectedChatId?: string;

  previousMessages: Chat[] = [];

  constructor(
    private chatService: ChatService,
    private cdr: ChangeDetectorRef
  ) { }

  onMessageSubmitted(message: ChatRequest) {
    console.log('Message submitted:', message);
    this.isLoading = true;
    message.chatId = this.selectedChatId;
    this.reloadChats = false;

    this.chatService.sendMessage(message).subscribe({
      next: (response) => {
        this.chatResponse = response;
        this.isLoading = false;
        this.reloadChats = true;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.isLoading = false;
        this.cdr.detectChanges();
        console.error('Error occurred:', error);
      }
    });
  }

  onChatSelected(selectedChat: SelectedChat){
    this.selectedChatId = selectedChat.chatId;
    this.previousMessages = [...selectedChat.chats];
  }
}
