import { delay } from '../utils/helpers';

const mockUser = {
    id: '1',
    name: 'Admin User',
    email: 'admin@parkease.com',
    role: 'admin',
    avatar: null,
};

export const authService = {
    login: async ({ email, password, role }) => {
        await delay(800);
        return {
            success: true,
            data: {
                user: { ...mockUser, email, role, name: role === 'admin' ? 'Admin User' : role === 'security' ? 'Security Guard' : 'John Driver' },
                token: 'mock-jwt-token-' + Date.now(),
            },
        };
    },

    register: async (userData) => {
        await delay(800);
        return {
            success: true,
            data: {
                user: { id: Date.now().toString(), ...userData, role: 'driver' },
                token: 'mock-jwt-token-' + Date.now(),
            },
        };
    },

    logout: async () => {
        await delay(300);
        return { success: true };
    },

    getProfile: async () => {
        await delay(400);
        return { success: true, data: mockUser };
    },
};
