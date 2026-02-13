import { ArrowLeft, FileText, Star, Send, Download, Zap, ClipboardList, User } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Slider } from './ui/slider';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

import { Activity, EnrolledStudent } from '../../types';

interface GradingProps {
  onNavigate: (screen: string) => void;
  submission: any;
  student: EnrolledStudent | undefined;
  activity: Activity | undefined;
  onGrade: (id: string, grade: number, feedback: string) => Promise<boolean>;
}

export function Grading({ onNavigate, submission, student, activity, onGrade }: GradingProps) {
  const [grade, setGrade] = useState(submission?.grade || 8.5);
  const [feedback, setFeedback] = useState(submission?.feedback || '');
  const [isSaving, setIsSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    setIsSaving(true);
    await onGrade(submission.id, grade, feedback);
    setIsSaving(false);
    setSubmitted(true);
    setTimeout(() => {
      onNavigate('submissions-list');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-6 border-b border-border pb-8">
        <Button
          variant="ghost"
          onClick={() => onNavigate('teacher-dashboard')}
          className="rounded-2xl w-12 h-12 p-0 border border-border hover:bg-muted bg-white shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-1">
            <ClipboardList className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Protocolo de Avaliação</span>
          </div>
          <h1 className="text-4xl font-black text-foreground tracking-tight italic uppercase">
            Correção de <span className="text-primary italic">Atividades</span>
          </h1>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-4xl mx-auto py-20 bg-white border border-emerald-100 rounded-3xl text-center shadow-xl space-y-6"
          >
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto">
              <Star className="w-10 h-10 text-emerald-600 fill-emerald-600" />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-black text-foreground uppercase tracking-tight italic">Avaliação Registrada!</h2>
              <p className="text-muted-foreground font-medium italic">O feedback foi sincronizado com o perfil do estudante.</p>
            </div>
            <Badge className="bg-emerald-50 text-emerald-600 border border-emerald-100 px-6 py-2 font-bold uppercase text-[10px] tracking-widest animate-pulse">
              Redirecionando...
            </Badge>
          </motion.div>
        ) : !submission ? (
          <Card className="p-20 bg-white border border-border text-center space-y-6 rounded-3xl shadow-sm">
            <h2 className="text-xl font-bold text-foreground uppercase">Entrega não encontrada</h2>
            <Button onClick={() => onNavigate('submissions-list')} variant="outline" className="rounded-xl px-10">Voltar</Button>
          </Card>
        ) : (
          <div className="max-w-4xl mx-auto space-y-8 pb-20">
            {/* Info do Aluno e Atividade */}
            <Card className="p-8 bg-white border border-border rounded-3xl shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-[3px] bg-primary/10 group-hover:bg-primary transition-colors"></div>
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="w-20 h-20 bg-muted rounded-2xl flex items-center justify-center text-4xl border border-border group-hover:scale-105 transition-transform duration-500 shadow-inner">
                  {student?.avatar || '👤'}
                </div>
                <div className="text-center md:text-left flex-1 space-y-1">
                  <div className="flex items-center justify-center md:justify-start gap-4 mb-2">
                    <h2 className="text-3xl font-black text-foreground tracking-tight uppercase italic">{student?.name || 'Estudante'}</h2>
                    <Badge variant="secondary" className="bg-primary/5 text-primary border-none text-[9px] px-3 font-bold uppercase tracking-widest">
                      Matrícula Ativa
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-sm font-bold uppercase tracking-widest flex items-center justify-center md:justify-start gap-2 italic">
                    <Zap className="w-4 h-4 text-primary" /> {activity?.title || 'Relatório de Atividade'}
                  </p>
                  <div className="pt-3">
                    <Badge variant="outline" className="border-border text-muted-foreground text-[10px] font-bold uppercase h-7 px-4">
                      {submission.submitted_at ? `Data de Entrega: ${new Date(submission.submitted_at).toLocaleDateString('pt-BR')}` : 'Data não registrada'}
                    </Badge>
                  </div>
                </div>
              </div>
            </Card>

            {/* Material Enviado */}
            <Card className="p-8 bg-white border border-border rounded-3xl shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-border pb-6">
                <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" /> Material de Estudo Recebido
                </h3>
                {submission.file_url && (
                  <Button
                    variant="outline"
                    className="h-10 text-[9px] uppercase font-bold tracking-widest rounded-xl px-6 border-border"
                    onClick={() => window.open(submission.file_url, '_blank')}
                  >
                    <Download className="w-3.5 h-3.5 mr-2" /> Baixar Anexo
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-muted/20 p-8 rounded-2xl border border-border">
                <div className="text-center space-y-3">
                  <div className="w-20 h-20 bg-white border border-border rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                    <span className="text-4xl">{activity?.icon || '📦'}</span>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-foreground uppercase tracking-tight italic">{submission.file_url ? 'Arquivo de Projeto' : 'Relatório de Texto'}</h3>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{submission.file_url ? 'O aluno incluiu material externo' : 'Submissão textual direta'}</p>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-5 border border-border shadow-inner">
                  <p className="text-[9px] text-primary font-bold uppercase mb-3 flex items-center gap-1.5 pointer-events-none">
                    <User className="w-3 h-3" /> Comentários do Estudante:
                  </p>
                  <p className="text-xs text-foreground font-medium italic leading-relaxed">
                    "{submission.comments || 'Nenhum comentário adicional foi deixado para esta entrega.'}"
                  </p>
                </div>
              </div>
            </Card>

            {/* Sistema de Notas */}
            <Card className="p-8 bg-white border border-border rounded-3xl shadow-lg space-y-10 relative overflow-hidden">
              <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -z-10"></div>

              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="space-y-4 flex-1">
                  <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                    <Star className="w-4 h-4 text-primary" /> Graduação de Nota
                  </h3>
                  <div className="space-y-8 pt-4">
                    <Slider
                      value={[grade]}
                      onValueChange={(value) => setGrade(value[0])}
                      max={10}
                      min={0}
                      step={0.5}
                      className="cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                      <span>0.0</span>
                      <span className="text-primary">Escala Educacional</span>
                      <span>10.0</span>
                    </div>
                  </div>
                </div>

                <div className="w-40 h-40 bg-muted/30 border border-border rounded-3xl flex flex-col items-center justify-center shadow-inner group">
                  <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-1">Média Final</p>
                  <span className={`text-6xl font-black tracking-tight italic transition-colors ${grade >= 7 ? 'text-primary' : grade >= 5 ? 'text-orange-500' : 'text-destructive'}`}>
                    {grade.toFixed(1)}
                  </span>
                </div>
              </div>

              {/* Feedback Editor */}
              <div className="space-y-4">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1 block">
                  Feedback Pedagógico para o Mentor
                </label>
                <Textarea
                  placeholder="Escreva sugestões de melhoria e pontos positivos para o estudante..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="min-h-40 bg-muted/10 border-border text-foreground font-medium rounded-2xl p-6 focus:border-primary focus:ring-primary/5 text-sm"
                />
              </div>

              <div className="pt-4">
                <Button
                  onClick={handleSubmit}
                  disabled={isSaving}
                  className="w-full bg-primary hover:bg-primary/90 text-white font-black h-14 rounded-xl shadow-xl shadow-primary/20 text-xs tracking-widest uppercase italic transition-all group"
                >
                  {isSaving ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Registrando Grade...</>
                  ) : (
                    <><Send className="w-4 h-4 mr-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /> Finalizar Protocolo</>
                  )}
                </Button>
              </div>
            </Card>

            {/* Footer Tip */}
            <div className="p-6 bg-primary/5 border border-primary/20 rounded-2xl flex items-center gap-4">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                <Star className="w-5 h-5 text-primary" />
              </div>
              <p className="text-[10px] font-bold text-primary uppercase leading-relaxed tracking-wider">
                Lembrete: Feedbacks construtivos aceleram o ganho de XP e o engajamento na plataforma Inovatec.
              </p>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
