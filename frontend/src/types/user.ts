export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  facebookId?: string;
  facebookAccessToken?: string;
  createdAt: Date;
  updatedAt: Date;
} 