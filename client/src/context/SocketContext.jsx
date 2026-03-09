import { createContext, useContext, useEffect, useState } from 'react';

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        // Placeholder: In production, connect to Socket.io server
        // import { io } from 'socket.io-client';
        // const socket = io('http://localhost:5000');
        // socket.on('connect', () => setConnected(true));
        // socket.on('disconnect', () => setConnected(false));

        // Simulating connection
        const timer = setTimeout(() => setConnected(true), 1000);
        return () => clearTimeout(timer);
    }, []);

    const emit = (event, data) => {
        console.log('[Socket Placeholder] Emit:', event, data);
    };

    const on = (event, callback) => {
        console.log('[Socket Placeholder] Listening:', event);
    };

    return (
        <SocketContext.Provider value={{ connected, emit, on }}>
            {children}
        </SocketContext.Provider>
    );
};
