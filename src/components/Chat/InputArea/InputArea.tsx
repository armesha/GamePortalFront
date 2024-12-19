import SendIcon from '@/assets/icons/send.svg';
import styles from './InputArea.module.scss';
import { useState } from 'react';
import { useSocket } from '@/providers/SocketContex';

export default function InputArea() {
    const [inputValue, setInputValue] = useState('');
    const { sendMessage } = useSocket();

    const handleSend = () => {
        if (inputValue.trim()) {
            const message = JSON.stringify({
                type: 'send',
                content: inputValue
            });
            sendMessage(message);
            setInputValue('');
        }
    };

    return (
        <div className={styles.input}>
            <input
                type="text"
                placeholder="Napište zprávu"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            />
            <button className={styles.sendButton} onClick={handleSend}>
                <SendIcon />
            </button>
        </div>
    );
}