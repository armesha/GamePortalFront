import clsx from 'clsx';
import React from 'react';
import styles from './ProgressBar.module.scss';

interface ProgressBarProps {
    isActive: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({isActive}) => {
    return (
        <div className={clsx(styles.progressBar, {[styles.inactive]: !isActive})}>
            <div className={clsx(styles.progress, isActive ? styles.active : styles.inactive)}/>
        </div>
    );
};

export default ProgressBar;
