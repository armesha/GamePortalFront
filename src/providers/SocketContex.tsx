import { useAuth } from '@/providers/AuthContex.tsx';
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

type Message = {
    type: string;
    sender_id: number;
    content: string;
    timestamp: string;
    avatar_url: string;
}

interface SocketContextProps {
    socket: WebSocket | null;
    sendMessage: (message: string) => void;
    messages: Message[];
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

const SocketContext = createContext<SocketContextProps | undefined>(undefined);

export function SocketProvider({children}: { children: React.ReactNode }) {
    const {user} = useAuth();
    const [messages, setMessages] = useState<Message[]>([]);
    const socketRef = useRef<WebSocket | null>(null);
    const isConnectingRef = useRef<boolean>(false);

    const connect = () => {
        if (!user) return;
        if (isConnectingRef.current) return;
        isConnectingRef.current = true;

        const host = window.location.host.includes('localhost') ? 'localhost:8080' : window.location.host;
        socketRef.current = new WebSocket(`ws://${host}/ws`);

        socketRef.current.onopen = () => {
            console.log('WebSocket connection established');
            isConnectingRef.current = false;
        };

        socketRef.current.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data);
                setMessages((prevMessages) => [...prevMessages, message]);
            } catch (error) {
                console.error('Failed to parse message', error);
            }
        };

        socketRef.current.onclose = () => {
            console.log('WebSocket connection closed');
            isConnectingRef.current = false;
            setTimeout(connect, 500);
        };

        socketRef.current.onerror = () => {
            console.log('WebSocket connection error');
            isConnectingRef.current = false;
            socketRef.current?.close();
        };
    };

    useEffect(() => {
        connect();

        return () => {
            socketRef.current?.close();
        };
    }, []);

    const sendMessage = (message: string) => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(message);
        }
    };

    return (
        <SocketContext.Provider value={{socket: socketRef.current, sendMessage, messages, setMessages}}>
            {children}
        </SocketContext.Provider>
    );
};

export function useSocket() {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return context;
};