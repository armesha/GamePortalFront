import { useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { Rating } from 'react-simple-star-rating';
import { useAuth } from '../../providers/AuthContex';
import styles from './Comments.module.scss';

export type Comment = {
    id: number;
    user: {
        id: number;
        name: string;
        avatar?: string;
    };
    text: string;
    created_at: string;
    rating: number;
};

interface CommentsProps {
    gameId: number;
}

type Feedback = {
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

export default function Comments({gameId}: CommentsProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState<string>('');
    const [newRating, setNewRating] = useState<number>(0);
    const {user} = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await fetch(`/api/feedback_management.php?game_id=${gameId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch comments');
                }
                const data = await response.json();
                const fetchedComments: Comment[] = data.feedbacks.map((feedback: Feedback) => ({
                    id: feedback.feedback_id,
                    user: {
                        id: feedback.user_id,
                        name: feedback.user_nickname || `${feedback.first_name} ${feedback.last_name}`,
                        avatar: feedback.avatar_url ? `/${feedback.avatar_url}` : `https://picsum.photos/seed/${feedback.user_id}/200/200`,
                    },
                    text: feedback.comment,
                    created_at: feedback.created_at,
                    rating: feedback.rating,
                }));
                
                // Sort comments to show user's comment at top
                if (user) {
                    const sortedComments = fetchedComments.sort((a, b) => {
                        if (a.user.id === user.user_id) return -1;
                        if (b.user.id === user.user_id) return 1;
                        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                    });
                    setComments(sortedComments);
                } else {
                    setComments(fetchedComments.sort((a, b) => 
                        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                    ));
                }
            } catch (error) {
                console.error('Error fetching comments:', error);
            }
        };
        fetchComments();
    }, [gameId, user]);

    const handleDelete = async (commentId: number) => {
        try {
            const response = await fetch('/api/feedback_management.php', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({feedback_id: commentId}),
            });
            
            if (!response.ok) {
                throw new Error('Failed to delete comment');
            }
            
            // Update comments state with proper sorting
            const updatedComments = comments
                .filter(comment => comment.id !== commentId)
                .sort((a, b) => {
                    if (user && a.user.id === user.user_id) return -1;
                    if (user && b.user.id === user.user_id) return 1;
                    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                });
            
            setComments(updatedComments);
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    const handleSubmit = async () => {
        if (!user) return;
        if (newComment.trim() === '' || newRating < 0.5 || newRating > 5) return;
        try {
            const response = await fetch('/api/feedback.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    game_id: gameId,
                    comment: newComment,
                    rating: newRating,
                }),
            });
            if (!response.ok) {
                throw new Error('Comm error');
            }
            const result = await response.json();
            if (!result.feedback_id) {
                throw new Error('No feedback ID returned');
            }
            
            const newCommentObj = {
                id: result.feedback_id,
                user: {
                    id: user.user_id,
                    name: user.first_name + ' ' + user.last_name,
                    avatar: user.avatar_url ? `/${user.avatar_url}` : `https://picsum.photos/seed/${user.user_id}/200/200`,
                },
                text: newComment,
                created_at: new Date().toISOString(),
                rating: newRating,
            };
            
            const updatedComments = [...comments, newCommentObj].sort((a, b) => {
                if (a.user.id === user.user_id) return -1;
                if (b.user.id === user.user_id) return 1;
                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            });
            
            setComments(updatedComments);
            setNewComment('');
            setNewRating(0);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className={styles.comments}>
            {user && !comments.some(comment => comment.user.id === user.user_id) && (
                <div className={styles.newComment}>
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Zanechat komentář"
                        className={styles.commentInput}
                        rows={4}
                    />
                    <div>
                        <Rating
                            onClick={(rate) => setNewRating(rate)}
                            initialValue={newRating}
                            size={32}
                            iconsCount={5}
                            allowFraction
                        />
                    </div>
                    <button
                        className={`${styles.submitButton} ${(newComment.trim() === '' || newRating < 0.5 || newRating > 5) ? styles.disabled : ''}`}
                        onClick={handleSubmit}
                        disabled={newComment.trim() === '' || newRating < 0.5 || newRating > 5}
                    >
                        Odeslat
                    </button>
                </div>
            )}
            {comments.map((comment) => (
                <div key={comment.id} className={styles.comment}>
                    {(user?.admin || user?.user_id === comment.user.id) && (
                        <button
                            className={styles.deleteButton}
                            onClick={() => handleDelete(comment.id)}
                        >
                            ×
                        </button>
                    )}
                    <div className={styles.user}>
                        <img
                            src={comment.user.avatar}
                            alt={comment.user.name}
                            onClick={() => navigate({to: `/profile/${comment.user.id}`})}
                        />
                        <span onClick={() => navigate({to: `/profile/${comment.user.id}`})}>
                            {comment.user.name}
                        </span>
                    </div>
                    <div className={styles.text}>
                        <p>{comment.text}</p>
                        <Rating
                            initialValue={comment.rating}
                            size={20}
                            transition
                            allowFraction
                            readonly
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}