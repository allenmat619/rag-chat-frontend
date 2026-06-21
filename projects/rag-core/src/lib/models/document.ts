export class UploadedDocument {
  documentId: string;
  fileName: string;
  downloadUrl: string;
  uploadDate: Date;

  constructor() {
    this.documentId = "";
    this.fileName = "";
    this.downloadUrl = "";
    this.uploadDate = new Date();
  }

  static fromJson(json: any): UploadedDocument {
    const document = new UploadedDocument();
    if(json.documentId){
      document.documentId = json.documentId;
    }
    if(json.fileName){
      document.fileName = json.fileName;
    }
    if(json.downloadUrl){
      document.downloadUrl = json.downloadUrl;
    }
    if(json.uploadDate){
      document.uploadDate = new Date(json.uploadDate);
    }
    return document;
  }
}