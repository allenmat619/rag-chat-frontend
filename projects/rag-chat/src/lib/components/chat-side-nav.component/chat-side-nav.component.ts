import { ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, EventEmitter, input, OnInit, Output } from '@angular/core';
import { ChatHistory } from '../../models/chatHistory';
import { ChatService } from '../../services/chat.service';
import { Chat } from 'rag-core';
import { marked } from 'marked';
import { SelectedChat } from '../../models/selectedChat';
import { MatListModule } from '@angular/material/list';
import { MatButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'chat-side-nav',
  imports: [MatListModule, MatButton, MatIconModule, MatProgressSpinner],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './chat-side-nav.component.html',
  styleUrl: './chat-side-nav.component.css',
})
export class ChatSideNavComponent implements OnInit {
  allChats: ChatHistory[] = [];
  selectedChat?: ChatHistory;
  previousMessages: Chat[] = [];
  isLoading: boolean = false;

  reloadChats = input(false);

  @Output('chat-selected') onChatSelected = new EventEmitter<SelectedChat>();

  constructor(
    private chatService: ChatService,
    private cdr: ChangeDetectorRef
  ) {
    effect(() => {
      if (this.reloadChats()) {
        this.loadAllChats();
      }
    });
  }

  ngOnInit(): void {
    this.loadAllChats();
  }

  loadAllChats() {
    this.isLoading = true;    
    this.cdr.detectChanges();
    this.chatService.getAllChats().subscribe({
      next: (result) => {
        if (result && Array.isArray(result)) {
          this.allChats = [];
          this.isLoading = false;
          result.forEach(chat => {
            this.allChats.push(ChatHistory.fromJson(chat));
          });          
          this.cdr.detectChanges();
        }
      },
      error: (error) => {
        console.error("Failed to load previous chats", error);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  newChat() {
    this.selectedChat = undefined;
    this.previousMessages = [];
    this.onChatSelected.emit({ chatId: undefined, chats: [] });
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
    this.onChatSelected.emit({ chatId: this.selectedChat?.chatId, chats: this.previousMessages });
  }

  deleteChat(chatId?: string) {
    if (!chatId) chatId = "";
    this.isLoading = true;
    this.cdr.detectChanges();
    this.chatService.deleteChat(chatId).subscribe({
      next: () => {
        this.isLoading = false;
        this.allChats = this.allChats.filter(c => c.chatId !== chatId);
        this.previousMessages = [];
        this.onChatSelected.emit({ chatId: undefined, chats: [] });        
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error("Failed to delete chat.", error);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    })
  }

  deleteAll() {
    const chatIds = this.allChats.map(c => c.chatId).filter(c => c !== undefined);
    this.isLoading = true;
    this.cdr.detectChanges();
    this.chatService.deleteChats(chatIds).subscribe({
      next: () => {
        this.isLoading = false;
        this.allChats = [];
        this.previousMessages = [];
        this.onChatSelected.emit({ chatId: undefined, chats: [] });        
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error("Failed to delete chat.", error);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
