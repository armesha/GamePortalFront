import clsx from 'clsx';
import React from 'react';
import styles from './Section.module.scss';

type SectionProps = {
    title: string;
    icon: string;
    children: React.ReactNode;
    className?: string;
    marginTop?: boolean;
}

export default function Section({title, icon, children,marginTop, className}: SectionProps) {
    return (
        <section className={clsx(styles.section, marginTop && styles.marginTop, className)}>
            <h2 className={styles.title}>
                <img src={icon} alt={title}/>
                {title}
            </h2>
            <div className={styles.content}>
                {children}
            </div>
        </section>
    );
}