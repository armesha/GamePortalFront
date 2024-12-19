import GameCard from '@/components/GameCard/GameCard.tsx';
import Input from '@/components/Input/Input.tsx';
import { useAuth, User } from '@/providers/AuthContex';
import useHeaderStore from '@/store/headerStore.tsx';
import { useNavigate } from '@tanstack/react-router';
import React, { useEffect, useState } from 'react';
import { FaCamera, FaEdit, FaUserShield, FaSave, FaHeart, FaCalendarAlt, FaEnvelope, FaCrown, FaLock, FaLockOpen } from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './Profile.module.scss';

type UserProfile = {
    favoriteGames: Game[];
    isBlocked?: boolean;
    admin?: boolean;
    avatar: string;
    created_at?: string;
} & User;

type ProfileParams = {
    userId: string;
}

type Game = {
    game_id: number;
    game_name: string;
    rating: string;
    required_age: number;
    developer: string;
    steam_link: string;
    header_image_url: string;
    banner_image_url: string;
}

type Errors = {
    first_name?: string;
    last_name?: string;
    user_nickname?: string;
    email?: string;
    general?: string;
}

export default function Profile({userId}: ProfileParams) {
    const {user} = useAuth();
    const [userData, setUserData] = useState<UserProfile | null>(null);
    const [isOwnProfile, setIsOwnProfile] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedData, setEditedData] = useState<Partial<UserProfile>>({});
    const [errors, setErrors] = useState<Errors>({});
    const [isLoading, setIsLoading] = useState(false);
    const [isBlocked, setIsBlocked] = useState(false);
    const [isCurrentUserAdmin, setIsCurrentUserAdmin] = useState(false);
    const headerData = useHeaderStore();
    const navigation = useNavigate();

    useEffect(() => {
        headerData.setContent(<></>);
        headerData.setCompact(true);
        const loadUserProfile = async () => {
            setIsLoading(true);
            try {
                const endpoint = userId === 'me' ? '/api/user.php' : `/api/user.php?user_id=${userId}`;
                const response = await fetch(endpoint, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch user profile');
                }
                const data = await response.json();
                console.log('Profile data:', data); // Debug log
                const favoriteGamesResponse = await fetch(`/api/games.php?favorite=true&user_id=${data.user.user_id}&count=500`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (!favoriteGamesResponse.ok) {
                    throw new Error('Failed to fetch favorite games');
                }
                const favoriteGamesData = await favoriteGamesResponse.json();
                setUserData({
                    ...data.user,
                    favoriteGames: favoriteGamesData.games,
                    avatar: data.user.avatar_url ? `/${data.user.avatar_url}` : `https://picsum.photos/seed/${data.user.user_id}/200/200`,
                });
                setIsCurrentUserAdmin(user?.admin || false);
                setIsOwnProfile(userId === 'me');
                setIsBlocked(data.user.is_blocked || false);
            } catch (error) {
                console.error('Error fetching user profile:', error);
                navigation({to: '/'});
            } finally {
                setIsLoading(false);
            }
        };
        loadUserProfile();
    }, [userId, user]);

    useEffect(() => {
        return () => {
            headerData.setCompact(false);
        };
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setEditedData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
        setIsEditing(true);
    };

    const handleSaveChanges = async () => {
        const newErrors: Errors = {};

        if (!editedData.first_name && !userData?.first_name) newErrors.first_name = 'Jméno je povinné';
        if (!editedData.last_name && !userData?.last_name) newErrors.last_name = 'Příjmení je povinné';
        if (!editedData.user_nickname && !userData?.user_nickname) newErrors.user_nickname = 'Přezdívka je povinná';
        if (editedData.email && !/^\S+@\S+\.\S+$/.test(editedData.email)) {
            newErrors.email = 'Neplatný formát e-mailu';
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            try {
                setIsLoading(true);
                const response = await fetch('/api/user.php', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        ...editedData,
                        userId: userData?.user_id !== user?.user_id ? userData?.user_id : undefined
                    }),
                });
                
                if (!response.ok) {
                    const data = await response.json();
                    throw new Error(data.error || 'Failed to save changes');
                }
                // @ts-expect-error - null
                setUserData({...userData, ...editedData});
                setEditedData({});
                setIsEditing(false);
                toast.success('Profil byl úspěšně aktualizován');
            } catch (error) {
                console.error('Error saving changes:', error);
                toast.error(error instanceof Error ? error.message : 'Nepodařilo se uložit změny');
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            const formData = new FormData();
            formData.append('avatar', e.target.files[0]);
            try {
                setIsLoading(true);
                const response = await fetch('/api/upload_avatar.php', {
                    method: 'POST',
                    headers: {},
                    body: formData,
                });
                if (!response.ok) {
                    const data = await response.json();
                    throw new Error(data.error || 'Failed to upload avatar');
                }
                const data = await response.json();
                setUserData({...userData!, avatar: `/${data.avatar_url}`});
                toast.success('Avatar byl úspěšně aktualizován');
            } catch (error) {
                console.error('Error uploading avatar:', error);
                toast.error(error instanceof Error ? error.message : 'Nepodařilo se nahrát avatar');
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleBlockUser = async () => {
        try {
            const response = await fetch('/api/admin.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'block_user',
                    user_id: userData?.user_id,
                    is_blocked: !isBlocked,
                }),
            });
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to update block status');
            }
            setIsBlocked(!isBlocked);
            toast.success(isBlocked ? 'Uživatel byl odblokován' : 'Uživatel byl zablokován');
        } catch (error) {
            console.error('Error blocking user:', error);
            toast.error(error instanceof Error ? error.message : 'Nepodařilo se změnit stav blokování');
        }
    };

    const handleToggleAdmin = async () => {
        try {
            const response = await fetch('/api/admin.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'toggle_admin',
                    user_id: userData?.user_id,
                    set_admin: !userData?.admin
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to toggle admin status');
            }

            setUserData(prev => prev ? {...prev, admin: !prev.admin} : null);
            toast.success(`Admin role byla ${userData?.admin ? 'odebrána' : 'přidána'}`);
        } catch (error) {
            console.error('Error toggling admin status:', error);
            toast.error(error instanceof Error ? error.message : 'Nepodařilo se změnit admin status');
        }
    };

    return (
        <div className={styles.profileContainer}>
            {isLoading ? (
                <div className={styles.loader}>Načítání...</div>
            ) : userData ? (
                <>
                    <div className={styles.profileHeader}>
                        <div className={styles.avatarWrapper}>
                            <img
                                src={userData.avatar}
                                alt={`${userData.user_nickname}'s avatar`}
                                className={styles.avatar}
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.user_nickname)}&size=200&background=random`;
                                }}
                            />
                            {isOwnProfile && (
                                <label className={styles.changeAvatarButton} title="Změnit avatar">
                                    <FaCamera />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleAvatarUpload}
                                        style={{ display: 'none' }}
                                    />
                                </label>
                            )}
                        </div>

                        {!isEditing ? (
                            <>
                                <h2 className={styles.username}>
                                    {userData.user_nickname}
                                    {userData.admin && (
                                        <div className={styles.adminBadge} title="Admin">
                                            <FaUserShield style={{ color: '#ffd700' }} />
                                        </div>
                                    )}
                                </h2>

                                {(isCurrentUserAdmin || isOwnProfile) && (
                                    <div className={styles.emailContainer}>
                                        <FaEnvelope />
                                        <span style={{marginLeft: '8px'}}>{userData.email}</span>
                                    </div>
                                )}

                                {userData.created_at && (
                                    <div className={styles.joinDate}>
                                        <FaCalendarAlt className={styles.icon} />
                                        Členem od: {new Date(userData.created_at).toLocaleDateString('cs-CZ')}
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className={styles.editForm}>
                                <div className={styles.inputGroup}>
                                    <Input
                                        label="Přezdívka"
                                        name="user_nickname"
                                        value={editedData.user_nickname ?? userData.user_nickname}
                                        onChange={handleInputChange}
                                        error={errors.user_nickname}
                                        disabled={isLoading}
                                    />
                                </div>

                                <div className={styles.inputGroup}>
                                    <Input
                                        label="E-mail"
                                        name="email"
                                        type="email"
                                        value={editedData.email ?? userData.email}
                                        onChange={handleInputChange}
                                        error={errors.email}
                                        disabled={isLoading}
                                    />
                                </div>

                                <div className={styles.inputGroup}>
                                    <Input
                                        label="Jméno"
                                        name="first_name"
                                        value={editedData.first_name ?? userData.first_name ?? ''}
                                        onChange={handleInputChange}
                                        error={errors.first_name}
                                        disabled={isLoading}
                                    />
                                </div>

                                <div className={styles.inputGroup}>
                                    <Input
                                        label="Příjmení"
                                        name="last_name"
                                        value={editedData.last_name ?? userData.last_name ?? ''}
                                        onChange={handleInputChange}
                                        error={errors.last_name}
                                        disabled={isLoading}
                                    />
                                </div>

                                {errors.general && (
                                    <div className={styles.error}>{errors.general}</div>
                                )}
                            </div>
                        )}

                        {(isOwnProfile || user?.admin) && (
                            <button 
                                className={styles.editButton}
                                onClick={() => {
                                    if (isEditing) {
                                        handleSaveChanges();
                                    }
                                    setIsEditing(!isEditing);
                                }}
                            >
                                {isEditing ? <FaSave /> : <FaEdit />}
                                <span>{isEditing ? 'Uložit změny' : 'Upravit profil'}</span>
                            </button>
                        )}

                        {(user?.admin && !isOwnProfile) && (
                            <div className={styles.adminControls}>
                                <button 
                                    className={styles.adminButton}
                                    onClick={handleToggleAdmin}
                                    title={userData.admin ? 'Odebrat admin roli' : 'Přidat admin roli'}
                                >
                                    <FaCrown style={{ 
                                        width: '20px', 
                                        height: '20px',
                                        color: userData.admin ? '#ffd700' : '#808080' 
                                    }} />
                                </button>
                                <button 
                                    className={styles.blockButton} 
                                    onClick={handleBlockUser}
                                    title={userData?.isBlocked ? "Odblokovat uživatele" : "Zablokovat uživatele"}
                                >
                                    {userData?.isBlocked ? 
                                        <FaLockOpen style={{ 
                                            width: '20px', 
                                            height: '20px',
                                            color: '#4CAF50' 
                                        }} /> : 
                                        <FaLock style={{ 
                                            width: '20px', 
                                            height: '20px',
                                            color: '#f44336' 
                                        }} />
                                    }
                                </button>
                            </div>
                        )}
                    </div>

                    {userData.favoriteGames && userData.favoriteGames.length > 0 && (
                        <div className={styles.favoriteGames}>
                            <h3>
                                <FaHeart className={styles.icon} />
                                Oblíbené hry
                            </h3>
                            <div className={styles.gamesGrid}>
                                {userData.favoriteGames.map((game) => (
                                    <GameCard
                                        key={game.game_id}
                                        id={game.game_id}
                                        title={game.game_name}
                                        image={game.header_image_url}
                                        rating={parseFloat(game.rating)}
                                        favorite={true}
                                        onMouseEnter={() => headerData.setBanner(game.banner_image_url)}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <div className={styles.error}>Uživatel nenalezen</div>
            )}
        </div>
    );
}