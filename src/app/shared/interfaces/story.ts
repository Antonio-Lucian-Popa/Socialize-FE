export interface Story {
  id: string;
  title: string;
  value: string;
  expirationDate: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    profileImageUrl: string;
  };
  viewed: boolean;
  viewedBy: Array<{
    id: string;
    firstName: string;
    lastName: string;
    profileImageUrl: string;
  }>;
}
