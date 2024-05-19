import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Story } from '../interfaces/story';

@Injectable({
  providedIn: 'root'
})
export class StoryService {

  URL_LINK = environment.apiUrl + '/api/v1/stories';

  constructor(private http: HttpClient) { }

  uploadStory(file: File, userId: string): Observable<Story> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<Story>(`${this.URL_LINK}/${userId}`, formData);
  }

  getStories(userId: string): Observable<Story[]> {
    return this.http.get<Story[]>(`${this.URL_LINK}?userId=${userId}`);
  }

  getNewStories(userId: string): Observable<Story[]> {
    return this.http.get<Story[]>(`${this.URL_LINK}/new?userId=${userId}`);
  }

  getSeenStories(userId: string): Observable<Story[]> {
    return this.http.get<Story[]>(`${this.URL_LINK}/seen?userId=${userId}`);
  }
}
