import styles from './LoadMore.module.scss';

export default function LoadMore({...props}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
    return <button {...props} className={styles.more}>Načíst více</button>;
}