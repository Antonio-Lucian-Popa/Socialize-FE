import { HttpClient, HttpEvent, HttpEventType, HttpParams, HttpRequest } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { PostDto } from '../interfaces/post-dto';
import {v4 as uuidv4} from 'uuid';
import { PaginatedPostImages, PostImage } from '../interfaces/post-image';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  @Output() postCreated = new EventEmitter<any>();
  @Output() postEdited = new EventEmitter<any>();
  @Output() postDeleted = new EventEmitter<string>();

  URL_LINK = "http://localhost:8081/api/v1/posts";

  constructor(private http: HttpClient) { }

  createPost(userId: string, createPostDto: any, images: string[]): Observable<number | any> {
    const formData = new FormData();
    formData.append('createPostDto', new Blob([JSON.stringify(createPostDto)], { type: 'application/json' }));

    images.forEach((image, index) => {
      // Assuming dataURLtoBlob and getFileExtension methods are defined elsewhere in your service
      const blob = this.dataURLtoBlob(image);
      const file = new File([blob], `${uuidv4()}.${this.getFileExtension(blob.type)}`, { type: blob.type });
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

  /**
   *
   * @param postId post id that needs to be deleted
   * @param userId user id of the post owner
   * @param updatePost post content updated
   * @returns
   */
  editPostById(postId: string, userId: string, updatedPost: any, newImages?: string[]): Observable<any> {

    const formData = new FormData();
    formData.append('updatedPost', new Blob([JSON.stringify(updatedPost)], { type: 'application/json' }));

    if (newImages) {
      newImages.forEach((image, index) => {
        // Assuming dataURLtoBlob and getFileExtension methods are defined elsewhere in your service
        const blob = this.dataURLtoBlob(image);
        const file = new File([blob], `${uuidv4()}.${this.getFileExtension(blob.type)}`, { type: blob.type });
        formData.append('files', file);
      });
    }

    const url = `${this.URL_LINK}/update/${postId}/${userId}`;

    const req = new HttpRequest('PUT', url, formData, {
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

  /**
   *
   * @param id post id that needs to be deleted
   * @param userId user id of the post owner
   * @returns
   */
  deletePostById(id: string, userId: string): Observable<any> {
    const url = `${this.URL_LINK}/delete/${id}/${userId}`;
    return this.http.delete(url);
  }

  removeImagesFromPost(postId: string, imageUrls: string[]): Observable<any> {
    // The endpoint expects a list of image URLs to remove in the request body
    const url = `${this.URL_LINK}/removeImages/${postId}`;
    return this.http.request('delete', url, { body: imageUrls });
  }


  findAllPostsByUserId(userId: string, page: number = 0, size: number = 10, includeFollowing: boolean = false): Observable<any> {
    const url = `${this.URL_LINK}/findAllPosts/${userId}`;
    let params = new HttpParams();
    params = params.append('page', page.toString());
    params = params.append('size', size.toString());
    params = params.append('includeFollowing', includeFollowing.toString());

    return this.http.get(url, { params: params });
  }

  getPopularImages(page: number, size: number): Observable<PaginatedPostImages> {
    let params = new HttpParams();
    params = params.append('page', page.toString());
    params = params.append('size', size.toString());

    return this.http.get<PaginatedPostImages>(`${this.URL_LINK}/popular-images`, { params });
  }

  getPostById(id: string): Observable<any> {
    return this.http.get<any>(`${this.URL_LINK}/find-post/${id}`);
  }

  likePost(postId: string, userId: string): Observable<PostDto> {
    const url = `${this.URL_LINK}/like/${postId}/${userId}`;
    return this.http.put<PostDto>(url, {}); // Sending an empty object as the body, as the endpoint might not require it
  }

  unlikePost(postId: string, userId: string): Observable<PostDto> {
    const url = `${this.URL_LINK}/unlike/${postId}/${userId}`;
    return this.http.put<PostDto>(url, {}); // Sending an empty object as the body, as the endpoint might not require it
  }

  private dataURLtoBlob(dataurl: string): Blob {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new Blob([u8arr], { type: mime });
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
