import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Output } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { DocumentService } from '../../services/document.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'document-upload',
  imports: [MatButton, MatIcon, MatProgressSpinner],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './document-upload.component.html',
  styleUrl: './document-upload.component.css',
})
export class DocumentUploadComponent {

  @Output('document-uploaded') documentUploaded = new EventEmitter<boolean>();
  isLoading: boolean = false;

  constructor(
    private documentService: DocumentService,
    private cdr: ChangeDetectorRef
  ){}

  uploadDocument(event: any) {
    this.isLoading = true;
    this.cdr.detectChanges();
    const inputFile = event.target as HTMLInputElement;    
    if (inputFile?.files?.length) {
      const uploadedDocument: File = inputFile.files[0];
      this.documentService.uploadDocument(uploadedDocument).subscribe({
        next: () => {
          this.isLoading = false;
          this.cdr.detectChanges();
          this.documentUploaded.emit(true);
        },
        error: (error) => {
          console.error(`Unable to upload document ${uploadedDocument.name}.`, error);
        }
      })
    }
      
  }
}
