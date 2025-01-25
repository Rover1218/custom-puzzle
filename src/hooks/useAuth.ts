import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getAuthenticatedUser, User } from '../utils/auth';

export const useAuth = (requireAuth = true) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkAuth = () => {
            const auth = getAuthenticatedUser();
            if (!auth && requireAuth) {
                router.push('/login');
            } else if (auth) {
                setUser(auth.user);
            }
            setLoading(false);
        };

        checkAuth();
    }, [requireAuth, router]);

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        router.push('/login');
    };

    return {
        user,
        loading,
        logout,
        isAuthenticated: !!user
    };
};

export default useAuth;
