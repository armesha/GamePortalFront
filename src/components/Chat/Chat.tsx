import ChatHeader from '@/components/Chat/ChatHeader/ChatHeader.tsx';
import ChatToggle from '@/components/Chat/ChatToggle/ChatToggle.tsx';
import Messages from '@/components/Chat/Messages/Messages.tsx';
import { useAuth } from '@/providers/AuthContex.tsx';
import { SocketProvider } from '@/providers/SocketContex';
import useChatStore from '@/store/chatStore.ts';
import clsx from 'clsx';
import { useState } from 'react';
import styles from './Chat.module.scss';
import ChatList from './ChatList/ChatList';
import InputArea from './InputArea/InputArea';

export default function Chat() {
    const [isChatListOpen, setIsChatListOpen] = useState(false);
    const {isChatOpen} = useChatStore();
    const {user} = useAuth();

    if (!user) return null;

    const toggleChatList = () => {
        setIsChatListOpen((prev) => !prev);
    };

    console.log('Chat render', toggleChatList);

    return (
        <SocketProvider>
            <div className={clsx(styles.container, !isChatOpen && styles.closed)}>
                {!isChatOpen && <ChatToggle/>}
                {
                    isChatOpen &&
                    <div className={styles.wrapper}>
                        <div className={styles.chat}>
                            <ChatHeader/>
                            <ChatList isChatListOpen={isChatListOpen}/>
                            <Messages/>
                            <InputArea/>
                        </div>
                    </div>
                }
            </div>
        </SocketProvider>
    );
}