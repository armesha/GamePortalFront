import EyeIcon from '@/assets/icons/new.svg';
import EyeOffIcon from '@/assets/icons/new.svg';
import Input from '@/components/Input/Input.tsx';
import { useAuth } from '@/providers/AuthContex.tsx';
import useHeaderStore from '@/store/headerStore.tsx';
import { Link } from '@tanstack/react-router';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './Login.module.scss';

export default function Login() {
    const [emailOrUsername, setEmailOrUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<{ emailOrUsername?: string; password?: string }>({});
    const {login} = useAuth();
    const headerData = useHeaderStore();

    useEffect(() => {
        headerData.setCompact(true);
        headerData.setContent(<></>);
        return () => {
            headerData.setCompact(false);
        };
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const newErrors: typeof errors = {};
        if (!emailOrUsername) {
            newErrors.emailOrUsername = 'Pole je povinné';
        }
        if (!password) {
            newErrors.password = 'Pole je povinné';
        }
        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            try {
                await login(emailOrUsername, password);
                toast.success('Úspěšně jste se přihlásili!');
            } catch (error) {
                console.error(error);
                toast.error('Přihlášení se nezdařilo. Zkontrolujte své přihlašovací údaje.');
            }
        }
    };

    const toggleShowPassword = () => {
        setShowPassword((prev) => !prev);
    };

    return (
        <div className={styles.loginContainer}>
            <form className={styles.form} onSubmit={handleSubmit}>
                <h2>Přihlášení</h2>
                <div className={styles.inputGroup}>
                    <Input
                        type="text"
                        placeholder="Email nebo Přezdívka"
                        value={emailOrUsername}
                        onChange={(e) => setEmailOrUsername(e.target.value)}
                        className={clsx(errors.emailOrUsername && styles.errorInput)}
                    />
                    {errors.emailOrUsername && <span className={styles.error}>{errors.emailOrUsername}</span>}
                </div>
                <div className={styles.inputGroup}>
                    <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Heslo"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={clsx(errors.password && styles.errorInput)}
                        icon={
                            <button type="button" onClick={toggleShowPassword} className={styles.showPasswordButton}>
                                {showPassword ? <EyeOffIcon/> : <EyeIcon/>}
                            </button>
                        }
                    />
                    {errors.password && <span className={styles.error}>{errors.password}</span>}
                </div>
                <button type="submit" className={styles.submitButton}>
                    Přihlásit se
                </button>
                <div className={styles.switchAuth}>
                    <span>Nemáte účet?</span>
                    <Link to="/register">Zaregistrovat se</Link>
                </div>
            </form>
        </div>
    );
}