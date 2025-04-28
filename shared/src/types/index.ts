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

export interface Business {
  id: string;
  name: string;
  ownerId: string;
  description: string;
  logoURL?: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Recommendation {
  id: string;
  userId: string;
  businessId: string;
  mediaURL: string;
  caption: string;
  facebookPostId?: string;
  status: 'pending' | 'published' | 'failed';
  createdAt: Date;
  updatedAt: Date;
}

export interface Promotion {
  id: string;
  businessId: string;
  title: string;
  description: string;
  discountPercentage: number;
  status: 'active' | 'expired' | 'redeemed';
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Wallet {
  id: string;
  userId: string;
  balance: number;
  transactions: Transaction[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Transaction {
  id: string;
  walletId: string;
  type: 'earn' | 'redeem';
  amount: number;
  description: string;
  referenceId: string;
  createdAt: Date;
}

export interface Analytics {
  id: string;
  businessId: string;
  date: Date;
  shares: number;
  clicks: number;
  redemptions: number;
  revenue: number;
  createdAt: Date;
  updatedAt: Date;
} 