import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DocumentService } from '../../services/document.service';
import { UploadedDocument } from '../../models/document';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatListModule } from '@angular/material/list';
import { DatePipe } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { DocumentUploadComponent } from '../document-upload.component/document-upload.component';

@Component({
  selector: 'document-view',
  imports: [MatListModule, DatePipe, MatIcon, MatButton, MatProgressSpinner, DocumentUploadComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './document-view.component.html',
  styleUrl: './document-view.component.css',
})
export class DocumentViewComponent implements OnChanges {

  documents: UploadedDocument[] = [];
  isLoading: boolean = false;
  downloadInProgress: boolean[] = [];
  deletionInProgress: boolean[] = [];

  @Input() selectedTabIndex: number = 0;  

  constructor(
    private documentService: DocumentService,
    private cdr: ChangeDetectorRef
  ) { }


  ngOnChanges(changes: SimpleChanges): void {
    if(!changes) return;
    if (changes['selectedTabIndex'] && changes['selectedTabIndex'].currentValue === 1) {
      this.loadDocuments();
    }    
  }

  documentUploaded(status: boolean){
    if(status){
      this.loadDocuments();
    }
  }

  loadDocuments(): void {
    this.isLoading = true;
    this.cdr.detectChanges();
    this.documentService.getAllDocuments().subscribe({
      next: (documents) => {
        if (documents && documents.length > 0) {
          this.documents = documents.map(doc => {
            this.downloadInProgress.push(false); 
            this.deletionInProgress.push(false);
            return UploadedDocument.fromJson(doc)});
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading documents:', error);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  downloadDocument(downloadedDocument: UploadedDocument, index: number) {
    this.downloadInProgress[index] = true;
    this.cdr.detectChanges();
    this.documentService.downloadDocument(downloadedDocument.documentId).subscribe({
      next: (result) => {
        if (result) {
          console.log(result);
          const url = window.URL.createObjectURL(result);
          const anchor = document.createElement('a');
          anchor.href = url;
          anchor.download = downloadedDocument.fileName;
          anchor.click();
          window.URL.revokeObjectURL(url);
        }
        this.downloadInProgress[index] = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error("Failed to download the document.", error);
        this.downloadInProgress[index] = false;
        this.cdr.detectChanges();
      }
    });
  }

  deleteDocument(documentId: string, index: number){
    this.deletionInProgress[index] = true;
    this.cdr.detectChanges();
    this.documentService.deleteDocument(documentId).subscribe({
      next: () => {
        console.log("Document deleted successfully.");
        this.deletionInProgress[index] = false;
        this.cdr.detectChanges();
        this.loadDocuments();
      },
      error: (error) => {
        console.error("Failed to delete the document.", error);
        this.deletionInProgress[index] = false;
        this.cdr.detectChanges();
      }
    })
  }

}
