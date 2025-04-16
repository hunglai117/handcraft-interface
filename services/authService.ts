import { AuthResponse, LoginCredentials, RegisterData } from '@/lib/types/auth.type';
import { post } from './api';

const PREFIX_PATH = '/auth';

const authService = {
  login: (credentials: LoginCredentials) => post<AuthResponse>(`${PREFIX_PATH}/login`, credentials),

  register: (registerData: RegisterData) => post<AuthResponse>(`${PREFIX_PATH}/register`, registerData),
};

export default authService;
