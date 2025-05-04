export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  fullName: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}

export interface SocialLoginData {
  provider: 'google' | 'facebook';
  token: string;
}

export interface UserData {
  id: string;
  fullName: string;
  email: string;
  role: 'user' | 'admin';
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProvider {
  id: string;
  provider: 'google' | 'facebook';
  providerUserId: string;
  createdAt: string;
  updatedAt: string;
}

export interface SocialAuthCredentials {
  provider: 'google' | 'facebook';
  token: string;
}

export interface UpdateProfileData {
  fullName?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
}
