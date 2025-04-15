export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface AuthResponse {
  user: UserData;
  token: string;
}
