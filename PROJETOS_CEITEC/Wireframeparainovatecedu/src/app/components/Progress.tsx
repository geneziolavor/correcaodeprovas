import { Trophy, Star, Award, TrendingUp, Zap, ShieldCheck, Target, Activity as ActivityIcon, ArrowLeft, Layout } from 'lucide-react';
import { Card } from './ui/card';
import { Progress as ProgressBar } from './ui/progress';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Activity } from '../../types';
import { motion } from 'motion/react';

interface ProgressProps {
  onNavigate: (screen: string) => void;
  submissions: any[];
  activities: Activity[];
  currentUser: any;
}

export function Progress({ onNavigate, submissions, activities, currentUser }: ProgressProps) {
  const xp = currentUser?.xp || 0;
  const level = Math.floor(xp / 500) + 1;
  const maxXpForCurrentLevel = level * 500;
  const progressPercent = (xp / maxXpForCurrentLevel) * 100;

  const completedCount = submissions.filter(s => s.status === 'graded' || s.status === 'delivered').length;
  const gradedCount = submissions.filter(s => s.status === 'graded').length;

  const avgGrade = gradedCount > 0
    ? (submissions.filter(s => s.status === 'graded').reduce((acc, s) => acc + (s.grade || 0), 0) / gradedCount).toFixed(1)
    : '0.0';

  const badges = [
    { id: 1, name: 'Criador Maker', desc: 'Completou primeiro projeto', icon: '🎨', color: 'primary', earned: submissions.length > 0 },
    { id: 2, name: 'Lógica em Ação', desc: 'Dominou conceitos core', icon: '🧩', color: 'emerald', earned: xp > 1000 },
    { id: 3, name: 'Maker Criativa', desc: 'Projeto destacado', icon: '💡', color: 'amber', earned: gradedCount > 0 },
    { id: 4, name: 'Startup Criativa', desc: 'Plano de negócio ativo', icon: '🚀', color: 'indigo', earned: xp > 2000 },
    { id: 5, name: 'Mestre IoT', desc: 'Especialista em conectividade', icon: '🌐', color: 'indigo', earned: false },
    { id: 6, name: 'Empreendedor Pro', desc: 'Trilha completa', icon: '💼', color: 'rose', earned: false }
  ];

  return (
    <div className="space-y-10 pb-20 relative px-4">
      {/* Background Decorativo */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -z-10"></div>

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
              Meu <span className="text-primary italic">Progresso</span>
            </h1>
            <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest">
              Análise de desempenho e evolução maker
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Core de Energia (XP) */}
        <div className="lg:col-span-8 space-y-8">
          <Card className="p-10 bg-white border border-border rounded-3xl shadow-xl relative overflow-hidden flex flex-col items-center text-center group">
            <div className="absolute top-0 left-0 w-full h-[3px] bg-primary/10 group-hover:bg-primary transition-colors"></div>

            <div className="relative mb-8">
              <div className="w-32 h-32 rounded-[2.5rem] bg-muted border border-border flex items-center justify-center text-5xl font-black text-foreground shadow-inner relative overflow-hidden">
                <span className="relative z-10 italic">XP</span>
                <div className="absolute inset-x-0 bottom-0 bg-primary/5 h-1/2 group-hover:h-3/4 transition-all duration-1000"></div>
              </div>
              <Badge className="absolute -top-3 -right-3 w-14 h-14 rounded-2xl bg-primary text-white flex items-center justify-center text-2xl font-black border-4 border-white shadow-xl">
                {level}
              </Badge>
            </div>

            <div className="space-y-2 mb-8">
              <h2 className="text-5xl font-black text-foreground tracking-tighter italic">
                {xp.toLocaleString()} <span className="text-muted-foreground text-2xl font-bold">/ {maxXpForCurrentLevel.toLocaleString()}</span>
              </h2>
              <p className="text-primary font-black uppercase tracking-[0.2em] text-[10px] italic">Status: Explorador de Elite Nível {level}</p>
            </div>

            <div className="w-full max-w-xl space-y-4">
              <ProgressBar value={progressPercent} className="h-3 bg-muted border border-border" />
              <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">
                <span>Módulo Atual</span>
                <span>Próximo Nível ({level + 1})</span>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Missões', value: completedCount, icon: Target, color: 'text-primary' },
              { label: 'Grade Score', value: avgGrade, icon: Star, color: 'text-amber-500' },
              { label: 'Melhorias', value: badges.filter(b => b.earned).length, icon: Trophy, color: 'text-emerald-500' },
              { label: 'Sync Rate', value: `${((completedCount / Math.max(activities.length, 1)) * 100).toFixed(0)}%`, icon: TrendingUp, color: 'text-primary' }
            ].map((stat, i) => (
              <Card key={i} className="p-5 bg-white border border-border text-center space-y-3 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className={`w-10 h-10 rounded-xl bg-muted flex items-center justify-center mx-auto`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div className="space-y-0.5">
                  <p className="text-2xl font-black text-foreground italic leading-none">{stat.value}</p>
                  <p className="text-[9px] text-muted-foreground font-black uppercase tracking-widest">{stat.label}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Quadro de Medalhas */}
        <div className="lg:col-span-4 space-y-6">
          <div className="flex items-center gap-3 ml-1 mb-2">
            <Award className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-black text-foreground uppercase tracking-tight italic">Conquistas</h2>
          </div>

          <div className="grid grid-cols-2 gap-3 pb-10">
            {badges.map((badge) => (
              <Card
                key={badge.id}
                className={`p-5 rounded-[2rem] border transition-all duration-300 relative overflow-hidden flex flex-col items-center gap-4 text-center ${badge.earned ? 'bg-white border-primary/20 shadow-md group' : 'bg-muted/30 border-border grayscale opacity-50'}`}
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl ${badge.earned ? 'bg-primary/5 group-hover:scale-110 transition-transform' : 'bg-muted'}`}>
                  {badge.icon}
                </div>
                <div className="space-y-1">
                  <h4 className="text-[10px] font-black text-foreground uppercase tracking-wider">{badge.name}</h4>
                  <p className="text-[9px] text-muted-foreground font-bold italic leading-tight">{badge.desc}</p>
                </div>
                {badge.earned && <div className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.6)]"></div>}
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}