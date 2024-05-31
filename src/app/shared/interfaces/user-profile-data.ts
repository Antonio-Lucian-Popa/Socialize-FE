export interface UserProfileData {
  userInfo: User;
  userProfileImage: string;
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
  interests: string[];
  bio: string;
  livesIn: string;
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
