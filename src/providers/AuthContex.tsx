import { useNavigate } from '@tanstack/react-router';
import React, { createContext, ReactNode, useEffect, useState } from 'react';

export interface User {
    user_id: number;
    first_name: string;
    last_name: string;
    user_nickname: string;
    email: string;
    avatar_url?: string;
    admin: boolean;
}

interface AuthContextType {
    user: User | null;
    login: (identifier: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    register: (registrationData: RegistrationData) => Promise<void>;
}

interface RegistrationData {
    firstName: string;
    lastName: string;
    nickname: string;
    email: string;
    password: string;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export default function AuthProvider({children}: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const navigate = useNavigate();
    console.log('AuthProvider', user);
    const login = async (identifier: string, password: string): Promise<void> => {
        try {
            const response = await fetch('/api/login.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({identifier, password}),
            });
            if (!response.ok) {
                throw new Error('Login failed');
            }
            const responseData = await response.json();
            if (responseData.message === 'Login successful') {
                navigate({
                    to: '/'
                });
            }
            const userResponse = await fetch('/api/user.php');
            if (!userResponse.ok) {
                throw new Error('Failed to fetch user information');
            }
            const userData = await userResponse.json();
            setUser(userData.user);
        } catch (error) {
            console.error('Login error', error);
            throw error;
        }
    };

    const logout = async (): Promise<void> => {
        try {
            const response = await fetch('/api/logout.php', {
                method: 'POST',
            });
            if (!response.ok) {
                throw new Error('Logout failed');
            }
            setUser(null);
        } catch (error) {
            console.error('Logout error', error);
        }
    };

    const register = async (registrationData: RegistrationData): Promise<void> => {
        try {
            const response = await fetch('/api/register.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(registrationData),
            });
            if (!response.ok) {
                throw new Error('Registration failed');
            }
            const responseData = await response.json();
            if (responseData.message === 'User registered successfully') {
                navigate({
                    to: '/',
                });
            }
            const userResponse = await fetch('/api/user.php');
            if (!userResponse.ok) {
                throw new Error('Failed to fetch user information');
            }
            const userData = await userResponse.json();
            setUser(userData.user);
        } catch (error) {
            console.error('Registration error', error);
            throw error;
        }
    };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch('/api/user.php');
                if (!response.ok) {
                    throw new Error('Failed to fetch user information');
                }
                const data = await response.json();
                setUser(data.user);
            } catch {
                setUser(null);
            }
        };
        fetchUser();
    }, []);

    return (
        <AuthContext.Provider value={{user, login, logout, register}}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = React.useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}