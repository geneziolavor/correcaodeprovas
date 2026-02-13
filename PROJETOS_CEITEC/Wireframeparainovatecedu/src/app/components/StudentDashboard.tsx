import { Trophy, Star, Award, TrendingUp, BookOpen, Code, Lightbulb, Bell, Zap, Rocket, ShieldCheck, Target, ChevronRight, Activity as ActivityIcon } from 'lucide-react';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { motion, AnimatePresence } from 'motion/react';

interface StudentDashboardProps {
  onNavigate: (screen: string) => void;
  currentUser: any;
}

export function StudentDashboard({ onNavigate, currentUser }: StudentDashboardProps) {
  const studentName = currentUser?.name || "Recruta";
  const xp = currentUser?.xp || 0;
  const maxXp = 2000;
  const level = Math.floor(xp / 500) + 1;
  const progressPercent = (xp / maxXp) * 100;

  return (
    <div className="space-y-12 pb-20 relative px-4">
      {/* Background Decorativo */}
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -z-10"></div>

      {/* Hero: Perfil do Estudante */}
      <div className="relative">
        <div className="flex flex-col lg:flex-row gap-10 items-start lg:items-center">
          {/* Avatar Premium */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative shrink-0"
          >
            <div className="relative w-36 h-36 md:w-44 md:h-44 bg-white rounded-[2.5rem] border border-border flex items-center justify-center text-6xl md:text-7xl shadow-2xl relative overflow-hidden group">
              <span className="relative z-10 group-hover:scale-110 transition-transform duration-500">{currentUser?.avatar || '👤'}</span>
              <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent"></div>
              <div className="absolute inset-x-0 bottom-0 h-1 bg-primary"></div>
            </div>
            <Badge className="absolute -bottom-3 -right-3 bg-primary text-white border-4 border-background px-6 py-2.5 font-black text-sm shadow-xl rounded-2xl italic">
              LVL {level}
            </Badge>
          </motion.div>

          <div className="flex-1 space-y-6 w-full">
            <div className="space-y-3">
              <div className="flex items-center gap-3 mb-2 ml-1">
                <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.6)]"></div>
                <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] italic">Status: Online // Agente Sincronizado</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tighter leading-none uppercase italic">
                Bem-vindo, <span className="text-primary italic">{studentName}</span>
              </h1>
            </div>

            <Card className="p-8 bg-white border border-border rounded-[2.5rem] shadow-xl relative overflow-hidden group">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-6 relative z-10">
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Métrica de Evolução (XP)</p>
                  <p className="text-5xl font-black text-foreground tracking-tighter italic">
                    {xp.toLocaleString()} <span className="text-muted-foreground text-2xl font-bold italic">/{maxXp.toLocaleString()}</span>
                  </p>
                </div>
                <div className="text-right w-full sm:w-auto">
                  <Badge variant="secondary" className="bg-primary/5 text-primary border-none font-black text-[9px] uppercase tracking-widest px-4 py-1.5 rounded-lg mb-2">Ranking Global</Badge>
                  <p className="text-sm font-black text-foreground uppercase tracking-tight italic">Elite Maker <span className="text-primary">Tier 1</span></p>
                </div>
              </div>

              <div className="relative h-4 w-full bg-muted rounded-full overflow-hidden p-1 border border-border/50">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 2, ease: "circOut" }}
                  className="h-full bg-primary rounded-full shadow-[0_0_15px_rgba(59,130,246,0.4)] relative"
                >
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                </motion.div>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-6">
                <div className="flex gap-2 p-2 bg-muted/30 rounded-xl border border-border">
                  {[1, 2, 3, 4, 5].map(s => (
                    <Star key={s} className={`w-4 h-4 ${s <= level ? 'text-primary fill-primary' : 'text-muted-foreground/20'}`} />
                  ))}
                </div>
                <div className="h-5 w-px bg-border hidden sm:block"></div>
                <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest italic opacity-70">
                  Você superou <span className="text-primary">85%</span> das metas pedagógicas da semana.
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Lado Esquerdo: Missões Críticas */}
        <div className="lg:col-span-8 space-y-8">
          <div className="flex items-center justify-between border-b border-border pb-4 ml-1">
            <h2 className="text-2xl font-black text-foreground flex items-center gap-4 tracking-tight uppercase italic">
              <Rocket className="w-6 h-6 text-primary" /> Missões <span className="text-primary italic">Operacionais</span>
            </h2>
            <Button
              variant="ghost"
              onClick={() => onNavigate('activities')}
              className="text-[10px] font-black text-primary hover:bg-primary/5 uppercase tracking-[0.2em] italic"
            >
              Logs de Missão <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          <div className="grid gap-6">
            <motion.div whileHover={{ scale: 1.015 }} transition={{ type: "spring", stiffness: 300 }}>
              <Card
                className="p-8 bg-white border border-border hover:border-primary/40 transition-all cursor-pointer rounded-[2.5rem] shadow-sm hover:shadow-2xl group overflow-hidden relative"
                onClick={() => onNavigate('activities')}
              >
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                  <Code className="w-32 h-32 text-primary" />
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-8 relative z-10">
                  <div className="w-24 h-24 rounded-3xl bg-primary flex items-center justify-center shadow-2xl shadow-primary/20 group-hover:rotate-3 transition-transform duration-500">
                    <Code className="w-12 h-12 text-white" />
                  </div>
                  <div className="flex-1 space-y-4 text-center sm:text-left">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                      <Badge className="bg-primary/5 text-primary border-primary/20 text-[9px] font-black px-4 py-1.5 uppercase tracking-widest italic">Prioridade Alpha</Badge>
                      <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 text-[9px] font-black px-4 py-1.5 uppercase tracking-widest italic">+1.2k XP</Badge>
                    </div>
                    <h3 className="text-3xl font-black text-foreground leading-none uppercase italic tracking-tight">Machine Learning: PictoBlox</h3>
                    <p className="text-sm text-muted-foreground font-medium italic opacity-80 leading-relaxed">Desenvolva algoritmos de visão computacional e processamento de dados em tempo real.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-muted group-hover:bg-primary/5 transition-all">
                    <TrendingUp className="w-8 h-8 text-primary/40 group-hover:text-primary transition-colors" />
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div whileHover={{ scale: 1.015 }}>
              <Card
                className="p-6 bg-white border border-border hover:border-amber-400/40 transition-all cursor-pointer rounded-[2rem] shadow-sm group"
                onClick={() => onNavigate('activities')}
              >
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500 border border-amber-100 group-hover:bg-amber-500 group-hover:text-white transition-all">
                    <Lightbulb className="w-8 h-8" />
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-black text-foreground text-sm uppercase tracking-widest italic">Desafio Empreendedor v2</h4>
                      <span className="text-[10px] font-black text-amber-600 uppercase italic">Sync: 35%</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden border border-border/50 p-0.5">
                      <div className="h-full bg-amber-500 w-[35%] rounded-full"></div>
                    </div>
                    <p className="text-[9px] text-muted-foreground font-black uppercase tracking-widest italic opacity-60">Pitch Deck Operacional: Análise de Mercado</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Lado Direito: Notificações & Conquistas */}
        <div className="lg:col-span-4 space-y-10">
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-border pb-4 ml-1">
              <h2 className="text-xl font-black text-foreground flex items-center gap-4 tracking-tight uppercase italic text-sm">
                <Bell className="w-5 h-5 text-primary" /> Transmissões
              </h2>
            </div>

            <div className="space-y-4">
              {[
                { title: 'Status_Urgente', msg: 'A Missão PictoBlox foi estendida por mais 48h.', icon: '📢' },
                { title: 'Conquista_Elite', msg: 'Seu projeto atingiu rank S no cluster regional.', icon: '💎' }
              ].map((aviso, i) => (
                <Card key={i} className="p-5 bg-white border border-border hover:border-primary/20 transition-all cursor-pointer rounded-2xl group relative overflow-hidden">
                  <div className="flex gap-4 relative z-10">
                    <div className="text-3xl grayscale group-hover:grayscale-0 transition-all">{aviso.icon}</div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <h4 className="text-[10px] font-black text-foreground uppercase tracking-widest italic leading-tight">{aviso.title}</h4>
                      <p className="text-[11px] text-muted-foreground font-medium italic opacity-80 leading-snug">{aviso.msg}</p>
                    </div>
                  </div>
                  <div className="absolute top-0 left-0 w-1 h-full bg-primary/20 group-hover:bg-primary transition-colors"></div>
                </Card>
              ))}
            </div>
          </section>

          <Card className="p-10 bg-primary text-white shadow-2xl shadow-primary/30 relative overflow-hidden rounded-[2.5rem] group">
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-[80px] group-hover:scale-150 transition-transform duration-1000"></div>

            <div className="relative z-10 space-y-6 text-center lg:text-left">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto lg:mx-0 shadow-lg border border-white/20">
                <Award className="w-8 h-8 text-white" />
              </div>
              <div className="space-y-2">
                <h4 className="text-white font-black uppercase text-xl italic tracking-tight leading-none">Elite Maker <span className="text-white/60">v.3</span></h4>
                <p className="text-white/80 text-[10px] font-bold uppercase tracking-[0.2em] leading-relaxed">Conquista de maestria tecnológica desbloqueada esta semana.</p>
              </div>
              <Button variant="outline" className="w-full bg-white/10 border-white/20 hover:bg-white/20 text-white font-black text-[10px] h-12 uppercase tracking-[0.2em] rounded-xl italic transition-all shadow-inner">
                Dashboard de Liderança
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}