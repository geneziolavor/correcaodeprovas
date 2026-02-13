import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { StudentDashboard } from '../app/components/StudentDashboard';

export function StudentDashboardPage() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleNavigate = (screen: string) => {
        if (screen === 'logout') {
            logout();
            navigate('/login');
            return;
        }

        // Map legacy screen names to routes
        const routeMap: Record<string, string> = {
            'student-dashboard': '/student',
            'progress': '/student/progress',
            'activities': '/student/activities',
            'learning-paths': '/student/learning-paths',
            'portfolio': '/student/portfolio'
        };

        const target = routeMap[screen];
        if (target) {
            navigate(target);
        } else {
            console.warn(`Rota desconhecida: ${screen}`);
        }
    };

    return <StudentDashboard onNavigate={handleNavigate} currentUser={user} />;
}
