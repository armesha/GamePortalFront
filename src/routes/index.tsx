import GameCard from '@/components/GameCard/GameCard.tsx';
import LoadMore from '@/components/LoadMore/LoadMore.tsx';
import Section from '@/components/Section/Section.tsx';
import Skeleton from '@/components/Skeleton/Skeleton.tsx';
import { createFileRoute } from '@tanstack/react-router';
import React, { useEffect, useState } from 'react';

export const Route = createFileRoute('/')({
    component: MainLayout,
});

interface Game {
    game_id: number;
    game_name: string;
    header_image_url: string;
    required_age: number;
    rating: string;
    liked: boolean;
}

function MainLayout() {
    const [popularGames, setPopularGames] = useState<Game[]>([]);
    const [newGames, setNewGames] = useState<Game[]>([]);
    const [oldGames, setOldGames] = useState<Game[]>([]);
    const [loadingPopular, setLoadingPopular] = useState(true);
    const [loadingNew, setLoadingNew] = useState(true);
    const [loadingOld, setLoadingOld] = useState(true);

    useEffect(() => {
        // Load Popular Games
        fetch('/api/games.php?type=popular')
            .then(response => response.json())
            .then(data => {
                setPopularGames(data.games);
                setLoadingPopular(false);
            })
            .catch(() => setLoadingPopular(false));

        // Load New Games
        fetch('/api/games.php?type=new')
            .then(response => response.json())
            .then(data => {
                setNewGames(data.games);
                setLoadingNew(false);
            })
            .catch(() => setLoadingNew(false));

        // Load Old Games
        fetch('/api/games.php?type=old')
            .then(response => response.json())
            .then(data => {
                setOldGames(data.games);
                setLoadingOld(false);
            })
            .catch(() => setLoadingOld(false));
    }, []);

    // Implement loadMore function
    const loadMore = (type: 'popular' | 'new' | 'old') => {
        let currentOffset = 0;
        let setGames: React.Dispatch<React.SetStateAction<Game[]>>;

        switch (type) {
            case 'popular':
                currentOffset = popularGames.length;
                setGames = setPopularGames;
                break;
            case 'new':
                currentOffset = newGames.length;
                setGames = setNewGames;
                break;
            case 'old':
                currentOffset = oldGames.length;
                setGames = setOldGames;
                break;
        }

        fetch(`/api/games.php?type=${type}&offset=${currentOffset}`)
            .then(response => response.json())
            .then(data => {
                setGames(prevGames => [...prevGames, ...data.games]);
            })
            .catch(() => {
            });
    };

    return (
        <>
            <Section title={'Populární hry'} icon={'https://em-content.zobj.net/source/apple/391/fire_1f525.png'}>
                {
                    loadingPopular ? (
                        new Array(10).fill(0).map((_, index) => <Skeleton key={index}/>)
                    ) : (
                        popularGames.map((game, index) => (
                            <GameCard key={index} title={game.game_name}
                                      image={game.header_image_url}
                                      age={game.required_age} id={game.game_id} rating={Number(game.rating)}
                                      favorite={game.liked}/>
                        ))
                    )
                }
                {/*<button onClick={() => loadMore('popular')} className={'more'}>Nahrát další</button>*/}
                <LoadMore onClick={() => loadMore('popular')}/>
            </Section>
            <Section title={'Nové hry'} icon={'https://em-content.zobj.net/source/apple/391/gem-stone_1f48e.png'}>
                {
                    loadingNew ? (
                        new Array(10).fill(0).map((_, index) => <Skeleton key={index}/>)
                    ) : (
                        newGames.map((game, index) => (
                            <GameCard key={index} title={game.game_name}
                                      image={game.header_image_url}
                                      age={game.required_age} id={game.game_id} rating={Number(game.rating)}
                                      favorite={game.liked}/>
                        ))
                    )
                }
                <LoadMore onClick={() => loadMore('new')}/>
            </Section>
            <Section title={'Staré hry'} icon={'https://em-content.zobj.net/source/apple/391/videocassette_1f4fc.png'}>
                {
                    loadingOld ? (
                        new Array(10).fill(0).map((_, index) => <Skeleton key={index}/>)
                    ) : (
                        oldGames.map((game, index) => (
                            <GameCard key={index} title={game.game_name}
                                      image={game.header_image_url}
                                      age={game.required_age} id={game.game_id} rating={Number(game.rating)}
                                      favorite={game.liked}/>
                        ))
                    )
                }
                <LoadMore onClick={() => loadMore('old')}/>
            </Section>
        </>
    );
}