import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  // private URL_LINK = 'http://localhost:8081/api/v1/comments';
  URL_LINK = environment.apiUrl + '/api/v1';
  // URL_LINK = 'https://socialize-be.go.ro:2347/api/v1/comments';

  constructor(private http: HttpClient) { }

  findCommentsByPostId(postId: string): Observable<any> {
    return this.http.get<any>(`${this.URL_LINK}/comments/post/${postId}`);
  }

  createComment(comment: any): Observable<any> {
    return this.http.post<any>(`${this.URL_LINK}/comments`, comment);
  }

  editComment(commentId: string, userId: string, comment: any): Observable<any> {
    return this.http.put<any>(`${this.URL_LINK}/comments/${commentId}/${userId}`, comment);
  }

  deleteComment(commentId: string, ownerOfCommentId: string): Observable<any> {
    return this.http.delete<any>(`${this.URL_LINK}/comments/${commentId}/${ownerOfCommentId}`);
  }
}
