import { useState } from 'react';
import { ArrowLeft, Users, UserPlus, Mail, TrendingUp, BookOpen, Plus, Trash2, Key, Download, Pencil, ShieldAlert, GraduationCap, Clock, BookMarked, Filter, LayoutDashboard, ChevronRight, Zap, Target } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
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
import { Input } from "./ui/input";

import { Class, EnrolledStudent } from '../../types';

interface ClassManagementProps {
  onNavigate: (screen: string, id?: string) => void;
  onAddClass: (newClass: any) => void;
  onAddActivity: (activity: any) => void;
  selectedClass: Class;
  classes: Class[];
  students: EnrolledStudent[];
  onAddStudent: (student: any) => void;
  onDeleteClass: (id: string) => Promise<boolean>;
  onDeleteStudent: (id: string) => Promise<boolean>;
}

export function ClassManagement({
  onNavigate,
  onAddClass,
  onAddActivity,
  selectedClass,
  classes,
  students,
  onAddStudent,
  onDeleteClass,
  onDeleteStudent
}: ClassManagementProps) {
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [isDeleteClassModalOpen, setIsDeleteClassModalOpen] = useState(false);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);

  const [newClassName, setNewClassName] = useState('');
  const [selectedDisciplines, setSelectedDisciplines] = useState<string[]>(['Inovação']);
  const [newStudent, setNewStudent] = useState({
    name: '',
    email: '',
    schedule: '',
    discipline: selectedClass?.disciplines[0] || 'Inovação'
  });

  const [newActivity, setNewActivity] = useState({
    title: '',
    description: '',
    points: 100,
    deadline: '',
    discipline: selectedClass?.disciplines[0] || 'Tecnologia'
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  const generateAccessCode = () => {
    return `INV-${Math.floor(1000 + Math.random() * 9000)}`;
  };

  const handleCreateClass = () => {
    if (!newClassName.trim()) return;
    const newClass = {
      name: newClassName,
      disciplines: selectedDisciplines.length > 0 ? selectedDisciplines : ['Geral']
    };
    onAddClass(newClass);
    toast.success(`Turma "${newClassName}" criada!`);
    setIsClassModalOpen(false);
    setNewClassName('');
  };

  const handleAddStudent = () => {
    if (!newStudent.name || !newStudent.email.includes('@')) {
      toast.error('Preencha nome e e-mail corretamente.');
      return;
    }

    const studentWithCode = {
      name: newStudent.name,
      email: newStudent.email,
      classId: selectedClass.id,
      accessCode: generateAccessCode(),
      schedule: newStudent.schedule || 'A definir',
      discipline: newStudent.discipline,
      xp: 0,
      progress: 0,
      avatar: '👤'
    };

    onAddStudent(studentWithCode);
    setNewStudent({ ...newStudent, name: '', email: '' });
    setIsStudentModalOpen(false);
    toast.success('Estudante cadastrado com sucesso!');
  };

  const handleDeleteClass = async () => {
    if (!selectedClass) return;
    const success = await onDeleteClass(selectedClass.id);
    if (success) {
      setIsDeleteClassModalOpen(false);
      onNavigate('teacher-dashboard');
      toast.success('Turma removida.');
    }
  };

  const handleDeleteStudent = async (id: string) => {
    if (window.confirm('Deseja realmente remover este estudante?')) {
      const success = await onDeleteStudent(id);
      if (success) {
        toast.success('Estudante removido.');
      }
    }
  };

  return (
    <div className="space-y-10 pb-20 relative px-4">
      {/* Elementos de Fundo */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -z-10"></div>

      {/* Header Profissional */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row items-center gap-6 bg-white p-8 rounded-3xl border border-border shadow-xl relative overflow-hidden group"
      >
        <div className="absolute top-0 left-0 w-full h-[3px] bg-primary/10 group-hover:bg-primary transition-colors"></div>

        <Button
          variant="ghost"
          onClick={() => onNavigate('teacher-dashboard')}
          className="rounded-2xl w-12 h-12 p-0 border border-border hover:bg-muted bg-background shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>

        <div className="flex-1 text-center lg:text-left space-y-1">
          <div className="flex flex-col sm:flex-row items-center gap-3 justify-center lg:justify-start">
            <h1 className="text-3xl font-black text-foreground tracking-tight uppercase italic flex items-center gap-3">
              <Users className="w-5 h-5 text-primary" /> {selectedClass?.name || 'Turma Selecionada'}
            </h1>
            <Badge variant="secondary" className="bg-primary/5 text-primary border-none font-bold text-[9px] px-3 uppercase tracking-widest">
              ID: {selectedClass?.id.slice(0, 8)}
            </Badge>
          </div>
          <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest flex items-center justify-center lg:justify-start gap-2">
            Gestão de Registro Acadêmico // CEITEC EDU
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            className="w-10 h-10 border border-border hover:bg-muted text-muted-foreground hover:text-primary transition-all rounded-xl p-0"
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            onClick={() => setIsDeleteClassModalOpen(true)}
            className="w-10 h-10 border border-border hover:bg-destructive/5 text-muted-foreground hover:text-destructive transition-all rounded-xl p-0"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>

      {/* Dashboard Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <motion.div variants={itemVariants}>
          <Card className="p-7 bg-white border border-border rounded-3xl shadow-sm space-y-6 hover:shadow-lg transition-all group">
            <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" /> Ações Rápidas
            </h3>
            <div className="space-y-3">
              <Button
                onClick={() => onNavigate('activity-creator', selectedClass?.id)}
                className="w-full bg-primary hover:bg-primary/90 text-white h-12 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all shadow-lg shadow-primary/10 italic"
              >
                <Plus className="w-4 h-4 mr-2" /> Lançar Atividade
              </Button>
              <Button
                onClick={() => setIsStudentModalOpen(true)}
                variant="outline"
                className="w-full border-border hover:bg-muted text-foreground h-12 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all italic"
              >
                <UserPlus className="w-4 h-4 mr-2" /> Matricular Estudante
              </Button>
              <Button
                onClick={() => setIsClassModalOpen(true)}
                variant="ghost"
                className="w-full text-muted-foreground hover:text-foreground h-10 rounded-xl text-[9px] font-bold tracking-widest uppercase italic"
              >
                <Plus className="w-3 h-3 mr-2" /> Criar nova turma
              </Button>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="p-7 bg-white border border-border rounded-3xl shadow-sm relative overflow-hidden group h-full flex flex-col justify-center">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" /> Desempenho Global
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest mb-1">Estudantes</p>
                <h4 className="text-4xl font-black text-foreground italic">{students.length}</h4>
              </div>
              <div>
                <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest mb-1">Engajamento</p>
                <h4 className="text-4xl font-black text-foreground italic">{selectedClass?.progress || 0}%</h4>
              </div>
            </div>
            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden mt-6">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${selectedClass?.progress || 0}%` }}
                className="h-full bg-primary"
              />
            </div>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="p-7 bg-white border border-border rounded-3xl shadow-sm h-full group">
            <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2 mb-5">
              <BookMarked className="w-4 h-4 text-primary" /> Disciplinas
            </h3>
            <div className="flex flex-wrap gap-2">
              {selectedClass?.disciplines.map((d) => (
                <Badge key={d} variant="secondary" className="bg-muted text-muted-foreground border-none px-4 py-1.5 font-bold text-[9px] uppercase tracking-widest rounded-lg">
                  {d}
                </Badge>
              ))}
              <Badge variant="outline" className="border-dashed border-primary/40 text-primary px-4 py-1.5 font-bold text-[9px] uppercase tracking-widest rounded-lg cursor-pointer hover:bg-primary/5 transition-colors">
                + Adicionar
              </Badge>
            </div>
          </Card>
        </motion.div>
      </motion.div>

      {/* Lista de Estudantes */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-border pb-5">
          <h2 className="text-2xl font-black text-foreground flex items-center gap-3 uppercase italic">
            <Users className="w-6 h-6 text-primary" /> Lista de Estudantes
          </h2>
          <div className="flex gap-3">
            <Button variant="outline" size="sm" className="h-10 text-[10px] uppercase font-bold tracking-widest px-5 rounded-xl border-border">
              <Filter className="w-3.5 h-3.5 mr-2" /> Filtrar
            </Button>
            <Button size="sm" className="h-10 text-[10px] uppercase font-black tracking-widest px-6 rounded-xl bg-primary text-white shadow-lg shadow-primary/10">
              <Download className="w-3.5 h-3.5 mr-2" /> Exportar
            </Button>
          </div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid gap-3"
        >
          {students.map((student: any) => (
            <motion.div key={student.id} variants={itemVariants}>
              <Card className="p-5 bg-white border border-border hover:border-primary/30 transition-all shadow-sm rounded-2xl group relative overflow-hidden">
                <div className="flex flex-col lg:flex-row items-center gap-6 relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center text-3xl border border-border group-hover:bg-primary/5 transition-colors">
                    {student.avatar || '👤'}
                  </div>

                  <div className="flex-1 text-center lg:text-left space-y-1">
                    <h3 className="font-black text-foreground text-xl tracking-tight uppercase italic flex items-center justify-center lg:justify-start gap-3">
                      {student.name}
                    </h3>
                    <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                      <span className="text-muted-foreground text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 opacity-50" /> {student.email}
                      </span>
                      <Badge className="bg-primary/10 text-primary border-none h-6 px-3 text-[9px] font-bold rounded-lg uppercase">
                        Cod: {student.accessCode}
                      </Badge>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1.5">
                        <Target className="w-3.5 h-3.5 opacity-50" /> Nível {Math.floor(student.xp / 500) + 1}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pl-6 lg:border-l border-border">
                    <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-xl border border-border transition-all">
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteStudent(student.id)} className="h-10 w-10 text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded-xl border border-border transition-all">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
          {students.length === 0 && (
            <Card className="p-20 bg-muted/20 border border-dashed border-border rounded-3xl text-center">
              <Users className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
              <p className="text-muted-foreground font-bold uppercase tracking-widest text-[10px]">Nenhum estudante nesta turma.</p>
              <Button onClick={() => setIsStudentModalOpen(true)} variant="outline" className="mt-4 border-primary/30 text-primary hover:bg-primary/5 rounded-xl uppercase font-black text-[10px] tracking-widest px-8 h-10 italic">Conectar Primeiro Aluno</Button>
            </Card>
          )}
        </motion.div>
      </div>

      {/* Modals Core */}
      <Dialog open={isClassModalOpen} onOpenChange={setIsClassModalOpen}>
        <DialogContent className="bg-white border-none text-foreground sm:max-w-[450px] shadow-2xl rounded-3xl p-0 overflow-hidden">
          <div className="bg-primary p-7 text-white">
            <DialogTitle className="text-2xl font-black uppercase italic tracking-tight flex items-center gap-3">
              <LayoutDashboard className="w-6 h-6" /> Novo Node Turma
            </DialogTitle>
            <p className="text-white/70 text-[10px] font-bold uppercase tracking-widest mt-1 italic">Expanda os perímetros do CEITEC</p>
          </div>
          <div className="p-7 space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Nome da nova turma</label>
              <Input
                placeholder="Ex: 1º ANO - ROBÓTICA"
                value={newClassName}
                onChange={(e) => setNewClassName(e.target.value)}
                className="bg-muted/50 border-border h-12 uppercase rounded-xl font-bold text-foreground text-sm"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => setIsClassModalOpen(false)} className="flex-1 font-bold text-[10px] uppercase h-12 rounded-xl">Cancelar</Button>
              <Button onClick={handleCreateClass} className="flex-1 bg-primary text-white hover:bg-primary/90 font-black h-12 rounded-xl text-[10px] uppercase shadow-lg shadow-primary/20 italic">Inicializar Turma</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isStudentModalOpen} onOpenChange={setIsStudentModalOpen}>
        <DialogContent className="bg-white border-none text-foreground sm:max-w-[450px] shadow-2xl rounded-3xl p-0 overflow-hidden">
          <div className="bg-primary p-7 text-white">
            <DialogTitle className="text-2xl font-black uppercase italic tracking-tight flex items-center gap-3">
              <UserPlus className="w-6 h-6" /> Registro de Aluno
            </DialogTitle>
            <p className="text-white/70 text-[10px] font-bold uppercase tracking-widest mt-1 italic">Matrícula direta no Inovatec Node</p>
          </div>
          <div className="p-7 space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Nome Completo</label>
              <Input placeholder="NOME DO ESTUDANTE" value={newStudent.name} onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })} className="bg-muted/50 border-border h-12 uppercase rounded-xl font-bold text-sm" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">E-mail para Acesso</label>
              <Input placeholder="ESTUDANTE@EMAIL.COM" value={newStudent.email} onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })} className="bg-muted/50 border-border h-12 uppercase rounded-xl font-bold text-sm" />
            </div>
            <div className="flex gap-2 pt-2">
              <Button variant="ghost" onClick={() => setIsStudentModalOpen(false)} className="flex-1 font-bold text-[10px] uppercase h-12 rounded-xl">Cancelar</Button>
              <Button onClick={handleAddStudent} className="flex-1 bg-primary text-white hover:bg-primary/90 font-black h-12 rounded-xl text-[10px] uppercase shadow-lg shadow-primary/20 italic">Vincular Estudante</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteClassModalOpen} onOpenChange={setIsDeleteClassModalOpen}>
        <DialogContent className="bg-white border border-destructive/20 text-foreground rounded-3xl shadow-2xl overflow-hidden p-0 max-w-sm">
          <div className="p-7 space-y-5 text-center">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
              <ShieldAlert className="w-8 h-8 text-destructive animate-pulse" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-black uppercase tracking-tight italic">Remover Turma?</h3>
              <p className="text-[10px] font-bold text-muted-foreground uppercase leading-relaxed tracking-wider px-4">
                Esta ação removerá permanentemente a turma <span className="text-foreground">{selectedClass?.name}</span> e todos os dados vinculados.
              </p>
            </div>
          </div>
          <div className="p-4 bg-muted/30 flex gap-2">
            <Button variant="ghost" onClick={() => setIsDeleteClassModalOpen(false)} className="flex-1 font-bold text-[10px] uppercase h-10">Abortar</Button>
            <Button variant="destructive" onClick={handleDeleteClass} className="flex-1 bg-destructive hover:bg-destructive/90 text-white font-black h-10 rounded-xl text-[10px] uppercase italic">Confirmar Remoção</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
