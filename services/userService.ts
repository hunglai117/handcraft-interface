import { UserData } from '@/lib/types/auth.type';
import { get } from './api';

const PREFIX_PATH = '/users';

const userService = {
  getCurrentUser: () => get<{ user: UserData }>(`/${PREFIX_PATH}/profile`),
  updateUserProfile: (userData: Partial<UserData>) => get<{ user: UserData }>(`/${PREFIX_PATH}/profile`, userData),
};

export default userService;
