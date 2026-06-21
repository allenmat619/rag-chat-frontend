import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  constructor(
    private http: HttpClient
  ) { }


  getAllDocuments(): Observable<Document[]> {
    return this.http.get<Document[]>(
      '/api/documents');
  }

  downloadDocument(documentId: string): Observable<Blob> {
    if (!documentId || documentId.trim() === '') {
      throw new Error('Invalid request: documentId is required.');
    }

    return this.http.get<Blob>(
      `/api/documents/download/${documentId}`,
      { responseType: 'blob' as 'json' });
  }


  uploadDocument(document: File): Observable<any> {
    if (!document || document.size === 0) {
      throw new Error('Invalid request: document is required.');
    }

    const formData = new FormData();
    formData.append('file', document);

    return this.http.post<any>(
      '/api/documents/upload',
      formData);
  }

  deleteDocument(documentId: string): Observable<any> {
    if (!documentId || documentId.trim() === '') {
      throw new Error('Invalid request: documentId is required.');
    }
    return this.http.delete<any>(
      `/api/documents/${documentId}`);
  }
}