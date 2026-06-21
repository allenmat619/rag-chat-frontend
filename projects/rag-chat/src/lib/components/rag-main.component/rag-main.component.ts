import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { DocumentViewComponent } from 'rag-core';
import { ChatPageComponent } from '../chat-page.component/chat-page.component';

@Component({
  selector: 'rag-main',
  imports: [MatTabsModule, MatIconModule, ChatPageComponent, DocumentViewComponent ],
  standalone: true,
  templateUrl: './rag-main.component.html',
  styleUrl: './rag-main.component.css',
})
export class RagMainComponent {

  selectedTabIndex: number = 0;
  selectedFile?: File;

  onTabChange(event: any): void {
    this.selectedTabIndex = event.index;
  }

  fileSelected(file: File){
    this.selectedFile = file;
  }

}
