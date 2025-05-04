import { get, put } from './api';

const PREFIX_PATH = '/users';

export interface UserDto {
  id: string;
  fullName: string;
  email: string;
  role: 'user' | 'admin';
  phone: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UserProviderDto {
  id: string;
  provider: 'google' | 'facebook';
  providerUserId: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileRequestDto {
  fullName?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
}

const userService = {
  // Get the current authenticated user's profile
  getProfile: () => get<UserDto>(`${PREFIX_PATH}/profile`),

  // Update the user's profile information
  updateProfile: (userData: UpdateProfileRequestDto) => put<UserDto>(`${PREFIX_PATH}/profile`, userData),

  // Get all social providers linked to the user's account
  getUserProviders: () => get<UserProviderDto[]>(`${PREFIX_PATH}/profile/providers`),
};

export default userService;
