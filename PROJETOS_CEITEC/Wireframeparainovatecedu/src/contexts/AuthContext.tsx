import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Role } from '../types';
import { getFromStorage, saveToStorage } from '../app/utils/storage';

interface AuthContextType {
    user: User | null;
    role: Role | null;
    isAuthenticated: boolean;
    login: (role: Role, userData: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthState {
    user: User | null;
    role: Role | null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<AuthState>(() => ({
        user: getFromStorage('current_user', null),
        role: getFromStorage('user_type', null)
    }));

    const login = (newRole: Role, userData: User) => {
        console.log('[AUTH] Iniciando login...', { role: newRole, userData });
        try {
            console.log('[AUTH] Salvando no localStorage...');
            saveToStorage('current_user', userData);
            saveToStorage('user_type', newRole);

            console.log('[AUTH] Verificando salvamento...');
            const savedUser = getFromStorage('current_user', null);
            const savedRole = getFromStorage('user_type', null);

            console.log('[AUTH] Dados salvos:', { savedUser, savedRole });

            if (!savedUser || !savedUser.id) {
                console.error('[AUTH] ERRO: Usuário não foi salvo corretamente!', { savedUser });
                throw new Error('Falha ao salvar usuário no localStorage');
            }

            setState({ user: userData, role: newRole });
            console.log('[AUTH] Login concluído com sucesso!');
        } catch (e) {
            console.error('[AUTH] Falha crítica no armazenamento!', e);
            throw e;
        }
    };

    const logout = () => {
        saveToStorage('current_user', null);
        saveToStorage('user_type', null);
        setState({ user: null, role: null });
    };

    return (
        <AuthContext.Provider value={{
            user: state.user,
            role: state.role,
            isAuthenticated: !!state.user,
            login,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
