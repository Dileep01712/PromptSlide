import React, { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [refreshToken, setRefreshToken] = useState<string | null>(localStorage.getItem('refreshToken'));
    console.log("AuthProvider refreshToken: ", refreshToken);

    // Function to update refreshToken state and localStorage
    const updateRefreshToken = (token: string | null) => {
        setRefreshToken(token);
        if (token) {
            localStorage.setItem("refreshToken", token);
        } else {
            localStorage.removeItem('refreshToken');
        }
    };

    // Listen for changes in localStorage
    useEffect(() => {
        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === 'refreshToken') {
                setRefreshToken(event.newValue);
            }
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    return (
        <AuthContext.Provider value={{ refreshToken, setRefreshToken: updateRefreshToken }}>
            {children}
        </AuthContext.Provider>
    );
};