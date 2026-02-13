import { Trophy, Star, ExternalLink, ShieldCheck, Target, BarChart3, Database, Award, ArrowLeft, Trash2, Pencil } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Activity } from '../../types';
import { motion } from 'motion/react';
import { toast } from 'sonner';

interface PortfolioProps {
  onNavigate: (screen: string) => void;
  submissions: any[];
  activities: Activity[];
  onDeleteSubmission?: (id: string) => Promise<boolean>;
}

export function Portfolio({ onNavigate, submissions, activities, onDeleteSubmission }: PortfolioProps) {
  const projects = submissions.map(sub => {
    const activity = activities.find(a => String(a.id) === String(sub.activityId || sub.activity_id));
    return {
      id: sub.id,
      title: activity?.title || 'Relatório de Atividade',
      description: sub.comments || 'Sem comentários adicionais.',
      date: sub.submittedAt ? new Date(sub.submittedAt).toLocaleDateString('pt-BR') : new Date().toLocaleDateString('pt-BR'),
      grade: sub.grade,
      status: sub.status === 'graded' ? 'approved' : 'pending',
      image: activity?.icon || '📝',
      color: activity?.color || 'from-primary to-blue-600',
      tags: activity?.discipline ? [activity.discipline.toUpperCase()] : ['GERAL']
    };
  });

  const avgGrade = submissions.length > 0
    ? (submissions.reduce((acc, sub) => acc + (sub.grade || 0), 0) / submissions.length).toFixed(1)
    : '0.0';

  return (
    <div className="space-y-10 pb-20 relative px-4">
      {/* Background Decorativo */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px] -z-10"></div>

      {/* Header Profissional */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-border pb-8">
        <div className="flex items-center gap-6">
          <Button
            variant="ghost"
            onClick={() => onNavigate('student-dashboard')}
            className="rounded-2xl w-12 h-12 p-0 border border-border hover:bg-muted bg-white shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>

          <div className="space-y-1">
            <h1 className="text-4xl font-black text-foreground tracking-tight italic uppercase">
              Meu <span className="text-primary italic">Portfólio</span>
            </h1>
            <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest">
              Conquistas e trajetória tecnológica
            </p>
          </div>
        </div>

        <div className="hidden md:flex gap-3">
          <Badge variant="secondary" className="bg-primary/5 text-primary border-none text-[9px] font-bold px-4 py-2 uppercase tracking-widest">
            Sincronizado
          </Badge>
        </div>
      </div>

      {/* Estatísticas de Performance */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Projetos Concluídos', value: projects.length, icon: ShieldCheck, color: 'text-primary', bg: 'bg-primary/5' },
          { label: 'Média de Desempenho', value: avgGrade, icon: BarChart3, color: 'text-emerald-500', bg: 'bg-emerald-50' },
          { label: 'Certificações Elite', value: projects.filter(p => p.grade && p.grade >= 9).length, icon: Award, color: 'text-amber-500', bg: 'bg-amber-50' }
        ].map((stat, i) => (
          <Card key={i} className="p-6 bg-white border border-border shadow-sm hover:shadow-md transition-shadow group rounded-2xl">
            <div className="flex items-center gap-5">
              <div className={`w-14 h-14 rounded-2xl ${stat.bg} flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}>
                <stat.icon className={`w-7 h-7 ${stat.color}`} />
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-black text-foreground italic leading-none">{stat.value}</p>
                <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">{stat.label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Lista de Registros */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 ml-1 mb-2">
          <Target className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-black text-foreground uppercase tracking-tight italic">Relatório de Conquistas</h2>
        </div>

        {projects.length === 0 ? (
          <div className="py-20 text-center border-2 border-dashed border-border rounded-[2.5rem] bg-muted/20">
            <Trophy className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground font-bold uppercase text-[10px] tracking-widest">Seu portfólio está aguardando o primeiro deploy.</p>
            <Button
              onClick={() => onNavigate('activities')}
              className="mt-6 bg-primary hover:bg-primary/90 text-white font-black px-10 rounded-xl h-12 text-[10px] tracking-widest uppercase italic shadow-lg shadow-primary/10"
            >
              Iniciar Missão Alpha
            </Button>
          </div>
        ) : (
          <div className="grid gap-4">
            {projects.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="p-6 bg-white border border-border hover:border-primary/40 transition-all shadow-sm rounded-[2rem] group relative overflow-hidden">
                  <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                    <div className="w-16 h-16 rounded-2xl bg-muted border border-border flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-500 shadow-inner">
                      {project.image}
                    </div>

                    <div className="flex-1 text-center md:text-left space-y-3">
                      <div className="flex flex-wrap justify-center md:justify-start gap-4">
                        {project.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="bg-muted text-muted-foreground border-none font-bold text-[9px] tracking-widest px-3 py-1 uppercase rounded-lg">
                            {tag}
                          </Badge>
                        ))}
                        <Badge className={`border font-bold text-[9px] tracking-widest px-3 py-1 rounded-lg uppercase ${project.status === 'approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                          {project.status === 'approved' ? 'Registrado' : 'Pendente'}
                        </Badge>
                      </div>
                      <h3 className="text-2xl font-black text-foreground tracking-tight uppercase italic group-hover:text-primary transition-colors">{project.title}</h3>
                      <p className="text-xs text-muted-foreground font-medium italic leading-relaxed">"{project.description}"</p>
                    </div>

                    <div className="flex flex-col md:flex-row items-center gap-6 pl-0 md:pl-8 border-t md:border-t-0 md:border-l border-border pt-6 md:pt-0">
                      {project.grade && (
                        <div className="text-center md:text-right min-w-[80px]">
                          <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest mb-1">Score</p>
                          <div className="text-3xl font-black text-primary italic leading-none">{project.grade}</div>
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-xl border border-border transition-all"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={async () => {
                            if (window.confirm('Deseja realmente excluir este registro?')) {
                              if (onDeleteSubmission) {
                                const success = await onDeleteSubmission(project.id);
                                if (success) toast.success('Registro removido.');
                              }
                            }
                          }}
                          className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded-xl border border-border transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
