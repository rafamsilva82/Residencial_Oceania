import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Mail, Lock, LogIn, UserPlus, FileText, ChevronRight, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function Auth() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (error) throw error;
                setSuccess('Cadastro realizado! Verifique seu e-mail para confirmar.');
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
            }
        } catch (err: any) {
            setError(err.message || 'Ocorreu um erro na autenticação.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6 bg-[radial-gradient(circle_at_top_right,_#1B2B4810_0%,_transparent_40%),radial-gradient(circle_at_bottom_left,_#1B2B4805_0%,_transparent_40%)]">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full"
            >
                {/* Logo Section */}
                <div className="text-center mb-10">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center justify-center w-20 h-20 bg-[#1B2B48] rounded-[2rem] shadow-2xl shadow-[#1B2B48]/30 mb-6"
                    >
                        <FileText className="text-white w-10 h-10" />
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-4xl font-black text-[#1B2B48] uppercase tracking-[0.15em]"
                    >
                        Oceania
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-slate-500 font-medium mt-2 tracking-widest uppercase text-[10px]"
                    >
                        Insight Dashboard & Management
                    </motion.p>
                </div>

                {/* Main Card */}
                <div className="bg-white/70 backdrop-blur-xl border border-white rounded-[2.5rem] shadow-2xl shadow-slate-200 overflow-hidden relative">
                    <div className="p-10">
                        <h2 className="text-2xl font-black text-[#1B2B48] mb-8 uppercase tracking-wider">
                            {isSignUp ? 'Criar Conta' : 'Acesso ao Portal'}
                        </h2>

                        <form onSubmit={handleAuth} className="space-y-6">
                            <div className="space-y-4">
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#1B2B48] transition-colors">
                                        <Mail size={18} />
                                    </div>
                                    <input
                                        type="email"
                                        placeholder="E-mail funcional ou pessoal"
                                        className="w-full bg-slate-50 border-0 rounded-2xl py-4 pl-14 pr-5 text-sm font-semibold text-[#1B2B48] placeholder:text-slate-400 focus:ring-2 focus:ring-[#1B2B48]/10 transition-all outline-none"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#1B2B48] transition-colors">
                                        <Lock size={18} />
                                    </div>
                                    <input
                                        type="password"
                                        placeholder="Sua senha secreta"
                                        className="w-full bg-slate-50 border-0 rounded-2xl py-4 pl-14 pr-5 text-sm font-semibold text-[#1B2B48] placeholder:text-slate-400 focus:ring-2 focus:ring-[#1B2B48]/10 transition-all outline-none"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <AnimatePresence mode="wait">
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="bg-red-50 text-red-600 p-4 rounded-2xl text-xs font-bold leading-relaxed flex items-start gap-3 border border-red-100"
                                    >
                                        <AlertCircle size={16} className="shrink-0" />
                                        {error}
                                    </motion.div>
                                )}
                                {success && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="bg-emerald-50 text-emerald-600 p-4 rounded-2xl text-xs font-bold leading-relaxed flex items-start gap-3 border border-emerald-100"
                                    >
                                        <AlertCircle size={16} className="shrink-0" />
                                        {success}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#1B2B48] text-white rounded-2xl py-4 font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-[#1B2B48]/20 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        {isSignUp ? 'Finalizar Cadastro' : 'Entrar no Sistema'}
                                        <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-8 pt-8 border-t border-slate-100 text-center">
                            <button
                                onClick={() => {
                                    setIsSignUp(!isSignUp);
                                    setError(null);
                                    setSuccess(null);
                                }}
                                className="text-xs font-black uppercase tracking-[0.1em] text-[#1B2B48] hover:opacity-70 transition-opacity flex items-center justify-center gap-2 mx-auto"
                            >
                                {isSignUp ? (
                                    <>
                                        <LogIn size={14} /> Já possui acesso? Faça login
                                    </>
                                ) : (
                                    <>
                                        <UserPlus size={14} /> Novo por aqui? Solicitar acesso
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer info */}
                <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-8">
                    © 2026 Oceania Management • Sistema de Gestão de Ativos
                </p>
            </motion.div>
        </div>
    );
}
