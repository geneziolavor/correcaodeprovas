import { ArrowLeft, Code, Lightbulb, Play, CheckCircle2, Lock, BookOpen } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { motion } from 'motion/react';

interface LearningPathsProps {
  onNavigate: (screen: string) => void;
}

export function LearningPaths({ onNavigate }: LearningPathsProps) {
  const paths = [
    {
      id: 1,
      title: 'Programação com PictoBlox',
      description: 'Aprenda programação com blocos visuais e lógica computacional',
      icon: '🤖',
      color: 'bg-primary',
      progress: 65,
      lessons: 12,
      completed: 8,
      status: 'active'
    },
    {
      id: 2,
      title: 'Empreendedorismo Digital',
      description: 'Desenvolva suas ideias e aprenda a validar modelos de negócio',
      icon: '💡',
      color: 'bg-amber-500',
      progress: 40,
      lessons: 10,
      completed: 4,
      status: 'active'
    }
  ];

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 space-y-8">
      {/* Background Decorativo */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px] -z-10"></div>

      {/* Header */}
      <div className="flex items-center gap-6 border-b border-border pb-8">
        <Button
          variant="ghost"
          onClick={() => onNavigate('student-dashboard')}
          className="rounded-2xl w-12 h-12 p-0 border border-border hover:bg-muted bg-white shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-1">
            <BookOpen className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Currículo Inovatec</span>
          </div>
          <h1 className="text-4xl font-black text-foreground tracking-tight italic uppercase">
            Trilhas de <span className="text-primary italic">Conhecimento</span>
          </h1>
        </div>
      </div>

      {/* Trilhas */}
      <div className="space-y-8 max-w-5xl mx-auto pb-20">
        {paths.map((path, idx) => (
          <motion.div
            key={path.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card
              className="p-8 bg-white border border-border shadow-lg rounded-[2.5rem] hover:shadow-xl transition-all cursor-pointer group relative overflow-hidden"
              onClick={() => onNavigate('activities')}
            >
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                <Lightbulb className="w-40 h-40 text-primary" />
              </div>

              <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
                <div className={`w-28 h-28 ${path.color} rounded-3xl flex items-center justify-center shadow-xl shadow-primary/10 group-hover:rotate-6 transition-transform duration-500`}>
                  <span className="text-6xl">{path.icon}</span>
                </div>

                <div className="flex-1 space-y-6 text-center md:text-left">
                  <div className="flex flex-col md:flex-row items-start justify-between gap-4">
                    <div className="space-y-2">
                      <h2 className="text-3xl font-black text-foreground tracking-tight uppercase italic">{path.title}</h2>
                      <p className="text-muted-foreground font-medium italic">{path.description}</p>
                    </div>
                    <Button
                      className="w-full md:w-auto bg-primary text-white hover:bg-primary/90 rounded-xl h-12 px-8 font-black text-[10px] tracking-widest uppercase shadow-lg shadow-primary/20 italic group-hover:gap-6 transition-all"
                    >
                      Continuar Jornada <Play className="w-4 h-4 ml-2 fill-white" />
                    </Button>
                  </div>

                  <div className="flex flex-wrap justify-center md:justify-start gap-4">
                    <Badge variant="secondary" className="bg-muted text-muted-foreground border-none font-bold text-[9px] px-4 py-1.5 rounded-lg uppercase">
                      {path.completed}/{path.lessons} Módulos Concluídos
                    </Badge>
                    <Badge variant="secondary" className="bg-primary/5 text-primary border-none font-bold text-[9px] px-4 py-1.5 rounded-lg uppercase">
                      {path.progress}% Engajamento
                    </Badge>
                  </div>

                  {/* Barra de progresso */}
                  <div className="space-y-3">
                    <div className="flex justify-between text-[10px] font-black text-muted-foreground uppercase opacity-50">
                      <span>Início da Trilha</span>
                      <span>Domínio Completo</span>
                    </div>
                    <div className="h-2.5 bg-muted rounded-full overflow-hidden border border-border">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${path.progress}%` }}
                        className={`h-full ${path.color} transition-all duration-1000`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Módulos do Path */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10 pt-10 border-t border-border">
                <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-start gap-4">
                  <div className="p-2 bg-emerald-100 rounded-xl">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black text-emerald-700 uppercase mb-1">Status: Concluído</h4>
                    <p className="text-xs font-bold text-emerald-800 italic">Protocolos Básicos</p>
                  </div>
                </div>

                <div className="p-5 bg-primary/5 rounded-2xl border border-primary/10 flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-xl">
                    <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 2 }} className="w-5 h-5 bg-primary rounded-full" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black text-primary uppercase mb-1">Status: Ativo</h4>
                    <p className="text-xs font-bold text-foreground italic">Arquitetura de Sistemas</p>
                  </div>
                </div>

                <div className="p-5 bg-muted/40 rounded-2xl border border-border flex items-start gap-4 opacity-50">
                  <div className="p-2 bg-muted rounded-xl">
                    <Lock className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black text-muted-foreground uppercase mb-1">Status: Bloqueado</h4>
                    <p className="text-xs font-bold text-muted-foreground italic">Mestria Tecnológica</p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
