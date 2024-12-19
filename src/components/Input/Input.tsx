import clsx from 'clsx';
import React from 'react';
import styles from './Input.module.scss';

type InputProps = {
    icon?: React.ReactNode;
    label?: string;
    error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export default function Input({icon, label, className, error, id, ...props}: InputProps) {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
        <div className={clsx(styles.inputContainer, className)}>
            {label && (
                <label htmlFor={inputId} className={styles.label}>
                    {label}
                </label>
            )}
            <div className={clsx(styles.inputWrapper, icon && styles.withIcon, error && styles.error)}>
                <input id={inputId} {...props} />
                {icon}
            </div>
            {error && <div className={styles.errorMessage}>{error}</div>}
        </div>
    );
}