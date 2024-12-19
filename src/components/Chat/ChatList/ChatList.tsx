import ChatItem from '@/components/Chat/ChatItem/ChatItem.tsx';
import clsx from 'clsx';
import styles from './ChatList.module.scss';

interface ChatListProps {
    isChatListOpen: boolean;
}

export default function ChatList({isChatListOpen}: ChatListProps) {
    return (
        <div
            className={clsx(styles.chatList, {
                [styles.chatListOpen]: isChatListOpen,
                [styles.chatListClosed]: !isChatListOpen
            })}
        >
            <div className={styles.chatListSection}>
                <h4>Hlavní chat</h4>
                <ChatItem avatarUrl="" name="Hlavní chat"/>
            </div>
            <div className={styles.chatListSection}>
                <h4>Nedávné chaty</h4>
                <ChatItem avatarUrl="" name="Chat 1"/>
                <ChatItem avatarUrl="" name="Chat 2"/>
            </div>
            <div className={styles.chatListSection}>
                <h4>Napsat uživateli</h4>
                <input type="text" placeholder="Zadejte přezdívku" className={styles.nicknameInput}/>
                <button className={styles.sendToUserButton}>Odeslat</button>
            </div>
        </div>
    );
}