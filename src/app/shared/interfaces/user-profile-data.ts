export interface UserProfileData {
  userInfo: any; // Adjust the type based on your actual user info structure
  userProfileImage: string; // This will be a base64 string
}

export interface UserInformation {
  id: string;
  profileImageUrl: string;
  firstName: string;
  lastName: string;
  email: string;
  birthday: string;
  gender: Gender;
  totalPosts: number;
  following: User[];
  followers: User[];
}

export enum Gender {
  MALE="MALE",
  FEMALE="FEMALE",
}

export interface User {
  id: string;
  profileImageUrl: string;
  firstName: string;
  lastName: string;
}
