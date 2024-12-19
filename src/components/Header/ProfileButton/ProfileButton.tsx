import { useAuth } from '@/providers/AuthContex.tsx';
import { useNavigate } from '@tanstack/react-router';
import { useRef, useState } from 'react';
import useChatStore from '@/store/chatStore.ts';
import styles from './ProfileButton.module.scss';

export default function ProfileButton() {
    const {user, logout} = useAuth();
    const navigate = useNavigate();
    const [isLogoutVisible, setIsLogoutVisible] = useState(false);
    const timeoutRef = useRef<number>();
    const {isChatOpen} = useChatStore();

    const handleProfileClick = () => {
        navigate({
            to: '/profile/me',
        });
    };

    const handleLogoutClick = () => {
        logout();
    };

    const showLogout = () => {
        clearTimeout(timeoutRef.current!);
        setIsLogoutVisible(true);
    };

    const hideLogout = () => {
        timeoutRef.current = setTimeout(() => {
            setIsLogoutVisible(false);
        }, 200);
    };

    return (
        <div
            className={`${styles.profileButton} ${isChatOpen ? styles.hide : ''}`}
            onMouseEnter={showLogout}
            onMouseLeave={hideLogout}
        >
            <img
                src={user?.avatar_url ? `/${user?.avatar_url}` : `https://picsum.photos/seed/${user?.user_id}/200/200`}
                alt="Profile"
                onClick={handleProfileClick}
            />
            <div
                className={`${styles.logoutButton} ${isLogoutVisible ? styles.visible : ''}`}
                onClick={handleLogoutClick}
                onMouseEnter={showLogout}
                onMouseLeave={hideLogout}
            >
                Odhlásit se
            </div>
        </div>
    );
}
