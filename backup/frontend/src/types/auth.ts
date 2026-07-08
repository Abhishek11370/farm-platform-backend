export interface User {
  id: string;
  name?: string;
  email: string;
  role: 'ADMIN' | 'USER' | 'FARMER';
}

export interface AuthContextProps {
  user: User | null;
  accessToken: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}
