import clsx from 'clsx';
import styles from './SimpleSection.module.scss';

type SimpleSectionProps = {
    title: string;
    children: React.ReactNode;
    className?: string;
}

export default function SimpleSection({ title, className, children }: SimpleSectionProps) {
    return (
        <section className={styles.section}>
            <h2 className={styles.title}>
                {title}
            </h2>
            <div className={clsx(styles.content, className)}>
                {children}
            </div>
        </section>
    );
}
