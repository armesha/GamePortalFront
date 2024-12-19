import CrossIcon from '@/assets/icons/cross.svg';
import useChatStore from '@/store/chatStore.ts';
import styles from './ChatHeader.module.scss';

export default function ChatHeader() {
    const {closeChat} = useChatStore();

    return (
        <div className={styles.header}>
            <div className={styles.title}>Chat</div>
            <button 
                className={styles.closeButton} 
                onClick={closeChat}
                aria-label="Close chat"
            >
                <CrossIcon/>
            </button>
        </div>
    );
}