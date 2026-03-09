import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('parkease_user');
        const storedToken = localStorage.getItem('parkease_token');
        if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser));
            setToken(storedToken);
        }
        setLoading(false);
    }, []);

    const login = async (credentials) => {
        const res = await authService.login(credentials);
        if (res.success) {
            setUser(res.data.user);
            setToken(res.data.token);
            localStorage.setItem('parkease_user', JSON.stringify(res.data.user));
            localStorage.setItem('parkease_token', res.data.token);
        }
        return res;
    };

    const register = async (userData) => {
        const res = await authService.register(userData);
        if (res.success) {
            setUser(res.data.user);
            setToken(res.data.token);
            localStorage.setItem('parkease_user', JSON.stringify(res.data.user));
            localStorage.setItem('parkease_token', res.data.token);
        }
        return res;
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('parkease_user');
        localStorage.removeItem('parkease_token');
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};
