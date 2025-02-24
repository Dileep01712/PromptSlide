import { useAuth } from '@/components/context/useAuth';

export const useIsLoggedIn = (): boolean => {
    const { refreshToken } = useAuth();
    return Boolean(refreshToken);
};
