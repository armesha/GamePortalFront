import { useAuth } from '@/providers/AuthContex';
import { useSocket } from '@/providers/SocketContex';
import { useNavigate } from '@tanstack/react-router';
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import styles from './Messages.module.scss';

export default function Messages() {
    const {messages, setMessages} = useSocket();
    const {user} = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [isAutoScrollEnabled, setIsAutoScrollEnabled] = useState(true);
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await fetch('/api/get_messages.php');
                const data = await response.json();
                if (response.ok) {
                    setMessages(data.messages);
                } else {
                    console.error('Failed to load messages:', data.error);
                }
            } catch (error) {
                console.error('Error fetching messages:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMessages();
    }, [setMessages]);

    useEffect(() => {
        if (isAutoScrollEnabled && containerRef.current) {
            containerRef.current.scrollTo({
                top: containerRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [isAutoScrollEnabled, messages]);

    const handleScroll = () => {
        if (containerRef.current) {
            const {scrollTop, scrollHeight, clientHeight} = containerRef.current;
            const isAtBottom = scrollHeight - (scrollTop + clientHeight) < 50;
            setIsAutoScrollEnabled(isAtBottom);
        }
    };

    const handleAvatarClick = (userId: number) => {
        navigate({
            to: `/profile/${userId}`
        });
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div
            className={styles.messages}
            ref={containerRef}
            onScroll={handleScroll}
        >
            {messages.map((message, index) => (
                <div
                    key={index}
                    className={clsx(
                        styles.message,
                        message.sender_id === user?.user_id ? styles.outgoing : styles.incoming
                    )}
                >
                    <div
                        className={styles.avatar}
                        onClick={() => handleAvatarClick(message.sender_id)}
                        style={{backgroundImage: `url(${message.avatar_url ? message.avatar_url : `https://picsum.photos/seed/${message.sender_id}/200/200`})`}}
                    />
                    <div className={styles.text}>{message.content}</div>
                </div>
            ))}
        </div>
    );
}