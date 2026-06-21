import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RagMainComponent } from 'rag-chat';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RagMainComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('rag-chat-frontend');
}
