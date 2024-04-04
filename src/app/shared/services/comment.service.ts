import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  private URL_LINK = 'http://localhost:8081/api/v1/comments';

  constructor(private http: HttpClient) { }

  findCommentsByPostId(postId: string): Observable<any> {
    return this.http.get<any>(`${this.URL_LINK}/post/${postId}`);
  }

  createComment(comment: any): Observable<any> {
    return this.http.post<any>(`${this.URL_LINK}`, comment);
  }

  editComment(commentId: string, userId: string, comment: any): Observable<any> {
    return this.http.put<any>(`${this.URL_LINK}/${commentId}/${userId}`, comment);
  }

  deleteComment(commentId: string, ownerOfCommentId: string): Observable<any> {
    return this.http.delete<any>(`${this.URL_LINK}/${commentId}/${ownerOfCommentId}`);
  }
}
