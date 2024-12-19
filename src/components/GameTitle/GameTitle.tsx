import styles from './GameTitle.module.scss';

type GameTitleProps = {
    title: string;
    developer: string;
}

export default function GameTitle({title, developer}: GameTitleProps) {
    return (
        <div className={styles.bigTitle}>
            <h2>{developer}</h2>
            <h1>{title}</h1>
        </div>
    );
}