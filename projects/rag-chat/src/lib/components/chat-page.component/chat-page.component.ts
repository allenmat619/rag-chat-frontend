import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Chat, ChatComponent, ChatRequest, ChatResponse } from 'rag-core';
import { ChatService } from '../../services/chat.service';
import { ChatHistory } from '../../models/chatHistory';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { marked } from "marked";
import { map, Observable, of, switchMap } from 'rxjs';

@Component({
  selector: 'rag-chat-page',
  standalone: true,
  imports: [ChatComponent, MatSidenavModule, MatButton, MatIconModule, MatListModule],
  templateUrl: './chat-page.component.html',
  styleUrl: './chat-page.component.css',
})
export class ChatPageComponent implements OnInit {
  chatResponse: ChatResponse | null = null;
  isLoading: boolean = false;
  showFiller = false;
  allChats: ChatHistory[] = [];
  selectedChat?: ChatHistory;

  previousMessages: Chat[] = [];

  constructor(
    private chatService: ChatService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadAllChats().subscribe();
  }

  loadAllChats(): Observable<ChatHistory[]> {
    return this.chatService.getAllChats().pipe(
      map(result => {
        this.allChats = result.map(chat => ChatHistory.fromJson(chat));
        return this.allChats;
      })
    );


    // return this.chatService.getAllChats().subscribe({
    //   next: (result) => {
    //     if (result && Array.isArray(result)) {
    //       result.forEach(chat => {
    //         this.allChats.push(ChatHistory.fromJson(chat));
    //       });
    //     }
    //   },
    //   error: (error) => {
    //     console.error("Failed to load previous chats", error);
    //   }
    // });
  }

  onMessageSubmitted(message: ChatRequest) {
    console.log('Message submitted:', message);
    this.isLoading = true;
    message.chatId = this.selectedChat?.chatId;


    this.chatService.sendMessage(message).pipe(
      switchMap(response => {
        this.chatResponse = response;
        this.isLoading = false;
        this.cdr.detectChanges();
        console.log('Response received:', response);
        return this.loadAllChats();
      },
      (error) => {
        this.isLoading = false;
        this.cdr.detectChanges();
        console.error('Error occurred:', error);
        return of(null);
      })
    ).subscribe({
      error: (error) => {
        console.error("Failed to load previous chats", error);
      }
    });
  }

  newChat() {
    this.selectedChat = undefined;
    this.previousMessages = [];
  }

  selectChat(chatId?: string) {
    this.previousMessages = [];
    this.selectedChat = this.allChats.find(c => c.chatId === chatId);
    this.selectedChat?.messages.forEach(message => {
      const parsedMessage = message.messageType ? marked.parse(message.content) : message.content;
      const chat: Chat = new Chat();
      chat.chatId = message.chatId;
      chat.message = parsedMessage;
      chat.type = message.messageType;
      this.previousMessages.push(chat);
    });
    this.cdr.detectChanges();
  }
}
