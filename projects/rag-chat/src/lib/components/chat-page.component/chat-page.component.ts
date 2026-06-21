import { ChangeDetectorRef, Component } from '@angular/core';
import { ChatComponent, ChatResponse } from 'rag-core';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'rag-chat-page',
  standalone: true,
  imports: [ChatComponent],
  templateUrl: './chat-page.component.html',
  styleUrl: './chat-page.component.css',
})
export class ChatPageComponent {
  chatResponse: ChatResponse | null = null;
  isLoading: boolean = false;

  constructor(
    private chatService: ChatService,
    private cdr: ChangeDetectorRef
  ) {}

  onMessageSubmitted(message: any) {
    console.log('Message submitted:', message);
    this.isLoading = true;
    this.chatService.sendMessage(message).subscribe(
      (response) => {
        this.chatResponse = response;
        this.isLoading = false;
        this.cdr.detectChanges();
        console.log('Response received:', response);
      },
      (error) => {
        this.isLoading = false;
        this.cdr.detectChanges();
        console.error('Error occurred:', error);
      }
    );
  }
}
