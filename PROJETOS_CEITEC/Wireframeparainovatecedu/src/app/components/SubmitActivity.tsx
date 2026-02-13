import { ArrowLeft, Upload, FileText, Send, CheckCircle, Loader2, Download, Zap, ShieldCheck, Terminal, Rocket, ClipboardList } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { useState } from 'react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';
import { Activity } from '../../types';

interface SubmitActivityProps {
  onNavigate: (screen: string, id?: string) => void;
  onSubmit: (sub: { activityId: string, comments: string, file: File | null }) => Promise<boolean>;
  activityId: string;
  activities: Activity[];
}

export function SubmitActivity({ onNavigate, onSubmit, activityId, activities }: SubmitActivityProps) {
  const [file, setFile] = useState<File | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [comments, setComments] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const selectedActivity = activities.find(a => String(a.id) === String(activityId));
  const hasQuestions = selectedActivity?.questions && selectedActivity.questions.length > 0;

  const handleSubmit = async () => {
    if (!activityId) {
      toast.error("Erro operacional: Atividade ID ausente.");
      onNavigate('activities');
      return;
    }

    setIsSending(true);
    const finalComments = hasQuestions ? JSON.stringify(answers) : comments;
    const success = await onSubmit({ activityId, comments: finalComments, file });
    setIsSending(false);

    if (success) {
      setSubmitted(true);
      toast.success('Protocolo Enviado');
      setTimeout(() => onNavigate('portfolio'), 3000);
    }
  };

  return (
    <div className="space-y-12 pb-20 relative px-4">
      {/* Background Decorativo */}
      <div className="absolute top-40 right-1/4 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] -z-10"></div>

      {/* Header Centralizado */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 border-b border-border pb-10">
        <div className="flex items-center gap-8">
          <Button
            variant="ghost"
            onClick={() => onNavigate('activities')}
            className="rounded-2xl w-14 h-14 p-0 border border-border hover:bg-muted bg-white shadow-sm"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5 mb-1.5 ml-1">
              <Terminal className="w-4 h-4 text-primary" />
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] italic">Transmissão de Dados Operacionais</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tighter italic uppercase leading-none">
              Enviar <span className="text-primary italic">Protocolo</span>
            </h1>
          </div>
        </div>

        <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/20 px-6 py-2.5 h-auto rounded-xl font-black text-[10px] uppercase tracking-widest italic animate-pulse">
          Status: Monitoramento de Entrada
        </Badge>
      </div>

      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-24 bg-white border border-emerald-100 rounded-[3rem] text-center space-y-8 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-emerald-50 rounded-full blur-[80px]"></div>

            <div className="w-24 h-24 bg-emerald-50 rounded-[1.5rem] flex items-center justify-center shadow-xl shadow-emerald-500/10 group">
              <Rocket className="w-12 h-12 text-emerald-600 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-500" />
            </div>
            <div className="space-y-3 relative z-10">
              <h2 className="text-4xl font-black text-foreground uppercase tracking-tight italic">Missão Sincronizada!</h2>
              <p className="text-muted-foreground font-medium italic">Seus dados foram integrados com sucesso ao servidor central.</p>
            </div>
            <Badge className="bg-emerald-50 text-emerald-600 border border-emerald-100 px-8 py-3 font-black uppercase text-[10px] tracking-widest animate-bounce rounded-xl italic">
              Redirecionando para Portfolio Decentralizado...
            </Badge>
          </motion.div>
        ) : !selectedActivity ? (
          <Card className="p-24 bg-white border border-border text-center space-y-8 rounded-[3rem] shadow-xl">
            <ShieldCheck className="w-20 h-20 text-muted-foreground/20 mx-auto" />
            <h2 className="text-2xl font-black text-foreground uppercase italic tracking-tight">Atividade Não Identificada no Cluster</h2>
            <Button onClick={() => onNavigate('activities')} className="bg-primary hover:bg-primary/90 text-white font-black px-12 h-14 rounded-2xl uppercase text-[10px] tracking-[0.2em] italic shadow-2xl shadow-primary/20 transition-all">Sincronizar HUB Central</Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-8 space-y-10">
              {/* Card de Detalhes da Atividade - Professional Style */}
              <Card className="p-10 bg-white border border-border rounded-[2.5rem] shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-125 transition-transform duration-700">
                  <Terminal className="w-40 h-40 text-primary" />
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-10 relative z-10 text-center sm:text-left">
                  <div className={`w-28 h-28 rounded-[2rem] bg-primary flex items-center justify-center text-6xl shadow-2xl shadow-primary/20 text-white group-hover:rotate-3 transition-transform duration-500`}>
                    {selectedActivity.icon || '🎯'}
                  </div>
                  <div className="space-y-4 flex-1">
                    <div className="space-y-2">
                      <h2 className="text-3xl md:text-4xl font-black text-foreground tracking-tight uppercase italic leading-none group-hover:text-primary transition-colors">{selectedActivity.title}</h2>
                      <p className="text-sm text-muted-foreground font-medium italic leading-relaxed opacity-80">"{selectedActivity.description}"</p>
                    </div>
                    <div className="flex flex-wrap justify-center sm:justify-start gap-4 pt-2">
                      <Badge variant="secondary" className="bg-muted text-muted-foreground border-none font-black text-[10px] px-5 py-2 rounded-xl italic tracking-widest">Protocolo: {selectedActivity.deadline}</Badge>
                      <Badge variant="secondary" className="bg-primary/5 text-primary border-none font-black text-[10px] px-5 py-2 rounded-xl italic tracking-widest">{selectedActivity.points} XP Disponíveis</Badge>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Área de Respostas - Contextual Forms */}
              <div className="space-y-6">
                <h3 className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.3em] flex items-center gap-3 ml-2 italic">
                  <ClipboardList className="w-5 h-5 text-primary" /> Entradas de Log Educacional
                </h3>

                {hasQuestions ? (
                  <div className="space-y-6">
                    {(selectedActivity.questions || []).map((q: any, index: number) => (
                      <Card key={q.id} className="p-8 bg-white border border-border rounded-[2rem] hover:border-primary/30 transition-all shadow-sm group">
                        <div className="space-y-6">
                          <div className="flex items-center justify-between">
                            <Badge className="bg-muted text-muted-foreground border-none font-black text-[9px] uppercase px-4 py-1.5 rounded-lg tracking-widest italic">Módulo de Questão {index + 1}</Badge>
                          </div>
                          <p className="text-xl font-black text-foreground tracking-tight leading-tight italic">{q.prompt}</p>

                          <div className="pt-4">
                            {q.options && q.options.length > 0 ? (
                              <div className="grid grid-cols-1 gap-3">
                                {q.options.map((opt: string, optIdx: number) => (
                                  <button
                                    key={optIdx}
                                    onClick={() => setAnswers({ ...answers, [q.id]: opt })}
                                    className={`w-full p-6 rounded-2xl border text-left transition-all duration-300 flex items-center gap-6 group/opt ${answers[q.id] === opt
                                      ? 'bg-primary border-primary text-white shadow-2xl shadow-primary/20 scale-[1.02]'
                                      : 'bg-muted/10 border-border text-foreground hover:bg-muted/30 hover:border-muted-foreground/30 hover:scale-[1.01]'}`}
                                  >
                                    <div className={`w-10 h-10 rounded-xl border flex items-center justify-center font-black text-sm italic transition-all ${answers[q.id] === opt ? 'bg-white/20 border-white/40 text-white' : 'border-border text-muted-foreground bg-white shadow-inner group-hover/opt:border-primary/40'}`}>
                                      {String.fromCharCode(65 + optIdx)}
                                    </div>
                                    <span className="font-black text-sm flex-1 tracking-tight">{opt}</span>
                                  </button>
                                ))}
                              </div>
                            ) : (
                              <Input
                                placeholder="Insira o output esperado aqui..."
                                value={answers[q.id] || ''}
                                onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                                className="bg-muted/50 border-border h-14 text-foreground font-bold italic rounded-2xl focus:border-primary transition-all shadow-inner text-base px-6 placeholder:italic placeholder:font-medium"
                              />
                            )}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="p-8 bg-white border border-border rounded-[2rem] shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-primary opacity-20 group-hover:opacity-100 transition-opacity"></div>
                    <Textarea
                      placeholder="Descreva detalhadamente o fluxo de execução e resultados da sua missão..."
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                      className="min-h-[250px] bg-muted/20 border-border text-foreground p-8 focus:ring-primary/20 rounded-2xl font-medium italic text-sm leading-relaxed border-none shadow-inner"
                    />
                  </Card>
                )}
              </div>
            </div>

            {/* Sidebar de Upload e Finalização */}
            <div className="lg:col-span-4 space-y-8">
              <Card className="p-10 bg-white border border-border rounded-[2.5rem] shadow-xl space-y-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-full h-1 bg-primary/20"></div>

                <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] flex items-center gap-3 italic">
                  <Upload className="w-5 h-5 text-primary" /> Anexo de Binários
                </h3>

                <label className="block group/upload cursor-pointer">
                  <div className="border-2 border-dashed border-border rounded-3xl p-10 text-center hover:border-primary/50 hover:bg-primary/5 transition-all duration-500 shadow-inner group/box relative overflow-hidden">
                    <div className="w-16 h-16 rounded-2xl bg-muted border border-border flex items-center justify-center mx-auto mb-6 group-hover/upload:scale-110 group-hover/upload:rotate-6 transition-all duration-500 shadow-xl group-hover/upload:border-primary/40">
                      <Upload className="w-8 h-8 text-primary group-hover/upload:animate-bounce" />
                    </div>
                    {file ? (
                      <div className="space-y-2">
                        <p className="text-foreground font-black text-sm truncate max-w-[200px] mx-auto uppercase italic">{file.name}</p>
                        <Badge variant="secondary" className="bg-emerald-50 text-emerald-600 border-none font-black text-[9px] uppercase tracking-widest italic py-1.5 px-3">Sincronia: {(file.size / 1024).toFixed(1)} KB</Badge>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-foreground font-black text-xs uppercase tracking-[0.2em] italic">Carregar Output</p>
                        <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest opacity-60">Formatos: PDF, SB3, PNG, ZIP (10MB)</p>
                      </div>
                    )}
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => e.target.files && setFile(e.target.files[0])}
                    />
                  </div>
                </label>

                <Button
                  onClick={handleSubmit}
                  disabled={isSending}
                  className="w-full h-16 bg-primary hover:bg-primary/90 text-white font-black rounded-2xl shadow-2xl shadow-primary/30 disabled:opacity-50 transition-all uppercase tracking-[0.2em] text-[11px] italic group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  {isSending ? (
                    <><Loader2 className="w-5 h-5 mr-3 animate-spin" /> Processando...</>
                  ) : (
                    <><Send className="w-5 h-5 mr-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /> Sincronizar Protocolo</>
                  )}
                </Button>
              </Card>

              <div className="p-6 bg-amber-50 border border-amber-100 rounded-3xl flex items-start gap-4">
                <Zap className="w-6 h-6 text-amber-500 mt-1 shrink-0" />
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest italic">Aviso de Integridade</p>
                  <p className="text-[10px] font-bold text-amber-700/80 leading-relaxed italic">
                    Verifique se todas as saídas de dados estão em conformidade com os requisitos da missão antes do envio final.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
