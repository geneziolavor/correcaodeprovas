import { Circle, CheckCircle2, Clock, AlertCircle, Sparkles, Zap, ShieldCheck, Target, ExternalLink, ArrowLeft, Trophy, Flame } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { motion, AnimatePresence } from 'motion/react';
import { Activity } from '../../types';

interface ActivitiesProps {
  onNavigate: (screen: string, id?: string) => void;
  activities: Activity[];
  submissions: any[];
}

export function Activities({ onNavigate, activities, submissions }: ActivitiesProps) {
  const getRealStatus = (activityId: string) => {
    const sub = submissions.find(s => String(s.activityId || s.activity_id) === String(activityId));
    if (sub) return 'completed';
    return 'pending';
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'completed':
        return {
          icon: <CheckCircle2 className="w-3.5 h-3.5" />,
          label: 'Sincronizado',
          color: 'bg-emerald-50 text-emerald-600 border-emerald-100'
        };
      default:
        return {
          icon: <Circle className="w-3.5 h-3.5" />,
          label: 'Disponível',
          color: 'bg-primary/5 text-primary border-primary/20'
        };
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-12 pb-20 relative px-4">
      {/* Background Decorativo */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10"></div>

      {/* Header Contextual Pro */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 border-b border-border pb-10">
        <div className="flex items-center gap-8">
          <Button
            variant="ghost"
            onClick={() => onNavigate('student-dashboard')}
            className="rounded-2xl w-14 h-14 p-0 border border-border hover:bg-muted bg-white shadow-sm"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5 mb-1.5 ml-1">
              <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.6)]"></div>
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Conexão Operacional v2.5</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tighter uppercase italic">
              Hub de <span className="text-primary italic">Missões</span>
            </h1>
            <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest opacity-60">
              Módulos de aprendizado tecnológico em tempo real
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Card className="px-6 h-14 bg-white border border-border flex items-center gap-5 rounded-2xl shadow-xl">
            <div className="flex items-center gap-2.5">
              <Target className="w-5 h-5 text-primary" />
              <span className="text-sm font-black text-foreground tracking-tight uppercase italic">{activities.length} AtividadesAtivas</span>
            </div>
            <div className="h-5 w-[1px] bg-border"></div>
            <Flame className="w-5 h-5 text-orange-500 animate-bounce" />
          </Card>
        </div>
      </div>

      {/* Grid de Atividades com Modern Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {activities.length === 0 ? (
          <div className="col-span-full py-24 text-center border-2 border-dashed border-border rounded-[3rem] bg-muted/20">
            <ShieldCheck className="w-20 h-20 text-muted-foreground/20 mx-auto mb-6" />
            <h3 className="text-2xl font-black text-muted-foreground uppercase tracking-tight italic">Nenhuma Missão Identificada</h3>
            <p className="text-muted-foreground/60 text-[10px] mt-2 uppercase font-black tracking-widest leading-relaxed">Aguardando telemetria de novos protocolos pedagógicos.</p>
          </div>
        ) : (
          activities.map((activity) => {
            const status = getRealStatus(activity.id);
            const statusInfo = getStatusInfo(status);
            const isCompleted = status === 'completed';

            return (
              <motion.div
                key={activity.id}
                variants={itemVariants}
                className="h-full"
              >
                <Card
                  onClick={() => !isCompleted && onNavigate('submit-activity', activity.id)}
                  className="flex flex-col h-full bg-white border border-border hover:border-primary/40 shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer rounded-[2.5rem] overflow-hidden group relative"
                >
                  <div className={`h-2 w-full ${isCompleted ? 'bg-emerald-500' : 'bg-primary'} opacity-20 group-hover:opacity-100 transition-opacity`}></div>

                  <div className="p-8 flex-1 space-y-6">
                    <div className="flex justify-between items-start">
                      <div className="w-16 h-16 rounded-[1.25rem] bg-muted border border-border flex items-center justify-center text-4xl group-hover:rotate-6 group-hover:scale-110 transition-all duration-500 shadow-inner">
                        {activity.icon || '🎯'}
                      </div>
                      <Badge className={`px-4 py-1.5 rounded-xl ${statusInfo.color} border font-black text-[9px] uppercase tracking-widest italic`}>
                        {statusInfo.icon} <span className="ml-2">{statusInfo.label}</span>
                      </Badge>
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-2xl font-black text-foreground tracking-tight uppercase italic group-hover:text-primary transition-colors leading-none">
                        {activity.title}
                      </h3>
                      <p className="text-xs text-muted-foreground font-medium italic leading-relaxed line-clamp-2 opacity-80">
                        {activity.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-3 pt-2">
                      <Badge variant="secondary" className="bg-primary/5 text-primary border-none text-[9px] font-black py-2 px-4 flex items-center gap-2 rounded-xl italic">
                        <Zap className="w-3.5 h-3.5 text-primary/40 group-hover:text-primary transition-colors" />
                        {activity.points} XP
                      </Badge>
                      <Badge variant="secondary" className="bg-muted/50 text-muted-foreground border-none text-[9px] font-black py-2 px-4 flex items-center gap-2 rounded-xl italic">
                        <Clock className="w-3.5 h-3.5 opacity-40" />
                        {activity.deadline}
                      </Badge>
                    </div>
                  </div>

                  <div className={`p-5 border-t border-border flex items-center justify-center font-black uppercase tracking-widest text-[10px] italic transition-all duration-500 ${isCompleted ? 'bg-emerald-50 text-emerald-600' : 'bg-muted/30 group-hover:bg-primary group-hover:text-white group-hover:gap-4'}`}>
                    {isCompleted ? (
                      <div className="flex items-center gap-3">
                        <Trophy className="w-4 h-4" /> Pontuação Sincronizada
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        Acessar Protocolo <ExternalLink className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            );
          })
        )}
      </motion.div>

      {/* Footer Banner */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <Card
          className="p-10 rounded-[3rem] bg-primary text-white border-none shadow-2xl shadow-primary/30 cursor-pointer group relative overflow-hidden text-center md:text-left"
          onClick={() => {
            const firstPending = activities.find(a => getRealStatus(a.id) === 'pending');
            onNavigate('submit-activity', firstPending?.id || activities[0]?.id);
          }}
        >
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/10 rounded-full blur-[100px] group-hover:scale-125 transition-transform duration-1000"></div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-20 h-20 rounded-[1.5rem] bg-white/20 backdrop-blur-md flex items-center justify-center shadow-xl group-hover:-rotate-12 transition-transform duration-500 border border-white/20">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <div className="space-y-2">
                <h3 className="text-3xl font-black tracking-tight uppercase italic">Desafio de Maestria</h3>
                <p className="text-white/70 text-[10px] font-black uppercase tracking-[0.2em] italic">Acelere seu progresso para atingir o Tier Elite Maker.</p>
              </div>
            </div>
            <Button className="w-full md:w-auto bg-white text-primary hover:bg-white/90 font-black h-16 px-12 rounded-2xl tracking-[0.2em] text-[11px] shadow-2xl uppercase transition-all italic scale-100 group-hover:scale-105">
              Continuar Jornada
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
