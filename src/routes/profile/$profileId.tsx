import Profile from '@/components/Profile/Profile.tsx';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/profile/$profileId')({
    component: ProfilePage,
});

function ProfilePage() {
    const {profileId} = Route.useParams();

    return <Profile userId={profileId}/>;
}
