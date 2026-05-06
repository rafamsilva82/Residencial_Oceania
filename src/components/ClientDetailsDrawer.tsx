import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, User, Phone, Mail, Building, FileText, Calendar, CreditCard, Shield, Briefcase, Award } from "lucide-react";
import { InterestedParty } from "../types";
import { cn } from "@/Residencial_Oceania/src/lib/utils";

interface ClientDetailsDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    client: InterestedParty | null;
}

export function ClientDetailsDrawer({ isOpen, onClose, client }: ClientDetailsDrawerProps) {
    if (!client) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-[#1B2B48]/40 backdrop-blur-sm z-[80]" />
                    <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[90] flex flex-col border-l border-slate-100">
                        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1B2B48] to-[#2A3F65] flex items-center justify-center text-white font-black text-xl shadow-lg shadow-[#1B2B48]/20">
                                    {(client.nome_completo || "?").charAt(0)}
                                </div>
                                <div>
                                    <h2 className="text-lg font-black text-[#1B2B48] uppercase tracking-tight">{client.nome_completo || "N/D"}</h2>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{client.circulo_hierarquico || 'N/I'}</p>
                                </div>
                            </div>
                            <button onClick={onClose} className="w-10 h-10 bg-white border border-slate-200 text-slate-400 hover:bg-slate-100 hover:text-[#1B2B48] rounded-xl transition-all flex items-center justify-center">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                            {/* Status Banner */}
                            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-1">Status Atual</p>
                                    <p className="text-sm font-black text-[#1B2B48] uppercase">{client.situacao_lead || "N/D"}</p>
                                </div>
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-emerald-500 shadow-sm border border-emerald-100">
                                    <FileText size={18} />
                                </div>
                            </div>

                            {/* Militar Info */}
                            <div className="space-y-4">
                                <h3 className="text-xs font-black text-slate-300 uppercase tracking-widest border-b border-slate-100 pb-2">Informações Militares</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-slate-50 p-4 rounded-2xl">
                                        <Award size={14} className="text-slate-400 mb-2" />
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">Posto / Graduação</p>
                                        <p className="text-xs font-black text-[#1B2B48]">{client.posto_graduacao || 'N/I'}</p>
                                    </div>
                                    <div className="bg-slate-50 p-4 rounded-2xl">
                                        <Shield size={14} className="text-slate-400 mb-2" />
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">Situação</p>
                                        <p className="text-xs font-black text-[#1B2B48]">{client.situacao || 'N/I'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Contato */}
                            <div className="space-y-4">
                                <h3 className="text-xs font-black text-slate-300 uppercase tracking-widest border-b border-slate-100 pb-2">Contato</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-4 bg-white p-4 border border-slate-100 rounded-2xl">
                                        <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center"><Mail size={16} /></div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase">Email</p>
                                            <p className="text-xs font-medium text-[#1B2B48]">{client.email || "—"}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 bg-white p-4 border border-slate-100 rounded-2xl">
                                        <div className="w-10 h-10 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center"><Phone size={16} /></div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase">Telefone / WhatsApp</p>
                                            <p className="text-xs font-black text-[#1B2B48]">{client.telefone || 'N/I'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Aquisição */}
                            <div className="space-y-4">
                                <h3 className="text-xs font-black text-slate-300 uppercase tracking-widest border-b border-slate-100 pb-2">Aquisição e Capacidade</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-slate-50 p-4 rounded-2xl">
                                        <CreditCard size={14} className="text-slate-400 mb-2" />
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">Forma Pagamento</p>
                                        <p className="text-xs font-black text-[#1B2B48] uppercase">{client.forma_pagamento || "N/D"}</p>
                                    </div>
                                    <div className="bg-slate-50 p-4 rounded-2xl">
                                        <Briefcase size={14} className="text-slate-400 mb-2" />
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">Análise Doc.</p>
                                        <p className={cn("text-xs font-black uppercase",
                                            client.analise_documental === 'Aprovado' ? "text-emerald-500" :
                                                client.analise_documental === 'Reprovado' ? "text-red-500" : "text-amber-500"
                                        )}>{client.analise_documental || 'N/I'}</p>
                                    </div>
                                    <div className="bg-slate-50 p-4 rounded-2xl">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">Cap. Financeira Até</p>
                                        <p className="text-xs font-black text-[#1B2B48] uppercase">{client.capacidade_financeira_ate || '-'}</p>
                                    </div>
                                    <div className="bg-slate-50 p-4 rounded-2xl">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">Cap. Financeira</p>
                                        <p className="text-xs font-black text-[#1B2B48] uppercase">{client.capacidade_financeira || '-'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Opções de Unidade */}
                            <div className="space-y-4">
                                <h3 className="text-xs font-black text-slate-300 uppercase tracking-widest border-b border-slate-100 pb-2">Unidades Desejadas</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-4 bg-white p-4 border border-slate-100 rounded-2xl">
                                        <div className="w-10 h-10 bg-slate-50 text-slate-500 rounded-xl flex items-center justify-center"><Building size={16} /></div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase">Opção 1 (Principal)</p>
                                            <p className="text-xs font-black text-[#1B2B48]">{client.opcao_1 ? `Unidade ${client.opcao_1}` : 'Não informada'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 bg-white p-4 border border-slate-100 rounded-2xl opacity-70">
                                        <div className="w-10 h-10 bg-slate-50 text-slate-500 rounded-xl flex items-center justify-center"><Building size={16} /></div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase">Opção 2 (Suplente)</p>
                                            <p className="text-xs font-black text-[#1B2B48]">{client.opcao_2 ? `Unidade ${client.opcao_2}` : 'Não informada'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
