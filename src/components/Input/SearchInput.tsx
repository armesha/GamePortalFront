import { FaSearch } from 'react-icons/fa';
import GameCard from '@/components/GameCard/GameCard.tsx';
import { IGame } from '@/components/RandomGames/RandomGames.tsx';
import useChatStore from '@/store/chatStore.ts';
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import Input from './Input';
import styles from './Input.module.scss';

function SearchInput() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<IGame[]>([]);
    const [isFocused, setIsFocused] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    // @ts-expect-error - NodeJS.Timeout
    const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const {isChatOpen} = useChatStore();

    useEffect(() => {
        if (debounceTimer) {
            clearTimeout(debounceTimer);
        }

        const timer = setTimeout(async () => {
            if (query.length > 0) {
                setIsLoading(true);
                try {
                    const response = await fetch(`/api/games.php?search=${query}&count=25`);
                    const data = await response.json();
                    setResults(data.games);
                } catch (error) {
                    console.error('Chyba při vyhledávání:', error);
                } finally {
                    setIsLoading(false);
                }
            } else {
                setResults([]);
            }
        }, 500);

        setDebounceTimer(timer);

        return () => {
            if (timer) {
                clearTimeout(timer);
            }
        };
    }, [query]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsFocused(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [containerRef]);

    return (
        <div 
            ref={containerRef}
            className={clsx(
                styles.searchContainer, 
                isFocused && styles.focused, 
                isChatOpen && styles.hidden
            )}
        >
            <Input
                className={styles.searchInput}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setIsFocused(true)}
                placeholder="Vyhledat hry..."
                icon={<FaSearch />}
            />
            {isFocused && query.length > 0 && (
                <div className={styles.resultsPanel}>
                    {isLoading ? (
                        <div className={styles.infoTextContainer}>
                            <div className={styles.loading}>Načítání...</div>
                        </div>
                    ) : results.length > 0 ? (
                        results.map((result) => (
                            <div key={result.game_id} className={styles.result} onClick={() => {
                                setIsFocused(false);
                            }}>
                                <GameCard 
                                    id={result.game_id} 
                                    title={result.game_name} 
                                    image={result.header_image_url}
                                    favorite={result.liked}
                                />
                            </div>
                        ))
                    ) : (
                        <div className={styles.infoTextContainer}>
                            <div className={styles.noResults}>Žádné výsledky nenalezeny</div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default SearchInput;