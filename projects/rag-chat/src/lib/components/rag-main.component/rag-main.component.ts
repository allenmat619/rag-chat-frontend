import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { DocumentUploadComponent } from 'rag-core';
import { ChatPageComponent } from '../chat-page.component/chat-page.component';

@Component({
  selector: 'rag-main',
  imports: [DocumentUploadComponent, MatTabsModule, MatIconModule, ChatPageComponent ],
  standalone: true,
  templateUrl: './rag-main.component.html',
  styleUrl: './rag-main.component.css',
})
export class RagMainComponent {

}
