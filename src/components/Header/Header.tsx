import Logo from '@/assets/logom.svg';
import SearchInput from '@/components/Input/SearchInput.tsx';
import RandomGames from '@/components/RandomGames/RandomGames.tsx';
import { useAuth } from '@/providers/AuthContex.tsx';
import useHeaderStore from '@/store/headerStore.tsx';
import { Link } from '@tanstack/react-router';
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import styles from './Header.module.scss';
import LoginDropdown from './LoginDropdown/LoginDropdown.tsx';
import ProfileButton from './ProfileButton/ProfileButton.tsx';

interface Banner {
    src: string;
    key: string;
    isFadingOut: boolean;
}

export default function Header() {
    const {user} = useAuth();
    const headerData = useHeaderStore();

    const [banners, setBanners] = useState<Banner[]>([]);
    const timeoutsRef = useRef<{ [key: string]: ReturnType<typeof setTimeout> }>({});

    useEffect(() => {
        if (headerData.banner) {
            const newBannerKey = Date.now().toString();
            const newBanner: Banner = {
                src: headerData.banner,
                key: newBannerKey,
                isFadingOut: false,
            };
            setBanners((prevBanners) => {
                const updatedBanners = prevBanners.map((banner) => ({
                    ...banner,
                    isFadingOut: true,
                }));
                const allBanners = [...updatedBanners, newBanner];
                return allBanners.slice(-5);
            });
        }
    }, [headerData.banner]);

    useEffect(() => {
        banners.forEach((banner) => {
            if (banner.isFadingOut && !timeoutsRef.current[banner.key]) {
                timeoutsRef.current[banner.key] = setTimeout(() => {
                    setBanners((prevBanners) =>
                        prevBanners.filter((b) => b.key !== banner.key)
                    );
                    delete timeoutsRef.current[banner.key];
                }, 2000);
            }
        });

        return () => {
            Object.values(timeoutsRef.current).forEach(clearTimeout);
            timeoutsRef.current = {};
        };
    }, [banners]);

    return (
        <div className={clsx(styles.container, headerData.compact && styles.compact)}>
            <div className={styles.banner}>
                {banners.map((banner) => (
                    <img
                        key={banner.key}
                        src={banner.src}
                        alt={'Banner'}
                        className={clsx(
                            styles.bannerImage,
                            banner.isFadingOut ? styles.fadeOut : styles.fadeIn
                        )}
                    />
                ))}
            </div>

            <div className={styles.bannerContent}>
                <div className={styles.wrapper}>
                    <div className={styles.top}>
                        <div className={styles.desktopLayout}>
                            <Link to={'/'}>
                                {
                                    // @ts-expect-error - ...
                                    <Logo className={styles.logo}/>
                                }
                            </Link>
                            <SearchInput/>
                            {user ? <ProfileButton/> : <LoginDropdown/>}
                        </div>
                        <div className={styles.mobileLayout}>
                            <div className={styles.topRow}>
                                <Link to={'/'}>
                                    {
                                        // @ts-expect-error - ...
                                        <Logo className={styles.logo}/>
                                    }
                                </Link>
                                {user ? <ProfileButton/> : <LoginDropdown/>}
                            </div>
                            <div className={styles.searchRow}>
                                <SearchInput/>
                            </div>
                        </div>
                    </div>
                    <div className={styles.bottom}>
                        {headerData.content || <RandomGames/>}
                    </div>
                </div>
            </div>
        </div>
    );
}
