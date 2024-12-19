import { Link } from '@tanstack/react-router';
import clsx from 'clsx';
import React from 'react';
import styles from './InfoBlock.module.scss';

type InfoBlockProps = {
    title?: string;
    value: React.ReactNode;
    className?: string;
    href?: string;
}

export default function InfoBlock({title, value, className, href}: InfoBlockProps) {
    const data = (
        <>
            {title && <h2>{title}</h2>}
            {
                typeof value === 'string' ? <span>{value}</span> : value
            }
        </>
    );

    if (href) {
        return (
            <Link to={href} className={clsx(styles.infoBlock, styles.link, className)}>
                {data}
            </Link>
        );
    }

    return (
        <div className={clsx(styles.infoBlock, className)}>
            {data}
        </div>
    );
}