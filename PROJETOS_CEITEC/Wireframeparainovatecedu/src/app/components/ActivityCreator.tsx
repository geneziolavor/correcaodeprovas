import { useState, useRef } from 'react';
import {
    Plus, Trash2, Brain, Sparkles, Save, Printer,
    CheckCircle2, AlertCircle, Layout, ListChecks,
    FileText, Clock, Target, ArrowLeft, ArrowRight,
    Monitor, Info, Zap, ShieldCheck, Microscope, BookMarked,
    CheckCircle, MessageSquareQuote
} from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "./ui/dialog";
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { toast } from 'sonner';
import { Activity, Question, Class } from '../../types';
import { motion, AnimatePresence } from 'motion/react';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select";
import { Textarea } from './ui/textarea';

interface ActivityCreatorProps {
    onNavigate: (screen: string, id?: string) => void;
    onSave: (activity: any) => Promise<boolean>;
    classes: Class[];
    selectedClass?: { name: string; id: string };
    initialData?: any;
}

export function ActivityCreator({ onNavigate, onSave, classes, selectedClass, initialData }: ActivityCreatorProps) {
    const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Setup, 2: Questions, 3: Review/Key
    const [isLoading, setIsLoading] = useState(false);
    const [isAIAdvisorOpen, setIsAIAdvisorOpen] = useState(false);
    const [aiFeedback, setAiFeedback] = useState<string | null>(null);

    // Activity Meta
    const [meta, setMeta] = useState({
        title: initialData?.title || '',
        description: initialData?.description || '',
        points: initialData?.points || 100,
        deadline: initialData?.deadline || '',
        discipline: initialData?.discipline || 'Tecnologia',
        type: initialData?.type || 'atividade',
        classId: initialData?.classId || initialData?.class_id || selectedClass?.id || ''
    });

    // Questions State
    const [questions, setQuestions] = useState<Question[]>(initialData?.questions || [
        { id: '1', prompt: '', options: ['', '', '', ''], answer: 'A' }
    ]);

    const addQuestion = () => {
        const newId = String(questions.length + 1);
        setQuestions([...questions, { id: newId, prompt: '', options: ['', '', '', ''], answer: 'A' }]);
    };

    const updateQuestion = (id: string, field: keyof Question, value: any) => {
        setQuestions(questions.map(q => q.id === id ? { ...q, [field]: value } : q));
    };

    const updateOption = (qId: string, optIdx: number, value: string) => {
        setQuestions(questions.map(q => {
            if (q.id === qId) {
                const newOpts = [...(q.options || ['', '', '', ''])];
                newOpts[optIdx] = value;
                return { ...q, options: newOpts };
            }
            return q;
        }));
    };

    const removeQuestion = (id: string) => {
        if (questions.length === 1) return;
        setQuestions(questions.filter(q => q.id !== id));
    };

    const handleGenerateAI = () => {
        setIsLoading(true);
        toast.info('IA analisando currículo e gerando questões...', { icon: <Brain className="w-4 h-4 text-primary" /> });

        setTimeout(() => {
            const aiQuestions: Question[] = [
                {
                    id: 'ai-1',
                    prompt: 'Qual é o componente principal de um sistema de automação residencial que processa os sinais dos sensores?',
                    options: ['Transmissor Bluetooth', 'Microcontrolador (Arduíno/ESP32)', 'Cabo Jumper', 'Bateria 9V'],
                    answer: 'B'
                },
                {
                    id: 'ai-2',
                    prompt: 'No contexto de Internet das Coisas (IoT), o que significa a sigla MQTT?',
                    options: ['Main Queue Table Transfer', 'Mobile Quick Task Tool', 'Message Queuing Telemetry Transport', 'Modern Quality Technology Tier'],
                    answer: 'C'
                }
            ];
            setQuestions([...questions.filter(q => q.prompt !== ''), ...aiQuestions]);
            setIsLoading(false);
            toast.success('Questões geradas com sucesso!');
        }, 1500);
    };

    const handleAIReview = () => {
        setIsLoading(true);
        setIsAIAdvisorOpen(true);
        toast.info('IA Inovatec revisando alinhamento pedagógico...', { icon: <Microscope className="w-4 h-4 text-primary" /> });

        setTimeout(() => {
            setAiFeedback(`
                ### 🛠️ Sugestões de Melhoria (Inovatec AI)
                - **BNCC Computação**: Sua missão atual foca em Letramento Digital. Sugiro adicionar um desafio de **Pensamento Computacional** (ex: decomposição de problemas no Arduíno).
                - **Complexidade**: O nível da missão está adequado para o Cluster selecionado, mas pode ser potencializado com uma questão prática de simulação.
                - **Interdisciplinaridade**: Tente conectar o tema "${meta.title}" com conceitos de Física (eletricidade) ou Matemática (lógica booleana).
            `);
            setIsLoading(false);
            toast.success('Análise concluída!');
        }, 2000);
    };

    const handleSave = async () => {
        if (!meta.title) return toast.error('Dê um título para a missão');
        if (!meta.classId) return toast.error('Selecione uma turma para vincular a missão');

        setIsLoading(true);
        const activityData = {
            title: meta.title,
            description: meta.description,
            points: meta.points,
            deadline: meta.deadline || null,
            discipline: meta.discipline,
            type: meta.type,
            class_id: meta.classId,
            questions: questions.map(q => ({
                id: q.id,
                prompt: q.prompt,
                options: q.options || ['', '', '', ''],
                answer: q.answer
            })),
            icon: meta.type === 'desafio' ? '⚡' : meta.type === 'avaliação' ? '📋' : meta.type === 'projeto' ? '🏗️' : '🎯',
            color: meta.type === 'desafio' ? 'from-amber-400 to-orange-600' : 'from-blue-500 to-indigo-600'
        };

        const success = await onSave(activityData);
        if (success) {
            toast.success('M_IMPLANTADA: Protocolo de missão ativo no cluster.');
            setStep(3);
        }
        setIsLoading(false);
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-background text-foreground p-6 md:p-10 space-y-12 print:bg-white print:text-black relative">
            {/* Nav Header Profissional */}
            <div className="flex items-center justify-between bg-white p-6 rounded-[2rem] border border-border shadow-2xl relative overflow-hidden print:hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-primary/20"></div>

                <div className="flex items-center gap-8">
                    <Button variant="ghost" onClick={() => onNavigate('teacher-dashboard')} className="rounded-2xl border border-border hover:bg-muted h-12 px-6 font-black text-[10px] uppercase tracking-widest italic group">
                        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> VOLTAR PARA TELA INICIAL
                    </Button>
                    <div className="hidden md:block space-y-1 border-l border-border pl-8">
                        <h1 className="text-xl font-black tracking-tight uppercase italic text-foreground leading-none">
                            {step === 3 ? 'Protocolo de Gabarito' : (
                                <>Setup de Nova <span className="text-primary italic">Missão</span></>
                            )}
                        </h1>
                        <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-60">
                            Laboratório de Criação Pedagógica v4.0
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3 bg-muted/30 p-2 rounded-2xl border border-border/50">
                    <Button
                        onClick={handleAIReview}
                        variant="ghost"
                        className="h-10 px-4 rounded-xl text-[9px] font-black uppercase tracking-widest italic bg-primary/5 text-primary hover:bg-primary/10 border border-primary/20 flex items-center gap-2"
                    >
                        <Microscope className="w-3.5 h-3.5" /> IA Pedagogical Review
                    </Button>
                    <div className="w-[1px] h-6 bg-border mx-2" />
                    {[1, 2, 3].map((s) => (
                        <div
                            key={s}
                            className={`w-4 h-4 rounded-full transition-all duration-700 shadow-sm ${step >= s ? 'bg-primary' : 'bg-white border-2 border-border'}`}
                        />
                    ))}
                </div>
            </div>

            <AnimatePresence mode="wait">
                {step === 1 && (
                    <motion.div
                        key="step1"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-4xl mx-auto"
                    >
                        <Card className="p-10 bg-white border border-border rounded-[3rem] shadow-2xl space-y-10 relative overflow-hidden">
                            <div className="absolute -top-32 -right-32 w-80 h-80 bg-primary/5 rounded-full blur-[120px] -z-10"></div>

                            <div className="flex items-center gap-6 border-b border-border pb-10">
                                <div className="p-4 bg-primary rounded-[1.5rem] shadow-xl shadow-primary/20 group">
                                    <Layout className="w-8 h-8 text-white group-hover:scale-110 transition-transform" />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-3xl font-black uppercase tracking-tight text-foreground italic leading-none">Configuração de <span className="text-primary italic">Missão</span></h3>
                                    <p className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 opacity-60">
                                        Cluster: {selectedClass?.name || 'Protocolo Global'}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] text-primary font-black uppercase tracking-[0.3em] ml-1">Identificador da Missão</label>
                                        <Input
                                            placeholder="Ex: Circuitos Lógicos Avançados"
                                            value={meta.title}
                                            onChange={e => setMeta({ ...meta, title: e.target.value })}
                                            className="bg-muted/30 border-border h-14 rounded-2xl focus:border-primary transition-all text-sm font-black italic shadow-inner px-6"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] text-primary font-black uppercase tracking-[0.3em] ml-1">Descrição do Protocolo</label>
                                        <Input
                                            placeholder="Objetivos pedagógicos e técnicos..."
                                            value={meta.description}
                                            onChange={e => setMeta({ ...meta, description: e.target.value })}
                                            className="bg-muted/30 border-border h-14 rounded-2xl focus:border-primary transition-all text-sm font-bold italic shadow-inner px-6"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] text-primary font-black uppercase tracking-[0.3em] ml-1">Cluster / Turma Selecionada</label>
                                        <Select
                                            value={meta.classId}
                                            onValueChange={(v) => setMeta({ ...meta, classId: v })}
                                        >
                                            <SelectTrigger className="bg-muted/30 border-border h-14 rounded-2xl focus:border-primary transition-all text-sm font-black italic shadow-inner px-6">
                                                <SelectValue placeholder="Selecione a Turma" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white border-border rounded-xl">
                                                {classes.map((c) => (
                                                    <SelectItem key={c.id} value={c.id} className="font-bold uppercase text-[10px] tracking-widest">
                                                        {c.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <label className="text-[10px] text-primary font-black uppercase tracking-[0.3em] ml-1">Deadline_UTC</label>
                                            <Input
                                                type="date"
                                                value={meta.deadline}
                                                onChange={e => setMeta({ ...meta, deadline: e.target.value })}
                                                className="bg-muted/30 border-border h-14 rounded-2xl focus:border-primary transition-all text-sm font-black italic shadow-inner px-6"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] text-primary font-black uppercase tracking-[0.3em] ml-1">Recompensa (XP)</label>
                                            <div className="relative">
                                                <Zap className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                                                <Input
                                                    type="number"
                                                    value={meta.points}
                                                    onChange={e => setMeta({ ...meta, points: Number(e.target.value) })}
                                                    className="bg-muted/30 border-border h-14 rounded-2xl focus:border-primary transition-all text-base font-black italic shadow-inner pl-12"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] text-primary font-black uppercase tracking-[0.3em] ml-1">Tipo de Missão</label>
                                        <Select
                                            value={meta.type}
                                            onValueChange={(v: any) => setMeta({ ...meta, type: v })}
                                        >
                                            <SelectTrigger className="bg-muted/30 border-border h-14 rounded-2xl focus:border-primary transition-all text-sm font-black italic shadow-inner px-6">
                                                <SelectValue placeholder="Tipo de Missão" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white border-border rounded-xl">
                                                <SelectItem value="atividade" className="font-bold uppercase text-[10px] tracking-widest">Atividade</SelectItem>
                                                <SelectItem value="desafio" className="font-bold uppercase text-[10px] tracking-widest">Desafio</SelectItem>
                                                <SelectItem value="projeto" className="font-bold uppercase text-[10px] tracking-widest">Projeto</SelectItem>
                                                <SelectItem value="avaliação" className="font-bold uppercase text-[10px] tracking-widest">Avaliação</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] text-primary font-black uppercase tracking-[0.3em] ml-1">Departamento Tecnológico</label>
                                        <Input
                                            placeholder="Ex: Robótica Autônoma"
                                            value={meta.discipline}
                                            onChange={e => setMeta({ ...meta, discipline: e.target.value })}
                                            className="bg-muted/30 border-border h-14 rounded-2xl focus:border-primary transition-all text-sm font-black italic shadow-inner px-6"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-10 border-t border-border flex justify-end gap-4">
                                <Button
                                    variant="ghost"
                                    onClick={() => onNavigate('teacher-dashboard')}
                                    className="h-16 px-8 text-muted-foreground hover:text-foreground font-black uppercase text-[10px] tracking-widest italic"
                                >
                                    CANCELAR
                                </Button>
                                <Button
                                    onClick={() => setStep(2)}
                                    disabled={!meta.title || !meta.classId}
                                    className="bg-primary hover:bg-primary/90 text-white font-black h-16 px-12 rounded-[1.5rem] text-[11px] tracking-widest group flex items-center gap-4 transition-all shadow-2xl shadow-primary/30 uppercase italic"
                                >
                                    Sincronizar Questões <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </div>
                        </Card>
                    </motion.div>
                )}

                {step === 2 && (
                    <motion.div
                        key="step2"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-4xl mx-auto space-y-8"
                    >
                        {/* IA Enhanced Assistant */}
                        <Card className="p-10 bg-primary text-white border-none rounded-[3rem] shadow-2xl relative overflow-hidden group">
                            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-[100px] group-hover:scale-125 transition-transform duration-1000"></div>

                            <div className="flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">
                                <div className="flex items-center gap-8">
                                    <div className="w-20 h-20 rounded-[1.5rem] bg-white/20 backdrop-blur-md flex items-center justify-center shadow-xl border border-white/20 group-hover:rotate-12 transition-transform duration-500">
                                        <Brain className="w-10 h-10 text-white" />
                                    </div>
                                    <div className="space-y-2 text-center md:text-left">
                                        <h4 className="text-3xl font-black uppercase tracking-tight italic leading-none">IA INOVATEC CORE</h4>
                                        <p className="text-[10px] text-white/70 font-black uppercase tracking-[0.3em]">Módulo de Geração Cognitiva Sincronizado</p>
                                    </div>
                                </div>
                                <Button
                                    onClick={handleGenerateAI}
                                    disabled={isLoading}
                                    className="bg-white text-primary hover:bg-white/90 font-black h-16 px-10 rounded-2xl text-[10px] tracking-[0.2em] uppercase shadow-2xl transition-all scale-100 active:scale-95 italic"
                                >
                                    {isLoading ? <><Loader2 className="w-4 h-4 mr-3 animate-spin" /> SINCRONIZANDO...</> : 'GERAR PROTOCOLO IA'}
                                </Button>
                            </div>
                        </Card>

                        {/* Questions Stack */}
                        <div className="space-y-8">
                            {questions.map((q, idx) => (
                                <Card key={q.id} className="p-10 bg-white border border-border rounded-[3rem] shadow-xl relative group hover:border-primary/40 transition-all duration-300">
                                    <div className="absolute top-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeQuestion(q.id)}
                                            className="text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded-2xl w-12 h-12 border border-border/50"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </Button>
                                    </div>

                                    <div className="space-y-10">
                                        <div className="flex items-start gap-8">
                                            <div className="h-14 w-14 rounded-2xl bg-muted text-primary border border-border flex items-center justify-center text-xl font-black shrink-0 italic shadow-inner">
                                                #{idx + 1}
                                            </div>
                                            <div className="flex-1 space-y-3">
                                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] ml-1">Enunciado da Questão</label>
                                                <Textarea
                                                    placeholder="Digite o desafio pedagógico..."
                                                    value={q.prompt}
                                                    onChange={e => updateQuestion(q.id, 'prompt', e.target.value)}
                                                    className="bg-muted/20 border-border rounded-[1.5rem] text-xl font-black text-foreground focus:border-primary transition-all min-h-[120px] p-6 italic shadow-inner border-none leading-relaxed"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                                            {['A', 'B', 'C', 'D'].map((letter, optIdx) => (
                                                <div key={letter} className={`flex items-center gap-5 p-5 rounded-2xl border transition-all duration-300 ${q.answer === letter ? 'bg-primary border-primary shadow-xl shadow-primary/10' : 'bg-muted/10 border-border hover:border-primary/30 group/opt'}`}>
                                                    <button
                                                        onClick={() => updateQuestion(q.id, 'answer', letter)}
                                                        className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs transition-all italic ${q.answer === letter ? 'bg-white text-primary shadow-lg' : 'bg-white border border-border text-muted-foreground group-hover/opt:border-primary/50'}`}
                                                    >
                                                        {letter}
                                                    </button>
                                                    <Input
                                                        placeholder={`Alternativa ${letter}`}
                                                        value={q.options?.[optIdx] || ''}
                                                        onChange={e => updateOption(q.id, optIdx, e.target.value)}
                                                        className={`bg-transparent border-none h-12 text-[13px] font-black italic focus:ring-0 px-2 uppercase ${q.answer === letter ? 'text-white placeholder:text-white/40' : 'text-foreground'}`}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>

                        <div className="pt-16 flex flex-col md:flex-row items-center justify-between gap-10 pb-24 border-t border-border">
                            <Button
                                variant="outline"
                                onClick={addQuestion}
                                className="w-full md:w-auto h-16 px-10 rounded-2xl border-border bg-white hover:bg-muted font-black text-[10px] tracking-widest uppercase text-foreground shadow-2xl flex items-center gap-3 transition-all italic active:scale-95"
                            >
                                <Plus className="w-5 h-5" /> ADICIONAR MÓDULO_PERGUNTA
                            </Button>
                            <div className="flex gap-6 w-full md:w-auto">
                                <Button
                                    variant="ghost"
                                    onClick={() => setStep(1)}
                                    className="h-16 px-8 text-muted-foreground hover:text-foreground font-black uppercase text-[10px] tracking-widest italic"
                                >
                                    VOLTAR_CONFIG
                                </Button>
                                <Button
                                    onClick={handleSave}
                                    disabled={isLoading}
                                    className="flex-1 md:flex-initial h-16 px-12 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-xs tracking-[0.2em] uppercase shadow-2xl shadow-primary/20 transition-all italic scale-100 active:scale-95 flex items-center gap-3"
                                >
                                    {isLoading ? 'SINCRONIZANDO...' : 'ENVIAR NOVA MISSÃO'}
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}

                {step === 3 && (
                    <motion.div
                        key="step3"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-4xl mx-auto space-y-10"
                    >
                        <Card className="p-14 bg-white border border-border shadow-2xl text-center space-y-8 relative overflow-hidden print:hidden rounded-[3rem]">
                            <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-emerald-50 rounded-full blur-[100px] -z-10"></div>

                            <div className="w-20 h-20 rounded-[1.5rem] bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto mb-4 italic text-emerald-600 shadow-xl">
                                <CheckCircle2 className="w-10 h-10" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-4xl font-black uppercase tracking-tight text-foreground italic leading-none">Missão <span className="text-emerald-600 italic">Disponível!</span></h3>
                                <p className="text-muted-foreground font-black uppercase text-[10px] tracking-[0.3em] mt-3 opacity-60">Sincronização com o Cluster {selectedClass?.name || 'Operacional'} Concluída</p>
                            </div>

                            <div className="flex flex-wrap justify-center gap-6 pt-4">
                                <Badge variant="secondary" className="bg-muted text-foreground border-none px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest italic">{questions.length} Questões</Badge>
                                <Badge variant="secondary" className="bg-primary/5 text-primary border-none px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest italic">{meta.points} XP</Badge>
                            </div>

                            <div className="pt-10 flex flex-col sm:flex-row items-center justify-center gap-6">
                                <Button onClick={handlePrint} variant="outline" className="w-full sm:w-auto h-16 px-10 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl italic transition-all active:scale-95">
                                    <Printer className="w-5 h-5 mr-3" /> Imprimir Gabarito_Físico
                                </Button>
                                <Button onClick={() => onNavigate('teacher-dashboard')} className="w-full sm:w-auto bg-primary h-16 px-12 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] text-white shadow-2xl shadow-primary/30 transition-all italic scale-100 hover:scale-105 active:scale-95">
                                    <Monitor className="w-5 h-5 mr-3" /> Monitorar Central
                                </Button>
                            </div>
                        </Card>

                        {/* Printable Area - Optimized for Print */}
                        <Card className="p-12 bg-white text-black border-4 border-black shadow-none font-sans print:p-0 print:shadow-none print:border-none rounded-none">
                            <div className="flex justify-between items-start border-b-8 border-black pb-8 mb-10">
                                <div className="space-y-2">
                                    <h1 className="text-3xl font-black uppercase tracking-tighter flex items-center gap-4">
                                        <ShieldCheck className="w-8 h-8" /> INOVATEC HUB
                                    </h1>
                                    <p className="text-[12px] font-black uppercase tracking-[0.3em] ml-1">Relatório de Gabarito Operacional</p>
                                </div>
                                <div className="text-right text-[10px] font-black uppercase space-y-2 italic opacity-80">
                                    <p>Cluster_Ref: {selectedClass?.name || 'SYNC_GLOBAL'}</p>
                                    <p>Timestamp: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</p>
                                    <p>Protocolo: {meta.title}</p>
                                </div>
                            </div>

                            <div className="space-y-12">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                                    {questions.map((q, i) => (
                                        <div key={q.id} className="border-l-4 border-black pl-6 space-y-4">
                                            <p className="font-black text-[11px] uppercase tracking-widest">Entrada #{i + 1}</p>
                                            <div className="flex items-center gap-3">
                                                {['A', 'B', 'C', 'D'].map(l => (
                                                    <div
                                                        key={l}
                                                        className={`w-9 h-9 rounded-lg border-4 border-black flex items-center justify-center font-black text-xs ${q.answer === l ? 'bg-black text-white' : 'bg-white text-black shadow-sm'}`}
                                                    >
                                                        {l}
                                                    </div>
                                                ))}
                                            </div>
                                            <p className="text-[10px] font-black italic leading-tight uppercase opacity-40">{q.prompt}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="pt-10 mt-10 border-t-2 border-dashed border-black">
                                    <h3 className="font-black uppercase text-[11px] tracking-widest mb-2 italic">Notas Operacionais:</h3>
                                    <p className="text-[10px] text-black font-medium italic opacity-60 leading-relaxed uppercase">
                                        O gabarito acima é exclusivo para conferência manual. O processamento de XP é executado via cloud assim que as chaves de resposta são validadas no sistema por este mentor.
                                    </p>
                                </div>
                            </div>

                            <div className="mt-20 flex justify-between pt-8 border-t-4 border-black font-black text-[9px] uppercase italic text-black/40">
                                <p>Hash Verificador: {Math.random().toString(36).substr(2, 12).toUpperCase()}</p>
                                <p>Inovatec CORE // EDU_PROTOCOL_SECURE</p>
                            </div>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* AI Advisor Tip */}
            {step < 3 && (
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="fixed bottom-10 right-10 hidden lg:flex items-center gap-5 bg-white p-6 rounded-[2rem] border border-border shadow-2xl print:hidden max-w-sm transition-all hover:scale-105 group cursor-help z-50"
                >
                    <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20 group-hover:bg-primary/20 transition-all">
                        <Sparkles className="w-5 h-5 text-primary" />
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] font-black text-foreground uppercase tracking-widest italic underline decoration-primary decoration-2 underline-offset-4">Sugestão do Sistema</p>
                        <p className="text-[9px] font-bold text-muted-foreground uppercase leading-relaxed tracking-wider opacity-60">
                            A IA pode extrair conceitos de automação complexos. Tente títulos como "Sistemas Embarcados" ou "Lógica Proposicional".
                        </p>
                    </div>
                </motion.div>
            )}

            {/* AI Pedagogical Advisor Modal/Drawer */}
            <Dialog open={isAIAdvisorOpen} onOpenChange={setIsAIAdvisorOpen}>
                <DialogContent className="bg-white border-none rounded-[3rem] p-0 overflow-hidden sm:max-w-xl shadow-2xl">
                    <div className="bg-primary p-10 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                        <DialogHeader>
                            <div className="flex items-center gap-6 mb-4">
                                <div className="p-4 bg-white/20 backdrop-blur-md rounded-2xl border border-white/20">
                                    <Microscope className="w-8 h-8 text-white" />
                                </div>
                                <div className="space-y-1">
                                    <DialogTitle className="text-3xl font-black italic uppercase tracking-tight">Review de <span className="text-white underline decoration-white/40 decoration-4 underline-offset-8">Missão</span></DialogTitle>
                                    <p className="text-[10px] text-white/70 font-black uppercase tracking-[0.3em] italic">Inovatec AI Pedagogy v1.2</p>
                                </div>
                            </div>
                        </DialogHeader>
                    </div>

                    <div className="p-10 space-y-8">
                        {isLoading ? (
                            <div className="py-20 text-center space-y-6">
                                <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto" />
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground animate-pulse italic">Processando Alinhamento BNCC...</p>
                            </div>
                        ) : (
                            <div className="space-y-8">
                                <div className="flex items-start gap-5 p-6 bg-muted/30 rounded-3xl border border-border">
                                    <BookMarked className="w-6 h-6 text-primary mt-1" />
                                    <div className="space-y-2">
                                        <h5 className="font-black text-xs uppercase tracking-widest italic">Análise de Competência</h5>
                                        <p className="text-[11px] text-muted-foreground font-bold leading-relaxed whitespace-pre-line tracking-wide">
                                            {aiFeedback}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-2xl border border-emerald-100 italic">
                                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                                    <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Protocolo Seguro Alinhado à BNCC Computação</p>
                                </div>

                                <DialogFooter>
                                    <Button
                                        onClick={() => setIsAIAdvisorOpen(false)}
                                        className="w-full bg-primary hover:bg-primary/90 text-white h-14 rounded-2xl font-black text-[10px] uppercase tracking-widest italic shadow-xl shadow-primary/20"
                                    >
                                        APLICAR AJUSTES COGNITIVOS
                                    </Button>
                                </DialogFooter>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

function Loader2(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`animate-spin ${props.className}`}
        >
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
    )
}
