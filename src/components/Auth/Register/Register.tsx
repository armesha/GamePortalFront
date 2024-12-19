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
import styles from './Register.module.scss';

export default function Register() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        nickname: '',
        email: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<Partial<typeof formData>>({});
    const {register} = useAuth();

    const headerData = useHeaderStore();

    useEffect(() => {
        headerData.setCompact(true);
        headerData.setContent(<></>);
        return () => {
            headerData.setCompact(false);
        };
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const newErrors: Partial<typeof formData> = {};
        if (!formData.firstName) newErrors.firstName = 'Pole je povinné';
        if (!formData.lastName) newErrors.lastName = 'Pole je povinné';
        if (!formData.nickname) newErrors.nickname = 'Pole je povinné';
        if (!formData.email) newErrors.email = 'Pole je povinné';
        if (!formData.password) newErrors.password = 'Pole je povinné';

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            try {
                await register(formData);
                toast.success('Registrace byla úspěšná! Nyní se můžete přihlásit.');
            } catch (error) {
                console.error(error);
                toast.error('Registrace se nezdařila. Zkontrolujte prosím zadané údaje.');
            }
        }
    };

    const toggleShowPassword = () => {
        setShowPassword((prev) => !prev);
    };

    return (
        <div className={styles.registerContainer}>
            <form className={styles.form} onSubmit={handleSubmit}>
                <h2>Registrace</h2>
                <div className={styles.inputGroup}>
                    <Input
                        type="text"
                        placeholder="Jméno"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className={clsx(errors.firstName && styles.errorInput)}
                    />
                    {errors.firstName && <span className={styles.error}>{errors.firstName}</span>}
                </div>
                <div className={styles.inputGroup}>
                    <Input
                        type="text"
                        placeholder="Příjmení"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className={clsx(errors.lastName && styles.errorInput)}
                    />
                    {errors.lastName && <span className={styles.error}>{errors.lastName}</span>}
                </div>
                <div className={styles.inputGroup}>
                    <Input
                        type="text"
                        placeholder="Přezdívka"
                        name="nickname"
                        value={formData.nickname}
                        onChange={handleChange}
                        className={clsx(errors.nickname && styles.errorInput)}
                    />
                    {errors.nickname && <span className={styles.error}>{errors.nickname}</span>}
                </div>
                <div className={styles.inputGroup}>
                    <Input
                        type="email"
                        placeholder="Email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={clsx(errors.email && styles.errorInput)}
                    />
                    {errors.email && <span className={styles.error}>{errors.email}</span>}
                </div>
                <div className={styles.inputGroup}>
                    <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Heslo"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
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
                    Registrovat se
                </button>
                <div className={styles.switchAuth}>
                    <span>Už máte účet?</span>
                    <Link to="/login">Přihlásit se</Link>
                </div>
            </form>
        </div>
    );
}