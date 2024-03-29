import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { BehaviorSubject, Observable, forkJoin, map, switchMap } from 'rxjs';
import { User, UserProfileData } from '../interfaces/user-profile-data';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  @Output() userUpdatedInformation = new EventEmitter<UserProfileData>();

  userProfileImage!: string;
  userInfo!: User;

  URL_LINK = 'http://localhost:8081/api/v1/users';

  private avatarPreviewSource = new BehaviorSubject<string | null>(null);
  avatarPreview = this.avatarPreviewSource.asObservable();

  constructor(private http: HttpClient) { }

  getUserProfileInfo(userId: string): Observable<any> {
    console.log(userId)
    return this.http.get<any>(`${this.URL_LINK}/${userId}`);
  }

  getProfileImageAsBase64(userId: string): Observable<string> {
    return this.http.get(`${this.URL_LINK}/image/${userId}`, { responseType: 'blob' }).pipe(
      switchMap(blob => this.convertBlobToBase64(blob))
    );
  }

  fetchUserProfile(userId: string): Observable<UserProfileData> {
    return forkJoin({
      userInfo: this.getUserProfileInfo(userId),
      userProfileImage: this.getProfileImageAsBase64(userId),
    }).pipe(
      map(({ userInfo, userProfileImage }) => {
        const profileData = { userInfo, userProfileImage };
        this.userProfileImage = profileData.userProfileImage;
        this.userInfo = profileData.userInfo;
        this.userUpdatedInformation.emit(profileData); // Emitting the event here
        return profileData;
      })
    );
  }


  private convertBlobToBase64(blob: Blob): Observable<string> {
    const reader = new FileReader();
    const base64Observable = new Observable<string>((observer) => {
      reader.onloadend = () => {
        observer.next(reader.result as string);
        observer.complete();
      };
      reader.onerror = (error) => {
        observer.error(error);
      };
    });
    reader.readAsDataURL(blob);
    return base64Observable;
  }


  updateProfile(userId: string, user: any): Observable<any> {
    return this.http.put(`${this.URL_LINK}/${userId}/update`, user);
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
