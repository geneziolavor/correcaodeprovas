import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Login } from '../app/components/Login';

export function LoginPage() {
    const { login, isAuthenticated, role } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated && role) {
            const path = role === 'student' ? '/student' : '/teacher';
            console.log('[DEBUG] Identificada sessão ativa. Redirecionando para:', path);
            navigate(path, { replace: true });
        }
    }, [isAuthenticated, role, navigate]);

    const handleLogin = (userType: 'student' | 'teacher', userData: any) => {
        console.log('[DEBUG] Processando login para:', userType);
        login(userType, userData);

        // Navegação forçada imediata
        const dest = userType === 'student' ? '/student' : '/teacher';
        navigate(dest, { replace: true });
    };

    if (isAuthenticated && role) {
        return (
            <div className="min-h-screen bg-[#020617] flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
            </div>
        );
    }

    return <Login onLogin={handleLogin} />;
}
