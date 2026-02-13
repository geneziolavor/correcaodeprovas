import { Users, CheckSquare, TrendingUp, BookOpen, BarChart3, Calendar, Plus, Sparkles, LogOut, Wand2, ShieldCheck, Activity as ActivityIcon, Download, Search, LayoutDashboard, Pencil, Trash2, ChevronRight, Zap } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Class, Activity } from '../../types';
import { toast } from 'sonner';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";

interface TeacherDashboardProps {
  onNavigate: (screen: string, id?: string) => void;
  classes: Class[];
  activities: Activity[];
  onAddActivity: (activity: any) => void;
  onDeleteActivity: (id: string) => Promise<boolean>;
}

export function TeacherDashboard({ onNavigate, classes, activities, onAddActivity, onDeleteActivity }: TeacherDashboardProps) {
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [activityToDelete, setActivityToDelete] = useState<string | null>(null);

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

  // ... (rest of state and handlers)

  // (Keeping existing handleCreateActivity and handleGenerateAI)
  const [newActivity, setNewActivity] = useState({
    title: '',
    description: '',
    points: 100,
    deadline: '',
    discipline: 'Tecnologia',
    questions: [] as any[]
  });

  const totalStudents = classes.reduce((acc, c) => acc + c.studentsCount, 0);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const handleCreateActivity = () => {
    if (!newActivity.title || !newActivity.deadline) {
      toast.error('Preencha os campos obrigatórios');
      return;
    }

    const activityData = {
      ...newActivity,
      icon: newActivity.questions?.length > 0 ? '🤖' : '📝',
      color: newActivity.questions?.length > 0 ? 'from-cyan-400 to-blue-600' : 'from-blue-400 to-indigo-500'
    };

    onAddActivity(activityData);
    toast.success('Atividade lançada!', {
      description: `A atividade "${activityData.title}" foi enviada para o servidor.`
    });
    setIsActivityModalOpen(false);
    setNewActivity({ title: '', description: '', points: 100, deadline: '', discipline: 'Tecnologia', questions: [] });
  };

  const handleGenerateAI = () => {
    const topic = newActivity.title || "Tecnologia";
    toast.info(`IA Analisando tema: "${topic}"...`, { icon: '🤖' });

    setTimeout(() => {
      const question = {
        id: Date.now(),
        prompt: `Questão gerada por IA sobre ${topic}: Qual o principal conceito envolvido?`,
        options: ["Inovação", "Criatividade", "Lógica", "Design"],
        answer: "Lógica"
      };
      setNewActivity(prev => ({
        ...prev,
        questions: [...prev.questions, question]
      }));
      toast.success('Questão gerada com sucesso!');
    }, 1500);
  };

  // ... Header remains the same ...
  // Skipping common lines to target the missions section

  // (Inserting the confirmation dialog before closing the return statement)


  return (
    <div className="space-y-10 pb-20 relative px-4">
      {/* Background Decorativo */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

      {/* Header Superior - Central de Comando Profissional */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 bg-white p-10 rounded-[2.5rem] border border-border shadow-xl relative overflow-hidden group"
      >
        <div className="absolute top-0 left-0 w-full h-1.5 bg-primary/20 group-hover:bg-primary transition-all duration-500"></div>

        <div className="space-y-4 relative z-10 w-full lg:w-auto">
          <div className="flex flex-wrap items-center gap-3">
            <Badge className="bg-primary/5 text-primary border-primary/20 px-4 py-1.5 font-black tracking-widest text-[9px] uppercase italic">
              <ShieldCheck className="w-3.5 h-3.5 mr-2" /> CORE_OPERACIONAL_V2
            </Badge>
            <Badge variant="secondary" className="bg-muted text-muted-foreground border-border px-4 py-1.5 font-black tracking-widest text-[9px] uppercase italic">
              <Sparkles className="w-3.5 h-3.5 mr-2" /> Inteligência Cognitiva Sincronizada
            </Badge>
          </div>
          <div className="space-y-1">
            <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-foreground uppercase leading-none italic">
              Painel de <span className="text-primary italic">Controle</span>
            </h1>
            <p className="text-muted-foreground font-bold uppercase tracking-[0.2em] text-[10px] mt-2">
              Gestão de Trilhas de Inovação e Tecnologia Educacional
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto relative z-10">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
            <Button
              onClick={() => onNavigate('mission-management')}
              className="h-16 px-10 bg-primary hover:bg-primary/90 text-white font-black rounded-2xl shadow-2xl shadow-primary/20 transition-all group w-full sm:w-auto text-[10px] tracking-widest uppercase italic"
            >
              <Plus className="w-5 h-5 mr-3 group-hover:rotate-90 transition-transform" />
              Lançar Nova Missão
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Estatísticas de Performance */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {[
          { label: 'Recrutas Ativos', value: totalStudents, sub: 'Engajamento Global', icon: Users, color: 'text-primary' },
          { label: 'Validação_Data', value: '12', sub: 'Submissões em Espera', icon: CheckSquare, color: 'text-orange-500' },
          { label: 'Eficácia de Fluxo', value: '66.8%', sub: 'Taxa de Sincronia', icon: TrendingUp, color: 'text-emerald-500' },
          { label: 'Clusters Ativos', value: classes.length, sub: 'Nós de Transmissão', icon: BookOpen, color: 'text-primary' },
        ].map((stat, i) => (
          <motion.div key={i} variants={itemVariants}>
            <Card className="p-7 bg-white border border-border hover:border-primary/40 transition-all duration-300 rounded-[2rem] shadow-sm hover:shadow-xl group relative overflow-hidden">
              <div className="flex justify-between items-start mb-5">
                <div className="p-3.5 rounded-2xl bg-muted border border-border group-hover:bg-primary/5 group-hover:border-primary/20 transition-all">
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-4xl font-black text-foreground tracking-tighter italic">{stat.value}</h3>
                <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">{stat.label}</p>
                <p className="text-[9px] font-black text-primary uppercase tracking-widest mt-1 opacity-60">{stat.sub}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Grid de Conteúdo Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-10">
          {/* Turmas do Mentor */}
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-border pb-4 ml-1">
              <h2 className="text-2xl font-black text-foreground flex items-center gap-4 tracking-tight uppercase italic">
                <LayoutDashboard className="w-6 h-6 text-primary" /> Clusters de <span className="text-primary italic">Aprendizado</span>
              </h2>
              <Button
                variant="ghost"
                onClick={() => onNavigate('class-management')}
                className="text-primary hover:bg-primary/5 text-[10px] font-black uppercase tracking-widest italic"
              >
                Gerenciar Tudo <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {classes.map((c) => (
                <motion.div key={c.id} whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                  <Card
                    onClick={() => onNavigate('class-management', c.id)}
                    className="p-7 bg-white border border-border hover:border-primary/30 transition-all cursor-pointer rounded-[2rem] shadow-sm hover:shadow-lg group relative overflow-hidden"
                  >
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 rounded-[1.25rem] bg-muted border border-border flex items-center justify-center text-2xl font-black text-primary italic transition-all group-hover:scale-110">
                        {c.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0 space-y-1">
                        <h4 className="font-black text-foreground text-lg truncate uppercase tracking-tight italic">{c.name}</h4>
                        <div className="flex items-center gap-2.5">
                          <Users className="w-3.5 h-3.5 text-muted-foreground/60" />
                          <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">{c.studentsCount} Estudantes Sincronizados</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 space-y-2">
                      <div className="flex justify-between text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                        <span>Status de Evolução</span>
                        <span className="text-primary">{c.progress}%</span>
                      </div>
                      <div className="h-2 w-full bg-muted rounded-full overflow-hidden border border-border p-0.5">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${c.progress}%` }}
                          className="h-full bg-primary rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                        />
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Atividades e Missões */}
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-border pb-4 ml-1">
              <h2 className="text-2xl font-black text-foreground flex items-center gap-4 tracking-tight uppercase italic">
                <ActivityIcon className="w-6 h-6 text-primary" /> Protocolos de <span className="text-primary italic">Missão</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activities.length === 0 ? (
                <div className="col-span-full py-20 text-center border-2 border-dashed border-border rounded-[2.5rem] bg-muted/20">
                  <p className="text-muted-foreground font-black uppercase text-[10px] tracking-[0.2em] italic">Aguardando implantação de novos protocolos.</p>
                </div>
              ) : (
                activities.map((act) => {
                  const targetClass = classes.find(c => c.id === (act as any).class_id || c.id === (act as any).classId);
                  return (
                    <motion.div key={act.id} whileHover={{ scale: 1.01 }}>
                      <Card className="p-6 bg-white border border-border hover:border-primary/40 transition-all rounded-[2rem] shadow-sm hover:shadow-lg group relative overflow-hidden">
                        <div className="flex items-center gap-5 relative z-10">
                          <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center text-3xl border border-border group-hover:bg-primary/5 transition-all">
                            {act.icon || '🎯'}
                          </div>
                          <div className="flex-1 min-w-0 space-y-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-black text-foreground text-base truncate uppercase tracking-tight italic">{act.title}</h4>
                              <Badge className="bg-primary/5 text-primary border-none text-[8px] px-2 py-0.5 uppercase font-black italic">
                                {(act as any).type || 'Missão'}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5 text-primary/60" />
                                <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">{act.deadline || 'Sem prazo'}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Users className="w-3.5 h-3.5 text-orange-500/60" />
                                <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest truncate max-w-[120px]">
                                  {targetClass?.name || 'Global'}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right flex flex-col items-end gap-2">
                            <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/20 font-black text-[9px] px-3 py-1 uppercase tracking-widest italic">
                              {act.points} XP
                            </Badge>
                          </div>
                        </div>

                        {/* Ações da Missão */}
                        <div className="mt-6 pt-4 border-t border-border flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onNavigate('activity-edit', act.id)}
                              className="h-9 px-4 rounded-xl text-[9px] font-black uppercase tracking-tighter italic hover:bg-primary/5 hover:text-primary transition-all border border-transparent hover:border-primary/20"
                            >
                              <Pencil className="w-3.5 h-3.5 mr-2" /> Editar
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onNavigate('activity-edit', act.id)} // View can be same as edit or a preview
                              className="h-9 px-4 rounded-xl text-[9px] font-black uppercase tracking-tighter italic hover:bg-primary/5 hover:text-primary transition-all border border-transparent hover:border-primary/20"
                            >
                              <Search className="w-3.5 h-3.5 mr-2" /> Visualizar
                            </Button>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setActivityToDelete(act.id);
                              setIsDeleteDialogOpen(true);
                            }}
                            className="h-9 px-4 rounded-xl text-[9px] font-black uppercase tracking-tighter italic text-red-500 hover:bg-red-50 hover:text-red-600 transition-all border border-transparent hover:border-red-100"
                          >
                            <Trash2 className="w-3.5 h-3.5 mr-2" /> Excluir
                          </Button>
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
          </section>
        </div>

        {/* Coluna Lateral - Atalhos e Relatórios Médios */}
        <div className="lg:col-span-4 space-y-10">
          <section className="space-y-8">
            <h2 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] border-b border-border pb-3 ml-1 italic">Conexões_Sinc</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Minhas Turmas', icon: Users, screen: 'class-management', color: 'text-primary' },
                { label: 'Scanner de OCR', icon: Sparkles, screen: 'ocr-scanner', color: 'text-cyan-500' },
                { label: 'Validar Entregas', icon: CheckSquare, screen: 'submissions-list', color: 'text-orange-500' },
                { label: 'Relatórios Pro', icon: BarChart3, screen: 'reports', color: 'text-primary' },
                { label: 'Agenda Global', icon: Calendar, screen: 'calendar', color: 'text-primary' },
              ].map((item, i) => (
                <Card
                  key={i}
                  onClick={() => onNavigate(item.screen)}
                  className="p-6 bg-white border border-border hover:border-primary/40 transition-all cursor-pointer text-center space-y-4 rounded-2xl shadow-sm hover:shadow-md group"
                >
                  <div className="w-12 h-12 rounded-xl bg-muted border border-border flex items-center justify-center mx-auto group-hover:bg-primary transition-all">
                    <item.icon className={`w-6 h-6 ${item.color} group-hover:text-white transition-all`} />
                  </div>
                  <p className="text-[10px] font-black text-foreground uppercase tracking-widest italic leading-tight">{item.label}</p>
                </Card>
              ))}
            </div>
          </section>

          <Card className="p-10 rounded-[2.5rem] bg-primary text-white shadow-2xl shadow-primary/30 relative overflow-hidden group">
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-[80px] group-hover:scale-150 transition-transform duration-1000"></div>

            <div className="relative z-10 space-y-6">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-lg">
                <Zap className="w-7 h-7 text-white animate-pulse" />
              </div>
              <div className="space-y-2">
                <h4 className="font-black uppercase text-xl italic tracking-tight leading-none">Status Alpha: Ativo</h4>
                <p className="text-white/80 text-[10px] font-bold uppercase tracking-[0.2em] pr-4">Sincronização neural com o banco de talentos operacional.</p>
              </div>
              <Button variant="outline" className="w-full bg-white/10 border-white/20 hover:bg-white/20 text-white font-black text-[10px] h-12 uppercase tracking-[0.2em] rounded-xl italic transition-all shadow-inner">
                Explorar Logs do Sistema
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
