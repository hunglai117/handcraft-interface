import { post, del } from './api';
import { UserDto } from './userService';

const PREFIX_PATH = '/auth';

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  fullName: string;
  email: string;
  password: string;
}

export interface AuthResponseDto {
  token: string;
  user: UserDto;
}

export interface SocialAuthRequestDto {
  token: string;
  provider: 'google' | 'facebook';
}

const authService = {
  // Login with email and password
  login: (credentials: LoginDto) => post<AuthResponseDto>(`${PREFIX_PATH}/login`, credentials),

  // Register a new user
  register: (registerData: RegisterDto) => post<AuthResponseDto>(`${PREFIX_PATH}/register`, registerData),

  // Login with social provider (Google, Facebook)
  socialLogin: (socialAuthData: SocialAuthRequestDto) =>
    post<AuthResponseDto>(`${PREFIX_PATH}/social-login`, socialAuthData),

  // Link a social provider to an existing account
  linkProvider: (socialAuthData: SocialAuthRequestDto) => 
    post<void>(`${PREFIX_PATH}/link-provider`, socialAuthData),

  // Unlink a social provider from an account
  unlinkProvider: (provider: 'google' | 'facebook') => 
    del<void>(`${PREFIX_PATH}/unlink-provider/${provider}`),
};

export default authService;
