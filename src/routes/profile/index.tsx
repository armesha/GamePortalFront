import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/profile/')({
    loader: () => {
        redirect({
            to: '/profile/me',
            throw: true,
        });
    },
});
