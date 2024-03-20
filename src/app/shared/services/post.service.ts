import { HttpClient, HttpEvent, HttpEventType, HttpRequest } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  @Output() postCreated = new EventEmitter<any>();

  URL_LINK = "http://localhost:8081/api/v1/posts";

  constructor(private http: HttpClient) { }

  createPost(userId: string, createPostDto: any, images: string[]): Observable<number | any> {
    const formData = new FormData();
    formData.append('createPostDto', new Blob([JSON.stringify(createPostDto)], { type: 'application/json' }));

    images.forEach((image, index) => {
      // Assuming dataURLtoBlob and getFileExtension methods are defined elsewhere in your service
      const blob = this.dataURLtoBlob(image);
      const file = new File([blob], `image${index}.${this.getFileExtension(blob.type)}`, { type: blob.type });
      formData.append('files', file);
    });

    const req = new HttpRequest('POST', `${this.URL_LINK}/create/${userId}`, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    const progress = new Subject<number | any>();

    this.http.request(req).subscribe(event => {
      if (event.type === HttpEventType.UploadProgress) {
        const percentDone = Math.round(100 * (event.loaded / (event.total ?? 0)));
        progress.next(percentDone); // Emit the progress
      } else if (event.type === HttpEventType.Response) {
        progress.next(event.body); // Emit the final response
        progress.complete();
      }
    }, error => {
      progress.error(error);
    });

    return progress.asObservable();
  }

  private dataURLtoBlob(dataurl: string): Blob {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }

    return new Blob([u8arr], {type: mime});
  }

  private getFileExtension(mimeType: string): string {
    switch (mimeType) {
      case 'image/jpeg':
        return 'jpg';
      case 'image/png':
        return 'png';
      default:
        return 'dat';
    }
  }
}
