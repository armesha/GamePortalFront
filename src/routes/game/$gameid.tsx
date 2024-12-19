import CartIcon from '@/assets/icons/cart.svg';
import Comments from '@/components/Comments/Comments.tsx';
import GameTitle from '@/components/GameTitle/GameTitle.tsx';
import InfoBlock from '@/components/InfoBlock/InfoBlock.tsx';
import SimpleSection from '@/components/SimpleSection/SimpleSection.tsx';
import Tags from '@/components/Tags/Tags.tsx';
import { useAuth } from '@/providers/AuthContex.tsx';
import useHeaderStore from '@/store/headerStore.tsx';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect } from 'react';
import { Rating } from 'react-simple-star-rating';
import styles from './GamePage.module.scss';

interface GameData {
    game_id: number;
    game_name: string;
    developer: string;
    steam_link: string;
    header_image_url: string;
    banner_image_url: string;
    detailed_description: string;
    release_date: string;
    rating: string;
    budget: string;
    score: number;
    required_age: number;
    feedbacks: Feedback[];
    tags: string[];
    price: number;
}

interface Feedback {
    feedback_id: number;
    rating: number;
    comment: string;
    created_at: string;
    user_id: number;
    first_name: string;
    last_name: string;
    user_nickname: string;
    avatar_url: string | null;
}

export const Route = createFileRoute('/game/$gameid')({
    component: GamePage,
    loader: ({params}) => LoadGameData(params.gameid),
});

async function LoadGameData(gameId: string): Promise<GameData> {
    const response = await fetch(`/api/game.php?id=${gameId}`);
    if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
    }
    const data = await response.json();
    return data.game;
}

function GamePage() {
    const {user} = useAuth();

    const gameData = Route.useLoaderData() as GameData;
    const headerData = useHeaderStore();

    useEffect(() => {
        headerData.setContent(
            <div className={styles.header}>
                <GameTitle title={gameData.game_name} developer={gameData.developer}/>
                <Tags tags={gameData.tags || []}/>
                <div className={styles.info}>
                    <InfoBlock value={<CartIcon/>} className={styles.buyButton} href={gameData.steam_link}/>
                    <InfoBlock title={'Cena'} value={`${gameData.price}$`}/>
                    <InfoBlock title={'Vydání'} value={new Date(gameData.release_date).toLocaleDateString('de')}/>
                    <InfoBlock title={'Omezení'} value={`${gameData.required_age}+`}/>
                    <InfoBlock
                        title={'Skóre'}
                        value={
                            <Rating
                                initialValue={Number(gameData.rating) / 20}
                                size={20}
                                transition
                                allowFraction
                                readonly
                            />
                        }
                    />
                </div>
            </div>
        );
        headerData.setBanner(gameData.banner_image_url);
    }, [gameData]);

    return (
        <>
            <SimpleSection title={'Popis'}>
                <p>{gameData.detailed_description}</p>
            </SimpleSection>

            {user &&
                <SimpleSection title={'Komentáře'} className={styles.commentsSection}>
                    <Comments gameId={gameData.game_id}/>
                </SimpleSection>
            }
        </>
    );
}