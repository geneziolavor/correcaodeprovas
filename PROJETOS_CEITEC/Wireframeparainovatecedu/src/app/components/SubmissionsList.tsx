import { ArrowLeft, User, Calendar, CheckCircle, Clock, Trash2, ShieldCheck, Terminal, Search, ClipboardList } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Activity, EnrolledStudent } from '../../types';
import { toast } from 'sonner';
import { motion } from 'motion/react';

interface SubmissionsListProps {
    onNavigate: (screen: string, id?: string) => void;
    submissions: any[];
    activities: Activity[];
    students: EnrolledStudent[];
    onDeleteSubmission?: (id: string) => Promise<boolean>;
}

export function SubmissionsList({ onNavigate, submissions, activities, students, onDeleteSubmission }: SubmissionsListProps) {
    const getStudent = (id: string) => students.find(s => String(s.id) === String(id));
    const getActivity = (id: string) => activities.find(a => String(a.id) === String(id));

    const pendingSubmissions = submissions.filter(s => s.status === 'pending' || s.status === 'delivered');
    const gradedSubmissions = submissions.filter(s => s.status === 'graded');

    return (
        <div className="space-y-10 pb-20 relative px-4">
            {/* Background Decorativo */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px] -z-10"></div>

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-border pb-8">
                <div className="flex items-center gap-6">
                    <Button
                        variant="ghost"
                        onClick={() => onNavigate('teacher-dashboard')}
                        className="rounded-2xl w-12 h-12 p-0 border border-border hover:bg-muted bg-white shadow-sm"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 mb-1">
                            <Terminal className="w-4 h-4 text-primary" />
                            <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Painel de Entregas</span>
                        </div>
                        <h1 className="text-4xl font-black text-foreground tracking-tight uppercase italic flex items-center gap-3">
                            Correções <span className="text-primary italic">Pendentes</span>
                        </h1>
                    </div>
                </div>

                <Badge className="bg-primary/5 text-primary border-primary/20 px-5 h-10 rounded-xl flex items-center gap-3 font-bold text-[10px] uppercase tracking-widest">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                    {pendingSubmissions.length} Aguardando Análise
                </Badge>
            </div>

            <div className="space-y-4">
                {pendingSubmissions.length === 0 ? (
                    <Card className="p-20 bg-muted/20 border-2 border-dashed border-border text-center space-y-4 rounded-3xl">
                        <ShieldCheck className="w-16 h-16 text-muted-foreground/20 mx-auto" />
                        <h3 className="text-xl font-bold text-muted-foreground uppercase tracking-tight italic">Tudo em Dia</h3>
                        <p className="text-muted-foreground/60 text-[10px] font-bold uppercase tracking-widest">Nenhuma atividade pendente de correção no core.</p>
                    </Card>
                ) : (
                    pendingSubmissions.map((submission) => {
                        const student = getStudent(submission.student_id);
                        const activity = getActivity(submission.activity_id);

                        return (
                            <motion.div
                                key={submission.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <Card
                                    onClick={() => onNavigate('grading', submission.id)}
                                    className="p-6 bg-white border border-border hover:border-primary/40 shadow-sm hover:shadow-lg transition-all cursor-pointer rounded-2xl group relative overflow-hidden"
                                >
                                    <div className="absolute top-0 left-0 w-1.5 h-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                    <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                                        <div className="flex items-center gap-6 flex-1 min-w-0">
                                            <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center text-3xl border border-border group-hover:bg-primary/5 transition-colors shadow-inner">
                                                {student?.avatar || '👤'}
                                            </div>
                                            <div className="text-center lg:text-left min-w-0 space-y-1">
                                                <h3 className="text-xl font-black text-foreground tracking-tight uppercase italic">{student?.name || 'Estudante'}</h3>
                                                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-5 font-bold text-[9px] uppercase tracking-widest text-muted-foreground">
                                                    <p className="flex items-center gap-1.5 text-primary">
                                                        <ClipboardList className="w-3.5 h-3.5 text-primary/60" /> {activity?.title || 'Atividade'}
                                                    </p>
                                                    <p className="flex items-center gap-1.5">
                                                        <Calendar className="w-3.5 h-3.5 text-muted-foreground/50" /> {submission.submitted_at || submission.submittedAt ? new Date(submission.submitted_at || submission.submittedAt).toLocaleDateString('pt-BR') : 'Data não informada'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-6">
                                            <div className="text-center lg:text-right space-y-2">
                                                <Badge variant="secondary" className="bg-amber-50 text-amber-600 border border-amber-100 font-black text-[9px] uppercase tracking-widest px-4 py-1.5 rounded-lg flex items-center gap-2">
                                                    <Clock className="w-3 h-3" /> Pendente
                                                </Badge>
                                                <p className="text-primary text-[9px] font-black uppercase tracking-widest group-hover:translate-x-1 transition-transform italic opacity-0 group-hover:opacity-100">Avaliar Agora →</p>
                                            </div>

                                            <div className="border-l border-border pl-6 flex items-center">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={async (e) => {
                                                        e.stopPropagation();
                                                        if (window.confirm('Deseja excluir permanentemente este registro?')) {
                                                            if (onDeleteSubmission) {
                                                                const success = await onDeleteSubmission(submission.id);
                                                                if (success) toast.success('Entrega removida.');
                                                            }
                                                        }
                                                    }}
                                                    className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded-xl border border-border transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        );
                    })
                )}

                {gradedSubmissions.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-12 space-y-6"
                    >
                        <div className="flex items-center gap-3 ml-1 mb-2">
                            <CheckCircle className="w-5 h-5 text-emerald-500" />
                            <h2 className="text-xl font-black text-foreground uppercase tracking-tight italic">Registros Corrigidos</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {gradedSubmissions.slice(0, 6).map((submission) => {
                                const student = getStudent(submission.student_id);
                                const activity = getActivity(submission.activity_id);

                                return (
                                    <Card
                                        key={submission.id}
                                        className="p-4 bg-white border border-border opacity-70 hover:opacity-100 transition-all rounded-2xl group shadow-sm hover:shadow-md"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4 min-w-0">
                                                <span className="text-3xl group-hover:scale-110 transition-transform duration-300">{student?.avatar || '👤'}</span>
                                                <div className="min-w-0 space-y-0.5">
                                                    <p className="text-[11px] font-black text-foreground uppercase truncate italic">{student?.name}</p>
                                                    <p className="text-[9px] font-bold text-muted-foreground uppercase truncate tracking-tight">{activity?.title}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-2xl font-black text-emerald-600 tracking-tight italic leading-none">{submission.grade}</div>
                                                <p className="text-[8px] text-muted-foreground font-black uppercase mt-1 tracking-widest">Score</p>
                                            </div>
                                        </div>
                                    </Card>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
