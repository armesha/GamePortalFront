import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import styles from './LoginDropdown.module.scss';

export default function LoginDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className={styles.loginDropdown}>
            <button onClick={toggleDropdown}>Autorizace</button>
            {isOpen && (
                <div className={styles.menu}>
                    <Link to="/login">Přihlásit se</Link>
                    <Link to="/register">Registrovat</Link> 
                </div>
            )}
        </div>
    );
}