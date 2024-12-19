import HeartIcon from '@/assets/icons/heart.svg';
import HeartFullIcon from '@/assets/icons/heartFull.svg';
import { Link } from '@tanstack/react-router';
import clsx from 'clsx';
import { useState } from 'react';
import { Rating } from 'react-simple-star-rating';
import styles from './GameCard.module.scss';

export type GameCardProps = {
    id: number;
    title: string;
    image: string;
    age?: number;
    rating?: number;
    favorite?: boolean;
    onMouseEnter?: () => void;
}

export default function GameCard({
                                     id,
                                     title,
                                     image,
                                     age,
                                     rating,
                                     onMouseEnter,
                                     favorite = false
                                 }: GameCardProps) {
    const [isFavorite, setIsFavorite] = useState(favorite);
    image = image?.replace(/^uploads\/games\//, '');

    const handleFavoriteClick = async () => {
        const url = isFavorite ? '/api/unlike_game.php' : '/api/like_game.php';
        const method = isFavorite ? 'DELETE' : 'POST';
        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({game_id: id}),
        });

        if (response.ok) {
            setIsFavorite(!isFavorite);
        } else {
            console.error('Failed to update favorite status');
        }
    };

    return (
        <div className={styles.container} onMouseEnter={onMouseEnter}>
            <Link className={styles.card} to={'/game/' + id} resetScroll={true}>
                <img src={image} alt={title} fetchPriority={'high'}/>
                <div className={styles.info}>
                    <h3>{title}</h3>
                    <div className={styles.bottom}>
                        {/*<p className={styles.price}>{price}$</p>*/}
                        {rating !== undefined &&
                            <Rating initialValue={rating / 20} size={20} transition allowFraction readonly/>
                        }
                        {age !== undefined && <p className={styles.age}>{age}+</p>}
                    </div>
                </div>
            </Link>
            <div
                className={clsx(styles.favoriteIcon, isFavorite && styles.favoriteIconActive)}
                onClick={handleFavoriteClick}>
                {isFavorite ? <HeartFullIcon/> : <HeartIcon/>}
            </div>
        </div>
    );
}