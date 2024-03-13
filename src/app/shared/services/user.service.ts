import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  URL_LINK = 'http://localhost:8080/api/v1/users';

  private avatarPreviewSource = new BehaviorSubject<string | null>(null);
  avatarPreview = this.avatarPreviewSource.asObservable();

  constructor(private http: HttpClient) { }

  updateProfile(user: any): Observable<any> {
    return this.http.put(`${this.URL_LINK}/update`, user);
  }

  updateAvatarPreview(file: File): void {
    // Revoke the previous URL to avoid memory leaks
    const currentPreview = this.avatarPreviewSource.getValue();
    if (currentPreview) {
      URL.revokeObjectURL(currentPreview);
    }

    const previewUrl = URL.createObjectURL(file);
    this.avatarPreviewSource.next(previewUrl);
  }
}
