import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChatPageComponent } from 'rag-chat';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ChatPageComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('rag-chat-frontend');
}
