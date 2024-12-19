import Register from '@/components/Auth/Register/Register.tsx';
import { useAuth } from '@/providers/AuthContex.tsx';
import { createFileRoute, useNavigate } from '@tanstack/react-router';

export const Route = createFileRoute('/register/')({
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

    return (
        <Register/>
    );
}