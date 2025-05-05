import { createContext, useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import authService from '../services/authService';
import { UserData } from '@/lib/types/auth.type';
import userService from '@/services/userService';

interface AuthContextType {
  user: UserData | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: { fullName: string; email: string; password: string }) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = Cookies.get('token');

        if (storedToken) {
          const response = await userService.getProfile();
          setUser(response);
          setToken(storedToken);
        }
      } catch {
        Cookies.remove('token');
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.login({ email, password });
      const { token } = response;

      Cookies.set('token', token, { expires: 1 / 12 });
      const responseUser = await userService.getProfile();
      console.log("responseUser", responseUser);
      
      setUser(responseUser);
      setToken(token);
      return true;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setError(error.message || 'Failed to login');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: { fullName: string; email: string; password: string }) => {
    setIsLoading(true);
    setError(null);

    try {
      await authService.register(userData);
      return true;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setError(error.message || 'Failed to register');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    Cookies.remove('token');

    setUser(null);
    setToken(null);

    router.push('/login');
  };

  const value = {
    user,
    token,
    login,
    register,
    logout,
    isLoading,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
