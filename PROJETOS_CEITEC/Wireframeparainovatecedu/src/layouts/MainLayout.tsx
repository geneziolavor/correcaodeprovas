import React, { useState } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import {
    LayoutDashboard,
    BookOpen,
    Users,
    BarChart3,
    Calendar,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight,
    Sparkles,
    Trophy,
    Bell,
    Search,
    Zap,
    GraduationCap,
    Cpu
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../app/components/ui/button';
import { Badge } from '../app/components/ui/badge';
import { motion, AnimatePresence } from 'motion/react';

export function MainLayout() {
    const { user, role, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isCollapsed, setIsCollapsed] = useState(false);

    const teacherMenu = [
        { label: 'Dashboard', icon: LayoutDashboard, path: '/teacher' },
        { label: 'Minhas Turmas', icon: Users, path: '/teacher/classes' },
        { label: 'Correções', icon: Zap, path: '/teacher/submissions' },
        { label: 'Relatórios', icon: BarChart3, path: '/teacher/reports' },
        { label: 'Calendário', icon: Calendar, path: '/teacher/calendar' },
    ];

    const studentMenu = [
        { label: 'Início', icon: LayoutDashboard, path: '/student' },
        { label: 'Atividades', icon: BookOpen, path: '/student/activities' },
        { label: 'Meu Portfólio', icon: Trophy, path: '/student/portfolio' },
        { label: 'Meu Progresso', icon: BarChart3, path: '/student/progress' },
    ];

    const menuItems = role === 'teacher' ? teacherMenu : studentMenu;

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex h-screen bg-[#EFF6FF] text-slate-900 overflow-hidden font-sans selection:bg-blue-500/30">

            {/* HUD Backdrop - SUAVE E CLARO */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-[10%] -right-[10%] w-[40%] h-[40%] bg-blue-200/20 blur-[150px] rounded-full" />
                <div className="absolute -bottom-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-100/30 blur-[150px] rounded-full" />
            </div>

            {/* Sidebar Evoluída c/ Efeito Moderno */}
            <motion.aside
                initial={false}
                animate={{ width: isCollapsed ? '90px' : '300px' }}
                className="relative z-30 h-full border-r border-blue-100 bg-white flex flex-col transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] shadow-[10px_0_30px_rgba(37,99,235,0.05)]"
            >
                {/* Logo Area - PREMIUM */}
                <div className="p-8 flex items-center gap-4 group">
                    <div className="min-w-[48px] h-12 rounded-2xl bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 flex items-center justify-center shadow-[0_8px_16px_rgba(37,99,235,0.2)] group-hover:scale-110 transition-transform duration-500">
                        <GraduationCap className="w-7 h-7 text-white drop-shadow-md" />
                    </div>
                    {!isCollapsed && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex flex-col"
                        >
                            <span className="font-black text-xl tracking-tighter leading-none italic text-slate-900">INOVATEC<span className="text-blue-600">_OS</span></span>
                            <div className="flex items-center gap-2">
                                <span className="text-[9px] text-slate-400 font-black uppercase tracking-[0.3em]">Build_2026.x</span>
                                <div className="w-1 h-1 rounded-full bg-blue-500"></div>
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Navigation - HIGH CONTRAST */}
                <nav className="flex-1 px-5 space-y-2 mt-6 overflow-y-auto no-scrollbar relative z-10">
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path) && item.path !== '/student' && item.path !== '/teacher');
                        return (
                            <motion.button
                                key={item.path}
                                whileHover={{ x: 5 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => navigate(item.path)}
                                className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 group relative
                                    ${isActive
                                        ? 'bg-blue-50 text-blue-600 shadow-sm'
                                        : 'text-slate-500 hover:text-blue-600 hover:bg-blue-50/50'}
                                `}
                            >
                                <item.icon className={`w-5 h-5 transition-colors duration-300 ${isActive ? 'text-blue-600' : 'group-hover:text-blue-600'}`} />
                                {!isCollapsed && (
                                    <span className={`font-black uppercase tracking-widest text-[10px] transition-colors duration-300 ${isActive ? 'text-blue-600' : 'group-hover:text-blue-600'}`}>
                                        {item.label}
                                    </span>
                                )}
                                {isActive && !isCollapsed && (
                                    <div className="absolute right-4 w-1.5 h-1.5 bg-blue-600 rounded-full shadow-[0_0_8px_rgba(37,99,235,0.4)]"></div>
                                )}
                            </motion.button>
                        );
                    })}
                </nav>

                {/* User context / Footer - INTEGRATED */}
                <div className="p-6 border-t border-blue-50 space-y-6 bg-slate-50/30">
                    {!isCollapsed && (
                        <div className="p-4 bg-white rounded-2xl border border-blue-100 shadow-sm group cursor-pointer hover:border-blue-300 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100 group-hover:scale-105 transition-transform overflow-hidden relative">
                                    <span className="text-2xl relative z-10">{user?.avatar || '👤'}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-black truncate text-slate-900 uppercase italic tracking-tighter">{user?.name}</p>
                                    <Badge className="p-0 text-[10px] text-blue-600 font-black uppercase tracking-[0.2em] bg-transparent border-none hover:bg-transparent">STATUS:_{role}</Badge>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col gap-2">
                        <button
                            onClick={handleLogout}
                            className={`w-full flex items-center gap-4 p-4 rounded-xl text-slate-500 hover:text-red-500 hover:bg-red-50 transition-all duration-300 group`}
                        >
                            <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                            {!isCollapsed && <span className="font-black uppercase tracking-widest text-[10px]">Encerrar Link</span>}
                        </button>

                        <button
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            className="w-full flex items-center justify-center p-3 text-slate-400 hover:text-blue-600 transition-colors bg-slate-50 rounded-xl border border-blue-50"
                        >
                            {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </motion.aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col relative z-20 overflow-hidden bg-transparent">

                {/* Top HUB bar - COMAND CENTER FEEL */}
                <header className="h-24 border-b border-blue-100 bg-white/80 backdrop-blur-md px-10 flex items-center justify-between shadow-sm">
                    <div className="flex-1 max-w-2xl relative group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                        <input
                            type="text"
                            placeholder="OPERADOR_SEARCH:// COMANDO DE BUSCA... (Ctrl+K)"
                            className="w-full bg-slate-50 border border-blue-100 rounded-2xl py-4 pl-14 pr-6 text-xs font-bold tracking-widest text-slate-900 focus:outline-none focus:border-blue-400 focus:bg-white transition-all uppercase placeholder:text-slate-400"
                        />
                    </div>

                    <div className="flex items-center gap-8 pl-8">
                        <div className="flex items-center gap-6 border-r border-blue-50 pr-8">
                            <div className="text-right hidden sm:block">
                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em] leading-none mb-2">DATA_LINK_STATUS</p>
                                <div className="flex items-center justify-end gap-3">
                                    <span className="text-xs font-black text-emerald-600 tracking-tighter">ESTÁVEL_V4.2</span>
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"></div>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" className="relative text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl w-12 h-12 transition-all">
                                <Bell className="w-6 h-6" />
                                <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                            </Button>
                        </div>

                        {role === 'student' && (
                            <div className="flex items-center gap-5">
                                <div className="text-right">
                                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.3em] leading-none mb-1">XP_ACCUMULATED</p>
                                    <p className="text-xl font-black text-blue-600 italic leading-none">{user?.xp || 0} XP</p>
                                </div>
                                <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center group cursor-pointer hover:border-blue-400 transition-all shadow-sm">
                                    <Zap className="w-6 h-6 text-blue-500 group-hover:scale-110 transition-transform" />
                                </div>
                            </div>
                        )}

                        {role === 'teacher' && (
                            <div className="flex items-center gap-4">
                                <Badge className="bg-blue-50 text-blue-600 border border-blue-100 font-black text-[9px] uppercase tracking-[0.2em] px-4 py-2 rounded-xl">
                                    <Cpu className="w-3.5 h-3.5 mr-2" /> AI_HUB_ENABLED
                                </Badge>
                            </div>
                        )}
                    </div>
                </header>

                {/* Dynamic Content View */}
                <div className="flex-1 overflow-y-auto no-scrollbar custom-scrollbar bg-transparent">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={location.pathname}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="p-10 min-h-full w-full flex flex-col"
                        >
                            <div className="flex-1">
                                <Outlet />
                            </div>

                            {/* Footer Pedagógico Operacional */}
                            <footer className="mt-20 pt-10 border-t border-blue-100/50 text-center">
                                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 italic">
                                    EDUCADOR GENÉZIO DE LAVOR CEITEC 2026 // ITA TECNOLOGIA EDUCACIONAL
                                </p>
                            </footer>
                        </motion.div>
                    </AnimatePresence>
                </div>

            </main>

        </div>
    );
}
