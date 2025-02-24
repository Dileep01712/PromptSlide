import { createContext } from 'react';

export interface AuthContextType {
    refreshToken: string | null;
    setRefreshToken: (token: string | null) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);