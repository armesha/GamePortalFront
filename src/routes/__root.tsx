import Chat from '@/components/Chat/Chat.tsx';
import Footer from '@/components/Footer/Footer.tsx';
import Header from '@/components/Header/Header.tsx';
import AuthProvider from '@/providers/AuthContex.tsx';
import { SocketProvider } from '@/providers/SocketContex';
import useChatStore from '@/store/chatStore.ts';
import useHeaderStore from '@/store/headerStore.tsx';
import { createRootRoute, Outlet, useLocation } from '@tanstack/react-router';
import clsx from 'clsx';
import * as React from 'react';
import { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './Root.module.scss';

export const Route = createRootRoute({
    component: RootElement
});


function RootElement() {
    const {isChatOpen} = useChatStore();

    const setHeaderContent = useHeaderStore(state => state.setContent);
    const location = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
        if (location.pathname === '/') {
            setHeaderContent(null);
        }
    }, [location]);

    return (
        <AuthProvider>
            <SocketProvider>
                <React.Fragment>
                    <ToastContainer
                        position="bottom-right"
                        autoClose={5000}
                        hideProgressBar={false}
                        newestOnTop
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                        theme="dark"
                    />
                    <Header/>
                    <div className={styles.container}>
                        <div className={clsx(styles.content, isChatOpen && styles.chatOpen)}>
                            <Outlet/>
                            <Footer/>
                        </div>
                        <Chat/>
                    </div>
                </React.Fragment>
            </SocketProvider>
        </AuthProvider>
    );
}