import GameTitle from '@/components/GameTitle/GameTitle.tsx';
import HeaderCard from '@/components/RandomGames/HeaderCard/HeaderCard.tsx';
import useHeaderStore from '@/store/headerStore';
import { useEffect, useState } from 'react';
import styles from './RandomGames.module.scss';

export interface IGame {
    game_id: number;
    game_name: string;
    header_image_url: string;
    banner_image_url: string;
    developer: string;
    url: string;
    liked: boolean;
}

export default function RandomGames() {
    const [displayedGames, setDisplayedGames] = useState<IGame[]>([]);
    const [bufferGames, setBufferGames] = useState<IGame[]>([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [animationClass, setAnimationClass] = useState('');
    const setBanner = useHeaderStore((state) => state.setBanner);

    useEffect(() => {
        fetch('/api/games.php?type=random_popular&count=12')
            .then(response => response.json())
            .then(data => {
                setDisplayedGames(data.games.slice(0, 6));
                setBufferGames(data.games.slice(6));
                if (data.games.length > 0) {
                    setBanner(data.games[0].banner_image_url);
                }
            })
            .catch(error => {
                console.error('Error fetching games:', error);
            });
    }, [setBanner]);

    const handleTransition = () => {
        setAnimationClass('fadeOut');
        
        setTimeout(() => {
            setDisplayedGames(bufferGames);
            setAnimationClass('fadeIn');
            setBanner(bufferGames[0].banner_image_url);
        }, 500);
    };

    const loadNewBuffer = () => {
        fetch('/api/games.php?type=random_popular&count=6')
            .then(response => response.json())
            .then(data => {
                setBufferGames(data.games);
            })
            .catch(error => {
                console.error('Error fetching buffer games:', error);
            });
    };

    useEffect(() => {
        if (displayedGames.length > 0) {
            const interval = setInterval(() => {
                setActiveIndex(prevIndex => {
                    const nextIndex = (prevIndex + 1) % displayedGames.length;

                    if (nextIndex === 0) {
                        handleTransition();
                    } else {
                        setBanner(displayedGames[nextIndex].banner_image_url);
                        if (nextIndex === 3) {
                            loadNewBuffer();
                        }
                    }

                    return nextIndex;
                });
            }, 5000);

            return () => clearInterval(interval);
        }
    }, [displayedGames, bufferGames, setBanner]);

    return (
        <div className={styles.randomGames}>
            {displayedGames.length > 0 && (
                <>
                    <GameTitle 
                        title={displayedGames[activeIndex].game_name} 
                        developer={displayedGames[activeIndex].developer} 
                    />
                    <div className={styles.cardsContainer}>
                        <div className={`${styles.cards} ${animationClass ? styles[animationClass] : ''}`}>
                            {displayedGames.map((game) => (
                                <HeaderCard 
                                    key={game.game_id} 
                                    game={game} 
                                    isActive={game.game_id === displayedGames[activeIndex].game_id} 
                                />
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
