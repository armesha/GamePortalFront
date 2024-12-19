import Login from '@/components/Auth/Login/Login.tsx';
import { useAuth } from '@/providers/AuthContex.tsx';
import { createFileRoute, useNavigate } from '@tanstack/react-router';

export const Route = createFileRoute('/login/')({
    component: LoginPage,
});

function LoginPage() {
    const {user} = useAuth();
    const navigate = useNavigate();
    if (user) {
        navigate({
            to: '/',
        });
    }
    return <Login/>;
}
