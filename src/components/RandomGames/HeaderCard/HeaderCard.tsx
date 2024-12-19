import ProgressBar from '@/components/ProgressBar/ProgressBar.tsx';
import { IGame } from '@/components/RandomGames/RandomGames.tsx';
import { Link } from '@tanstack/react-router';
import clsx from 'clsx';
import React from 'react';
import styles from './HeaderCard.module.scss';

interface CardProps {
    game: IGame;
    isActive: boolean;
}

const HeaderCard: React.FC<CardProps> = ({ game, isActive }) => {
    return (
        <Link to={`/game/${game.game_id}`} className={clsx(styles.card, { [styles.active]: isActive })}>
            <div className={styles.imageContainer}>
                <img src={game.header_image_url} alt={game.game_name} loading="lazy" />
            </div>
            <h3 className={styles.title}>{game.game_name}</h3>
            <ProgressBar isActive={isActive} />
        </Link>
    );
};

export default HeaderCard;
