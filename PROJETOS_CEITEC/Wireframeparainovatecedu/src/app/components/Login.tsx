import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Key, ShieldCheck, Zap, GraduationCap, ChevronRight, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { toast } from 'sonner';
import { motion } from 'motion/react';
import { supabase } from '../lib/supabase';
import { Role } from '../../types';

interface LoginProps {
  onLogin: (userType: Role, userData: any) => void;
}

export function Login({ onLogin }: LoginProps) {
  const [loginMethod, setLoginMethod] = useState<'creds' | 'code'>('creds');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (loginMethod === 'creds') {
        const userType = email.toLowerCase().includes('prof') ? 'teacher' : 'student';
        const rawName = email.split('@')[0].split(/[._-]/).map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()).join(' ');

        const cleanEmail = email.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        const userId = userType === 'teacher'
          ? 'prof-1'
          : `student-${cleanEmail || Date.now()}`;

        const userData = {
          id: userId,
          name: userType === 'teacher' ? `PROF. ${rawName || 'COORDENADOR'}` : (rawName.toUpperCase() || 'ESTUDANTE'),
          email: email.includes('@') ? email : `${email}@ceitec.edu`,
          role: userType,
          avatar: userType === 'teacher' ? '👨‍🏫' : '👤',
          xp: userType === 'teacher' ? 0 : 1250
        };

        onLogin(userType, userData);
        toast.success('Autenticação Concluída');
      } else {
        const { data, error } = await supabase
          .from('students')
          .select('*')
          .eq('access_code', accessCode)
          .single();

        if (error || !data) {
          toast.error('Código Inválido', { description: 'Acesso negado pela plataforma.' });
        } else {
          onLogin('student', data);
          toast.success(`Bem-vindo, ${data.name.toUpperCase()}`);
        }
      }
    } catch (err) {
      toast.error('Erro no Sistema');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background relative overflow-hidden">
      {/* Background Decorativo */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] -z-10"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm"
      >
        <Card className="shadow-2xl border-border rounded-[2.5rem] p-10 bg-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-primary"></div>

          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-6 shadow-xl shadow-primary/20 group hover:rotate-6 transition-transform">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-black text-foreground tracking-tight italic uppercase">
              CEITEC<span className="text-primary italic">.EDU</span>
            </h1>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mt-2">Tecnologia Criativa e Inovação</p>
          </div>

          {/* Toggle de Login */}
          <div className="flex bg-muted p-1 rounded-xl mb-8 border border-border">
            <button
              onClick={() => setLoginMethod('creds')}
              className={`flex-1 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${loginMethod === 'creds' ? 'bg-white text-primary shadow-sm' : 'text-muted-foreground'}`}
            >
              Email
            </button>
            <button
              onClick={() => setLoginMethod('code')}
              className={`flex-1 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${loginMethod === 'code' ? 'bg-white text-primary shadow-sm' : 'text-muted-foreground'}`}
            >
              Código
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {loginMethod === 'creds' ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest ml-1">Email_Institucional</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50 w-4 h-4 group-focus-within:text-primary transition-colors" />
                    <Input
                      type="text"
                      placeholder="seu@exemplo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-11 h-13 bg-muted/20 border-border rounded-xl focus:border-primary transition-all font-medium text-sm"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest ml-1">Protocolo_Senha</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50 w-4 h-4 group-focus-within:text-primary transition-colors" />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-11 pr-11 h-13 bg-muted/20 border-border rounded-xl focus:border-primary transition-all font-medium text-sm"
                      required
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-primary transition-colors">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-center">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest italic">Acesso por Código de Ativação</label>
                <div className="relative">
                  <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-primary w-5 h-5 pointer-events-none" />
                  <Input
                    placeholder="ALPHA-SYNC"
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                    className="pl-12 text-center text-xl font-black italic tracking-[0.3em] h-16 rounded-2xl text-primary border-border focus:border-primary transition-all shadow-inner uppercase"
                    required
                  />
                </div>
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-black rounded-xl shadow-xl shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3 text-xs tracking-widest uppercase italic disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Entrar no Sistema
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>

          <footer className="mt-10 pt-8 border-t border-border flex flex-col items-center gap-4">
            <div className="flex items-center gap-2.5 text-[9px] font-black text-muted-foreground uppercase tracking-widest">
              <ShieldCheck className="w-3.5 h-3.5 text-primary/60" /> Conexão Segura
            </div>
            <p className="text-[9px] text-muted-foreground/60 uppercase font-bold tracking-tighter hover:text-destructive transition-colors cursor-pointer" onClick={() => { localStorage.clear(); window.location.reload(); }}>
              Resetar Configurações Locais
            </p>
          </footer>
        </Card>
      </motion.div>
    </div>
  );
}
