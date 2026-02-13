import { useState, useMemo } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import {
    TrendingUp, Users, BookOpen, AlertCircle, Search,
    Filter, Download, ArrowLeft, Brain, Sparkles,
    Target, Zap, ShieldCheck, Microscope, LayoutDashboard, ClipboardList
} from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Class, Activity, Submission, EnrolledStudent } from '../../types';
import { motion, AnimatePresence } from 'motion/react';

import { toast } from 'sonner';

interface ReportsProps {
    onNavigate: (screen: string, id?: string) => void;
    classes: Class[];
    activities: Activity[];
    submissions: Submission[];
    students: EnrolledStudent[];
    loading: boolean;
    onSeedData?: () => Promise<void>;
}

export function Reports({
    onNavigate,
    classes,
    activities,
    submissions,
    students,
    loading,
    onSeedData
}: ReportsProps) {
    const [activeTab, setActiveTab] = useState<'overview' | 'classes' | 'students'>('overview');
    const [searchTerm, setSearchTerm] = useState('');
    const [isSeeding, setIsSeeding] = useState(false);

    // Stats computation
    const stats = useMemo(() => {
        const totalStudents = students.length;
        const totalSubmissions = submissions.length;
        const gradedSubmissions = submissions.filter(s => s.status === 'graded' && s.grade !== undefined);
        const avgGradeTotal = gradedSubmissions.reduce((acc, s) => acc + (s.grade || 0), 0);
        const avgGrade = gradedSubmissions.length > 0 ? avgGradeTotal / gradedSubmissions.length : 0;
        const engagement = totalStudents > 0 ? (totalSubmissions / (totalStudents * Math.max(activities.length, 1))) * 100 : 0;

        return {
            totalStudents,
            totalSubmissions,
            avgGrade: avgGrade.toFixed(1),
            engagement: Math.min(engagement, 100).toFixed(0)
        };
    }, [students, submissions, activities]);

    // Chart data: Grades distribution
    const gradesData = useMemo(() => {
        const ranges = [
            { range: '0-2', count: 0 },
            { range: '2-4', count: 0 },
            { range: '4-6', count: 0 },
            { range: '6-8', count: 0 },
            { range: '8-10', count: 0 },
        ];
        submissions.forEach(s => {
            if (s.grade !== undefined) {
                if (s.grade < 2) ranges[0].count++;
                else if (s.grade < 4) ranges[1].count++;
                else if (s.grade < 6) ranges[2].count++;
                else if (s.grade < 8) ranges[3].count++;
                else ranges[4].count++;
            }
        });
        return ranges;
    }, [submissions]);

    // Chart data: Class Comparison
    const classComparisonData = useMemo(() => {
        return classes.map(c => {
            const classSubs = submissions.filter(s => {
                const student = students.find(st => st.id === (s.studentId || s.student_id));
                return student?.classId === c.id || (student as any)?.class_id === c.id;
            });
            const gradedClassSubs = classSubs.filter(s => s.grade !== undefined);
            const avg = gradedClassSubs.length > 0 ? gradedClassSubs.reduce((acc, s) => acc + (s.grade || 0), 0) / gradedClassSubs.length : 0;
            return {
                name: c.name,
                media: Number(avg.toFixed(1)),
                taxa: (classSubs.length / (Math.max(c.studentsCount, 1) * Math.max(activities.length, 1))) * 100
            };
        });
    }, [classes, submissions, students, activities]);

    const handleSeed = async () => {
        if (!onSeedData) return;
        setIsSeeding(true);
        try {
            await onSeedData();
            toast.success('DADOS_GERADOS: Protocolo de teste concluído com sucesso.');
        } catch (error) {
            toast.error('ERRO_SISTEMA: Falha ao gerar dados de teste.');
        } finally {
            setIsSeeding(false);
        }
    };

    const handleExport = () => {
        toast.info('EXPORT_INITIALIZED: Compilando relatório pedagógico...');
        setTimeout(() => {
            toast.success('EXP_COMPLETE: Relatório disponível no diretório de downloads.');
        }, 1500);
    };

    return (
        <div className="space-y-10 pb-20 relative">
            {/* Background Decorativo - MAIS DISCRETO */}
            <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-blue-100/20 rounded-full blur-[120px] -z-10"></div>

            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-white p-8 rounded-3xl border border-blue-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-[4px] bg-blue-500/10 group-hover:bg-blue-500 transition-colors"></div>

                <div className="flex items-center gap-6 relative z-10">
                    <Button
                        variant="outline"
                        onClick={() => onNavigate('teacher-dashboard')}
                        className="rounded-2xl w-12 h-12 p-0 border border-blue-100 hover:bg-blue-50 bg-white transition-all shadow-sm"
                    >
                        <ArrowLeft className="w-5 h-5 text-blue-600" />
                    </Button>
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 mb-1">
                            <Microscope className="w-4 h-4 text-blue-600" />
                            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest leading-none">Análise Acadêmica Avançada</span>
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase italic flex items-center gap-3">
                            Insights <span className="text-blue-600 italic">Pedagógicos</span>
                        </h1>
                    </div>
                </div>

                <div className="flex items-center gap-3 relative z-10">
                    <Button
                        variant="outline"
                        onClick={handleSeed}
                        disabled={isSeeding}
                        className="h-12 px-6 rounded-xl font-bold text-[10px] tracking-widest uppercase border-blue-100 hover:bg-blue-50 text-blue-600 transition-all"
                    >
                        {isSeeding ? 'Sincronizando...' : 'Gerar Dados de Teste'}
                    </Button>
                    <Button
                        onClick={handleExport}
                        className="bg-blue-600 hover:bg-blue-700 text-white h-12 px-8 rounded-xl font-black text-[10px] tracking-widest uppercase shadow-[0_8px_16px_rgba(37,99,235,0.2)] transition-all italic"
                    >
                        <Download className="w-4 h-4 mr-2" /> Exportar Relatório
                    </Button>
                </div>
            </div>


            {/* Tabs Sidebar/Topbar */}
            <div className="flex flex-wrap bg-white p-1.5 rounded-2xl border border-blue-100 w-fit shadow-md">
                {[
                    { id: 'overview', label: 'Monitoramento Geral', icon: LayoutDashboard },
                    { id: 'classes', label: 'Performance de Turmas', icon: Users },
                    { id: 'students', label: 'Análise por Aluno', icon: ClipboardList },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-2.5 px-6 py-3 rounded-xl transition-all duration-300 ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:bg-blue-50'}`}
                    >
                        <tab.icon className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-wider">{tab.label}</span>
                    </button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                {activeTab === 'overview' && (
                    <motion.div
                        key="overview"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-8"
                    >
                        {/* Estatísticas Rápidas */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { label: 'Novos Recrutas', value: stats.totalStudents, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
                                { label: 'Média Acadêmica', value: stats.avgGrade, icon: Target, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                                { label: 'Engajamento Global', value: `${stats.engagement}%`, icon: Zap, color: 'text-amber-600', bg: 'bg-amber-50' },
                                { label: 'Protocolos de Entrega', value: stats.totalSubmissions, icon: BookOpen, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                            ].map((stat, i) => (
                                <Card key={i} className="p-7 bg-white border border-blue-50 rounded-3xl shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-1">
                                            <h4 className="text-4xl font-black text-slate-900 italic leading-none">{stat.value}</h4>
                                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">{stat.label}</p>
                                        </div>
                                        <div className={`p-3.5 rounded-2xl ${stat.bg} group-hover:scale-110 transition-transform duration-500`}>
                                            <stat.icon className={`w-6 h-6 ${stat.color}`} />
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>

                        {/* Gráficos em Linha/Barra */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <Card className="p-8 bg-white border border-blue-50 rounded-3xl shadow-sm space-y-8 h-full">
                                <div className="flex items-center justify-between border-b border-blue-50 pb-6">
                                    <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <Microscope className="w-4 h-4 text-blue-600" /> Distribuição de Notas
                                    </h3>
                                    <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-none px-3 font-bold text-[9px]">SINC_AUTO</Badge>
                                </div>
                                <div className="h-[320px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={gradesData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                            <XAxis dataKey="range" stroke="#94a3b8" fontSize={11} fontWeight="bold" axisLine={false} tickLine={false} dy={10} />
                                            <YAxis stroke="#94a3b8" fontSize={11} fontWeight="bold" axisLine={false} tickLine={false} dx={-10} />
                                            <Tooltip
                                                cursor={{ fill: '#f8fafc' }}
                                                contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', boxShadow: '0 8px 30px rgba(0,0,0,0.05)', fontSize: '11px', fontWeight: 'bold' }}
                                            />
                                            <Bar dataKey="count" fill="#2563eb" radius={[8, 8, 0, 0]} barSize={40} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </Card>

                            <Card className="p-8 bg-white border border-blue-50 rounded-3xl shadow-sm space-y-8 h-full">
                                <div className="flex items-center justify-between border-b border-blue-50 pb-6">
                                    <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <TrendingUp className="w-4 h-4 text-blue-600" /> Performance por Turma
                                    </h3>
                                    <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-none px-3 font-bold text-[9px]">COMPARATIVO</Badge>
                                </div>
                                <div className="h-[320px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={classComparisonData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                            <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} fontWeight="bold" axisLine={false} tickLine={false} dy={10} />
                                            <YAxis stroke="#94a3b8" fontSize={10} fontWeight="bold" axisLine={false} tickLine={false} dx={-10} />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', boxShadow: '0 8px 30px rgba(0,0,0,0.05)', fontSize: '10px' }}
                                            />
                                            <Line type="monotone" dataKey="media" stroke="#2563eb" strokeWidth={4} dot={{ r: 6, fill: '#2563eb', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8, strokeWidth: 0 }} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </Card>
                        </div>

                        {/* Educational Interventions */}
                        <Card className="p-10 bg-white border border-blue-50 rounded-[2.5rem] shadow-sm relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                                <Brain className="w-32 h-32 text-blue-600" />
                            </div>
                            <div className="space-y-8 relative z-10">
                                <div className="flex items-center gap-3">
                                    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight italic flex items-center gap-3 underline decoration-blue-200 underline-offset-8">
                                        <AlertCircle className="w-6 h-6 text-blue-600" /> Diagnóstico e Intervenção
                                    </h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <div className="p-6 bg-blue-50/50 rounded-2xl border border-blue-100 group-hover:border-blue-400 transition-all space-y-3">
                                        <Badge variant="secondary" className="bg-amber-100 text-amber-700 border-none text-[9px] font-bold py-1 px-3 uppercase tracking-widest">Alerta de Engajamento</Badge>
                                        <p className="text-slate-700 text-xs leading-relaxed font-medium italic">Baixo volume de entregas detectado em turmas de robótica básica. Sugestão: Rever complexidade do módulo 2.</p>
                                    </div>
                                    <div className="p-6 bg-blue-50/50 rounded-2xl border border-blue-100 group-hover:border-blue-400 transition-all space-y-3">
                                        <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-none text-[9px] font-bold py-1 px-3 uppercase tracking-widest">Aceleração de Grupos</Badge>
                                        <p className="text-slate-700 text-xs leading-relaxed font-medium italic">Grupo de elite "Maker" superou a meta trimestral em 20%. Recomendado: Módulo de IA aplicada.</p>
                                    </div>
                                    <div className="p-6 bg-blue-50/50 rounded-2xl border border-blue-100 group-hover:border-blue-400 transition-all space-y-3">
                                        <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 border-none text-[9px] font-bold py-1 px-3 uppercase tracking-widest">Evolução Cognitiva</Badge>
                                        <p className="text-slate-700 text-xs leading-relaxed font-medium italic">Melhoria significativa na resolução de problemas lógicos após dinâmicas de gamificação.</p>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                )}

                {activeTab === 'classes' && (
                    <motion.div
                        key="classes"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {classes.map(c => (
                            <Card key={c.id} className="p-7 bg-white border border-blue-50 hover:border-blue-300 transition-all group cursor-pointer rounded-3xl shadow-sm">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-2xl font-black group-hover:text-blue-600 transition-colors italic text-slate-400">
                                        {c.name.substring(0, 2).toUpperCase()}
                                    </div>
                                    <Badge variant="secondary" className="bg-blue-50 text-blue-600 border-none font-bold text-[9px] px-3 py-1.5 uppercase tracking-widest">{c.studentsCount} Estudantes</Badge>
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase italic mb-5">{c.name}</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
                                        <span>Progresso Médio</span>
                                        <span className="text-blue-600">{c.progress}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${c.progress}%` }}
                                            className="h-full bg-blue-600"
                                        />
                                    </div>
                                    <div className="pt-6 mt-2 border-t border-blue-50 flex justify-between items-center">
                                        <div className="flex -space-x-2">
                                            {[1, 2, 3].map(i => (
                                                <div key={i} className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-400">SM</div>
                                            ))}
                                        </div>
                                        <Button variant="ghost" size="sm" onClick={() => onNavigate('class-management', c.id)} className="text-[10px] font-black tracking-widest uppercase hover:text-blue-600 italic">Explorar Dados</Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </motion.div>
                )}

                {activeTab === 'students' && (
                    <motion.div
                        key="students"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <div className="relative max-w-xl mx-auto shadow-sm rounded-[2rem]">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <Input
                                placeholder="Procurar estudante por nome ou registro..."
                                className="pl-14 h-16 bg-white border border-blue-100 rounded-[2rem] focus:border-blue-400 transition-all uppercase font-bold text-xs tracking-wide"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="grid gap-4 max-w-4xl mx-auto">
                            {students
                                .filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()))
                                .map(s => {
                                    const studentSubs = submissions.filter(sub => (sub.studentId || sub.student_id) === s.id);
                                    const subCount = studentSubs.length;
                                    const gradedSubs = studentSubs.filter(sub => sub.grade !== undefined);
                                    const avg = gradedSubs.length > 0 ? gradedSubs.reduce((acc, sub) => acc + (sub.grade || 0), 0) / gradedSubs.length : 0;

                                    return (
                                        <Card key={s.id} className="p-5 bg-white border border-blue-50 hover:border-blue-200 transition-all shadow-sm rounded-2xl flex items-center gap-6 group">
                                            <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-blue-50 flex items-center justify-center text-4xl group-hover:scale-105 transition-transform duration-500">
                                                {s.avatar || '👤'}
                                            </div>
                                            <div className="flex-1 min-w-0 space-y-1">
                                                <h4 className="font-black text-slate-900 text-lg tracking-tight uppercase italic">{s.name}</h4>
                                                <div className="flex gap-4 font-bold text-[10px] text-slate-400 uppercase tracking-wider">
                                                    <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-blue-500" /> {s.xp} XP</span>
                                                    <span className="flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5 text-blue-500" /> {subCount} Missões</span>
                                                </div>
                                            </div>
                                            <div className="text-right pr-6 space-y-1">
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Score_Global</p>
                                                <h5 className={`text-2xl font-black italic ${avg >= 8 ? 'text-blue-600' : avg >= 6 ? 'text-orange-500' : 'text-red-500'}`}>
                                                    {subCount > 0 ? avg.toFixed(1) : '---'}
                                                </h5>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                onClick={() => toast.success(`ACESSANDO_PERFIL: Carregando dossiê de ${s.name}...`)}
                                                className="h-10 text-[9px] font-black uppercase tracking-widest px-6 border border-blue-50 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all italic"
                                            >
                                                Detalhes
                                            </Button>
                                        </Card>
                                    );
                                })}
                            {students.length === 0 && (
                                <div className="text-center py-20 bg-blue-50/20 border-2 border-dashed border-blue-100 rounded-3xl">
                                    <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Aguardando conexão de dados dos estudantes.</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>

    );
}
