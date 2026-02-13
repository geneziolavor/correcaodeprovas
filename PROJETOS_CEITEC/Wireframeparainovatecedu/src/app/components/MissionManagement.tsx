import { useState } from 'react';
import {
    Plus, Search, Pencil, Trash2, Send, ArrowLeft,
    Calendar, Users, Filter, Layout, Sparkles,
    Wand2, Target, Zap, Clock, ShieldCheck
} from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "./ui/dialog";
import { Class, Activity } from '../../types';

interface MissionManagementProps {
    onNavigate: (screen: string, id?: string) => void;
    classes: Class[];
    activities: Activity[];
    onDeleteActivity: (id: string) => Promise<boolean>;
    onUpdateActivity: (id: string, act: any) => Promise<boolean>;
}

export function MissionManagement({
    onNavigate,
    classes,
    activities,
    onDeleteActivity,
    onUpdateActivity
}: MissionManagementProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [activityToDelete, setActivityToDelete] = useState<string | null>(null);
    const [isPublishing, setIsPublishing] = useState<string | null>(null);

    const filteredMissions = activities.filter(act =>
        act.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        act.discipline.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const confirmDelete = async () => {
        if (activityToDelete) {
            const success = await onDeleteActivity(activityToDelete);
            if (success) {
                toast.success('Missão removida com sucesso');
            }
            setIsDeleteDialogOpen(false);
            setActivityToDelete(null);
        }
    };

    const handlePublish = async (act: Activity) => {
        setIsPublishing(act.id);
        const updated = {
            ...act,
            status: 'published',
            color: 'from-blue-600 to-indigo-700'
        };

        const success = await onUpdateActivity(act.id, updated);
        if (success) {
            toast.success('Missão disponibilizada!', {
                description: `A missão "${act.title}" agora está visível para a turma.`
            });
        }
        setIsPublishing(null);
    };

    return (
        <div className="space-y-10 pb-20 relative px-4">
            {/* Background Decorativo */}
            <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

            {/* Header Profissional */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 bg-white p-10 rounded-[2.5rem] border border-border shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-primary/20 group-hover:bg-primary transition-all duration-500"></div>

                <div className="flex items-center gap-6">
                    <Button
                        variant="ghost"
                        onClick={() => onNavigate('teacher-dashboard')}
                        className="rounded-2xl w-14 h-14 p-0 border border-border hover:bg-muted bg-background shadow-sm group"
                    >
                        <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
                    </Button>

                    <div className="space-y-1">
                        <h1 className="text-4xl font-black text-foreground tracking-tight uppercase italic flex items-center gap-4">
                            Gerenciamento de <span className="text-primary italic">Missões</span>
                        </h1>
                        <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-primary" /> Laboratório de Planejamento Pedagógico // CEITEC EDU
                        </p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
                    <div className="relative w-full sm:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="PESQUISAR PROTOCOLO..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-12 h-14 bg-muted/30 border-border rounded-2xl font-black text-[10px] uppercase tracking-widest focus:bg-white transition-all"
                        />
                    </div>
                    <Button
                        onClick={() => onNavigate('activity-creator')}
                        className="h-14 px-8 bg-primary hover:bg-primary/90 text-white font-black rounded-2xl shadow-xl shadow-primary/20 transition-all flex items-center gap-3 w-full sm:w-auto text-[10px] uppercase tracking-widest italic"
                    >
                        <Plus className="w-5 h-5" /> Nova Missão
                    </Button>
                </div>
            </div>

            {/* Tabela/Grid de Missões */}
            <div className="grid grid-cols-1 gap-6">
                {filteredMissions.length === 0 ? (
                    <Card className="p-20 text-center border-2 border-dashed border-border rounded-[3rem] bg-muted/10">
                        <div className="max-w-md mx-auto space-y-6">
                            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto opacity-20">
                                <Target className="w-10 h-10" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-black uppercase italic tracking-tight">Vazio de Dados Operacionais</h3>
                                <p className="text-muted-foreground font-bold uppercase text-[10px] tracking-[0.2em] leading-relaxed">
                                    Não foram detectados protocolos de missão ativos. Inicie uma nova sequência de aprendizado.
                                </p>
                            </div>
                            <Button
                                onClick={() => onNavigate('activity-creator')}
                                variant="outline"
                                className="rounded-2xl border-primary/30 text-primary hover:bg-primary/5 h-14 px-10 font-black text-[10px] uppercase tracking-widest italic"
                            >
                                Inicializar Primeira Missão
                            </Button>
                        </div>
                    </Card>
                ) : (
                    filteredMissions.map((act) => {
                        const targetClass = classes.find(c => c.id === (act as any).class_id || c.id === (act as any).classId);
                        const isPublished = (act as any).status === 'published';

                        return (
                            <motion.div
                                key={act.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                layout
                            >
                                <Card className="p-6 bg-white border border-border hover:border-primary/40 transition-all rounded-[2.5rem] shadow-sm hover:shadow-xl group relative overflow-hidden">
                                    <div className="flex flex-col lg:flex-row items-center gap-8">
                                        <div className={`w-20 h-20 rounded-3xl flex items-center justify-center text-4xl border border-border group-hover:scale-105 transition-all shadow-inner ${isPublished ? 'bg-primary/5' : 'bg-muted'}`}>
                                            {act.icon || '🎯'}
                                        </div>

                                        <div className="flex-1 min-w-0 space-y-4 text-center lg:text-left">
                                            <div className="space-y-1">
                                                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                                                    <h4 className="font-black text-foreground text-2xl uppercase tracking-tight italic">{act.title}</h4>
                                                    <Badge className={`border-none text-[9px] px-3 py-1 uppercase font-black italic tracking-widest ${isPublished ? 'bg-emerald-500/10 text-emerald-600' : 'bg-orange-500/10 text-orange-600'}`}>
                                                        {isPublished ? 'DISPONIBILIZADA' : 'RASCUNHO'}
                                                    </Badge>
                                                    <Badge variant="outline" className="border-border text-muted-foreground text-[9px] px-3 py-1 uppercase font-bold tracking-widest">
                                                        {(act as any).type || 'Atividade'}
                                                    </Badge>
                                                </div>
                                                <p className="text-muted-foreground font-bold uppercase text-[11px] tracking-widest italic opacity-60">
                                                    {act.discipline} // {targetClass?.name || 'Vínculo Automático'}
                                                </p>
                                            </div>

                                            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6">
                                                <div className="flex items-center gap-2">
                                                    <Clock className="w-4 h-4 text-primary/60" />
                                                    <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Prazo: {act.deadline || 'Sem limite'}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Zap className="w-4 h-4 text-amber-500/60" />
                                                    <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Recompensa: {act.points} XP</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap items-center justify-center gap-3 lg:pl-8 lg:border-l border-border">
                                            {!isPublished && (
                                                <Button
                                                    onClick={() => handlePublish(act)}
                                                    disabled={isPublishing === act.id}
                                                    className="h-14 px-8 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest italic shadow-xl shadow-emerald-200 transition-all flex items-center gap-3"
                                                >
                                                    {isPublishing === act.id ? 'PROCESSANDO...' : <><Send className="w-4 h-4" /> Enviar Missão</>}
                                                </Button>
                                            )}
                                            <Button
                                                variant="ghost"
                                                onClick={() => onNavigate('activity-edit', act.id)}
                                                className="h-14 px-6 border border-border hover:bg-primary/5 hover:text-primary rounded-2xl font-black text-[10px] uppercase tracking-widest italic"
                                            >
                                                <Pencil className="w-4 h-4 mr-2" /> Editar
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                onClick={() => {
                                                    setActivityToDelete(act.id);
                                                    setIsDeleteDialogOpen(true);
                                                }}
                                                className="h-14 px-6 border border-border hover:bg-red-50 hover:text-red-600 rounded-2xl font-black text-[10px] uppercase tracking-widest italic"
                                            >
                                                <Trash2 className="w-4 h-4 mr-2" /> Excluir
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        );
                    })
                )}
            </div>

            {/* Dialog de Confirmação de Exclusão */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="bg-white border-border rounded-[2.5rem] p-10 max-w-md">
                    <DialogHeader className="space-y-4">
                        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto text-red-500 border border-red-100">
                            <Trash2 className="w-8 h-8" />
                        </div>
                        <DialogTitle className="text-2xl font-black uppercase italic tracking-tight text-center">Protocolo de Exclusão</DialogTitle>
                        <DialogDescription className="text-center text-muted-foreground font-bold uppercase text-[10px] tracking-widest leading-relaxed">
                            Você está prestes a apagar permanentemente este protocolo de missão. Esta ação não pode ser revertida. Confirmar?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex gap-4 sm:justify-center pt-6">
                        <Button
                            variant="ghost"
                            onClick={() => setIsDeleteDialogOpen(false)}
                            className="flex-1 h-14 rounded-2xl font-black text-[10px] uppercase tracking-widest italic"
                        >
                            CANCELAR_BACK
                        </Button>
                        <Button
                            onClick={confirmDelete}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white h-14 rounded-2xl font-black text-[10px] uppercase tracking-widest italic shadow-xl shadow-red-200"
                        >
                            EXCLUIR_DEFINITIVO
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
