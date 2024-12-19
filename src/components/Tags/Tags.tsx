import styles from './Tags.module.scss';

type TagsProps = {
    tags: string[];
}

export default function Tags({tags}: TagsProps) {
    return (
        <div className={styles.tags}>
            {tags.map((tag, index) => (
                <span key={index}>{tag}</span>
            ))}
        </div>
    );
}