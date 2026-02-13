import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Role } from '../types';

interface PrivateRouteProps {
    role?: Role;
    children: ReactNode;
    fallback?: string;
}

export function PrivateRoute({ role, children, fallback = '/login' }: PrivateRouteProps) {
    const { user, role: userRole } = useAuth();

    if (!user) {
        return <Navigate to={fallback} replace />;
    }

    if (role && userRole !== role) {
        return <Navigate to={fallback} replace />;
    }

    return <>{children}</>;
}
