import ChatIcon from '@/assets/icons/chat.svg';
import useChatStore from '@/store/chatStore.ts';
import styles from './ChatToggle.module.scss';

export default function ChatToggle() {
    const {toggleChat} = useChatStore();

    return (
        <div className={styles.chatToggle}>
            <button onClick={toggleChat}>
                <ChatIcon/>
            </button>
        </div>
    );
}