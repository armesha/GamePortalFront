import styles from './ChatItem.module.scss';

interface ChatItemProps {
    avatarUrl: string;
    name: string;
}

export default function ChatItem({avatarUrl, name}: ChatItemProps) {
    return (
        <div className={styles.chatItem}>
            <div className={styles.avatar} style={{backgroundImage: `url(${avatarUrl})`}}/>
            <span>{name}</span>
        </div>
    );
}
