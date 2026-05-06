import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
    Users, Search, Filter, Download, ChevronLeft, ChevronRight, Plus,
    Mail, Phone, Calendar, CreditCard, Building, Shield, Loader2,
    Trash2, Edit2, Eye, ArrowUpRight, TrendingUp, RefreshCcw
} from "lucide-react";
import { supabase } from "../lib/supabase";
import { InterestedParty } from "../types";
import { cn } from "@/Residencial_Oceania/src/lib/utils";
import toast from "react-hot-toast";
import { ClientDetailsDrawer } from "./ClientDetailsDrawer";

interface ClientsViewProps {
    onAddClient: () => void;
}

export function ClientsView({ onAddClient }: ClientsViewProps) {
    const [loading, setLoading] = useState(true);
    const [clients, setClients] = useState<InterestedParty[]>([]);
    const [search, setSearch] = useState("");
    const [filterSituacao, setFilterSituacao] = useState("all");
    const [filterPayment, setFilterPayment] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [selectedClient, setSelectedClient] = useState<InterestedParty | null>(null);
    const itemsPerPage = 8;

    useEffect(() => {
        const timeoutId = setTimeout(() => { fetchClients(); }, 300);
        const channel = supabase
            .channel('leads-changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'leads' }, () => { fetchClients(); })
            .subscribe();
        return () => { clearTimeout(timeoutId); supabase.removeChannel(channel); };
    }, [currentPage, filterSituacao, filterPayment, search]);

    async function fetchClients() {
        try {
            setLoading(true);
            let query = supabase.from('leads').select('*', { count: 'exact' });

            if (filterSituacao !== "all") query = query.eq('situacao_lead', filterSituacao);
            if (filterPayment !== "all") query = query.eq('forma_pagamento', filterPayment);
            if (search.trim()) {
                const s = `%${search.trim()}%`;
                query = query.or(`nome_completo.ilike.${s},email.ilike.${s},telefone.ilike.${s},posto_graduacao.ilike.${s}`);
            }

            const { data, count, error } = await query
                .order('nome_completo', { ascending: true })
                .range((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage - 1);

            if (error) throw error;
            if (data) {
                setClients(data as InterestedParty[]);
                setTotalCount(count || 0);
            }
        } catch (err) {
            console.error('Error fetching clients:', err);
        } finally {
            setLoading(false);
        }
    }

    const displayClients = clients;

    const handleExportCSV = async () => {
        try {
            const toastId = toast.loading('Gerando arquivo CSV...');
            let query = supabase.from('leads').select('*');
            if (filterSituacao !== "all") query = query.eq('situacao_lead', filterSituacao);
            if (filterPayment !== "all") query = query.eq('forma_pagamento', filterPayment);
            if (search.trim()) {
                const s = `%${search.trim()}%`;
                query = query.or(`nome_completo.ilike.${s},email.ilike.${s},telefone.ilike.${s}`);
            }
            const { data, error } = await query.order('nome_completo', { ascending: true });
            if (error) throw error;
            if (!data || data.length === 0) { toast.error('Não há dados para exportar.', { id: toastId }); return; }

            const headers = ['QTD', 'Posto/Graduação', 'Círculo Hierárquico', 'Situação Do', 'Situação', 'Vinculado A', 'Opção 1', 'Opção 2', 'Forma Pagamento', 'Forma Inscrição', 'Email', 'Telefone', 'Situação Lead', 'Nome Completo', 'Análise Documental', 'Cap. Financeira Até', 'Cap. Financeira', 'Data Visita'];
            const rows = data.map(item => [
                item.qtd, item.posto_graduacao, item.circulo_hierarquico, item.situacao_do, item.situacao,
                item.vinculado_a, item.opcao_1, item.opcao_2, item.forma_pagamento, item.forma_inscricao,
                item.email, item.telefone, item.situacao_lead, item.nome_completo, item.analise_documental,
                item.capacidade_financeira_ate, item.capacidade_financeira, item.data_visita
            ]);
            const csvContent = [headers.join(';'), ...rows.map(row => row.map(cell => `"${(cell || '').toString().replace(/"/g, '""')}"`).join(';'))].join('\n');
            const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.setAttribute('href', url);
            link.setAttribute('download', `interessados_${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link); link.click(); document.body.removeChild(link);
            toast.success('Arquivo exportado com sucesso!', { id: toastId });
        } catch (err) { console.error(err); toast.error('Erro ao gerar exportação.'); }
    };

    const handleDeleteClient = async (id: string, name: string) => {
        if (!confirm(`Tem certeza que deseja excluir '${name}'? Essa ação não pode ser desfeita.`)) return;
        try {
            const { error } = await supabase.from('leads').delete().eq('id', id);
            if (error) throw error;
            toast.success('Registro excluído com sucesso!');
        } catch (err) { console.error(err); toast.error('Erro ao excluir registro.'); }
    };

    const handleFeatureNotReady = (feature: string) => {
        toast.error(`A funcionalidade "${feature}" está em fase de construção.`);
    };

    const totalPages = Math.max(1, Math.ceil(totalCount / itemsPerPage));

    if (!loading && totalCount === 0 && search === "" && filterSituacao === "all" && filterPayment === "all") {
        return (
            <div className="flex flex-col items-center justify-center h-full min-h-[500px] text-slate-400 border-2 border-dashed border-slate-200 rounded-[3rem] bg-white/50 space-y-8 animate-in fade-in zoom-in duration-500">
                <div className="relative">
                    <div className="bg-[#1B2B48]/5 p-10 rounded-full animate-pulse"><Users size={80} className="opacity-20 text-[#1B2B48]" /></div>
                    <div className="absolute -right-2 -bottom-2 bg-emerald-500 text-white p-3 rounded-2xl shadow-xl shadow-emerald-500/30"><Plus size={24} /></div>
                </div>
                <div className="text-center space-y-2">
                    <h3 className="text-2xl font-black text-[#1B2B48] uppercase tracking-tight">Módulo de Cadastro</h3>
                    <p className="text-sm font-medium text-slate-500 max-w-sm mx-auto leading-relaxed">Sua base de interessados está pronta para crescer.</p>
                </div>
                <button onClick={onAddClient} className="bg-[#1B2B48] text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-2xl shadow-[#1B2B48]/20 flex items-center gap-3 active:scale-95">
                    <Plus size={18} /> Cadastrar Novo Cliente
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: "Total de Leads", val: totalCount, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
                    { label: "Aguardando Visita", val: clients.filter(c => c.situacao_lead === "Cadastro Realizado").length, icon: Calendar, color: "text-amber-600", bg: "bg-amber-50" },
                    { label: "Com Análise", val: clients.filter(c => c.analise_documental).length, icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4">
                        <div className={cn("p-4 rounded-2xl", stat.bg)}><stat.icon className={stat.color} size={24} /></div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                            <h3 className="text-2xl font-black text-[#1B2B48]">{stat.val}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-6">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                    <div>
                        <h1 className="text-3xl font-black text-[#1B2B48] uppercase tracking-tighter">Gestão de Interessados</h1>
                        <div className="flex items-center gap-2 mt-1">
                            <div className="w-12 h-1.5 bg-emerald-500 rounded-full" />
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Painel Administrativo UH</p>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
                        <div className="relative flex-1 lg:w-80 group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#1B2B48] transition-colors" size={18} />
                            <input type="text" placeholder="Buscar por nome, email ou posto..." value={search} onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-[1.25rem] focus:outline-none focus:ring-4 focus:ring-[#1B2B48]/5 text-sm font-bold text-[#1B2B48] transition-all placeholder:text-slate-400" />
                        </div>
                        <button onClick={onAddClient} className="bg-[#1B2B48] text-white px-6 py-4 rounded-[1.25rem] font-black text-[10px] uppercase tracking-widest hover:bg-[#2A3F65] transition-all shadow-xl shadow-[#1B2B48]/20 flex items-center gap-3 active:scale-95">
                            <Plus size={18} /> Novo Cliente
                        </button>
                    </div>
                </div>
                <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-slate-50">
                    <div className="flex items-center gap-3">
                        <Filter size={14} className="text-slate-400" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Filtros Rápidos</span>
                    </div>
                    <select value={filterSituacao} onChange={(e) => setFilterSituacao(e.target.value)} className="px-6 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#1B2B48]/5 text-[10px] font-black uppercase tracking-widest text-[#1B2B48] appearance-none">
                        <option value="all">Todas as Situações</option>
                        <option value="Cadastro Realizado">Cadastro Realizado</option>
                        <option value="Contato Inicial">Contato Inicial</option>
                        <option value="Visita Realizada">Visita Realizada</option>
                    </select>
                    <select value={filterPayment} onChange={(e) => setFilterPayment(e.target.value)} className="px-6 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#1B2B48]/5 text-[10px] font-black uppercase tracking-widest text-[#1B2B48] appearance-none">
                        <option value="all">Formas de Pagamento</option>
                        <option value="1">À Vista</option>
                        <option value="2">FI CCCPM</option>
                        <option value="3">Financiamento</option>
                    </select>
                    <button onClick={handleExportCSV} title="Exportar para CSV" className="ml-auto p-3 text-slate-400 hover:text-[#1B2B48] transition-colors">
                        <Download size={20} />
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/40 border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#F8FAFC]/80 backdrop-blur-md border-b border-slate-100">
                                <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Interessado</th>
                                <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Posto / Situação</th>
                                <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Contato Direto</th>
                                <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Inscrição & Pagamento</th>
                                <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Qualificação</th>
                                <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Gestão</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            <AnimatePresence mode="popLayout">
                                {loading ? (
                                    <tr><td colSpan={7} className="p-32 text-center">
                                        <div className="flex flex-col items-center gap-6">
                                            <Loader2 className="animate-spin text-[#1B2B48]" size={48} />
                                            <span className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Sincronizando Leads...</span>
                                        </div>
                                    </td></tr>
                                ) : displayClients.length === 0 ? (
                                    <tr><td colSpan={7} className="p-32 text-center">
                                        <div className="flex flex-col items-center gap-4 text-slate-300">
                                            <Users size={64} className="opacity-20" />
                                            <p className="text-sm font-black uppercase tracking-widest">Nenhum resultado</p>
                                        </div>
                                    </td></tr>
                                ) : (
                                    displayClients.map((client, i) => (
                                        <motion.tr key={client.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="group hover:bg-[#F8FAFC] transition-all duration-300">
                                            <td className="p-8">
                                                <div className="flex items-center gap-5">
                                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1B2B48] to-[#2A3F65] flex items-center justify-center text-white font-black text-lg shadow-xl shadow-[#1B2B48]/20 group-hover:rotate-6 transition-transform">
                                                        {(client.nome_completo || "?").charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-black text-[#1B2B48] uppercase tracking-tight group-hover:text-blue-600 transition-colors">{client.nome_completo || "N/D"}</div>
                                                        <div className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] mt-1">
                                                            <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">{client.circulo_hierarquico || "N/D"}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-8">
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2">
                                                        <Shield size={14} className="text-slate-300" />
                                                        <span className="text-xs font-black text-[#1B2B48] uppercase tracking-tight">{client.posto_graduacao || 'N/D'}</span>
                                                    </div>
                                                    <div className={cn("inline-flex px-3 py-1 text-[9px] font-black rounded-lg uppercase tracking-widest", client.situacao === "ATIVO" ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500")}>
                                                        {client.situacao || 'N/A'}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-8">
                                                <div className="space-y-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400"><Mail size={14} /></div>
                                                        <span className="text-xs font-medium text-slate-600 lowercase">{client.email || "—"}</span>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400"><Phone size={14} /></div>
                                                        <span className="text-xs font-black text-[#1B2B48] tracking-tight">{client.telefone || "—"}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-8">
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2">
                                                        <CreditCard size={14} className="text-slate-300" />
                                                        <span className="text-[10px] font-black text-[#1B2B48] uppercase tracking-widest">{client.forma_pagamento || "N/D"}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Building size={14} className="text-slate-300" />
                                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{client.forma_inscricao || "N/D"}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-8">
                                                <div className="space-y-2">
                                                    <div className={cn("inline-flex px-2 py-1 text-[9px] font-black rounded uppercase tracking-widest",
                                                        client.analise_documental === 'Aprovado' ? "bg-emerald-50 text-emerald-600" :
                                                            client.analise_documental === 'Reprovado' ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-600"
                                                    )}>Doc: {client.analise_documental || 'N/A'}</div>
                                                    <div className="text-[9px] font-bold text-slate-500 uppercase tracking-tight flex flex-col gap-0.5">
                                                        <span>Cap. Até: <strong className="text-[#1B2B48]">{client.capacidade_financeira_ate || '-'}</strong></span>
                                                        <span>Cap.: <strong className="text-[#1B2B48]">{client.capacidade_financeira || '-'}</strong></span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-8">
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2">
                                                        <div className={cn("w-2.5 h-2.5 rounded-full ring-4",
                                                            client.situacao_lead === "Cadastro Realizado" ? "bg-blue-500 ring-blue-50" : "bg-amber-500 ring-amber-50"
                                                        )} />
                                                        <span className="text-[11px] font-black text-[#1B2B48] uppercase tracking-tighter">{client.situacao_lead || "N/D"}</span>
                                                    </div>
                                                    <p className="text-[9px] font-bold text-slate-400 ml-5 uppercase">Visita: {client.data_visita || '—'}</p>
                                                </div>
                                            </td>
                                            <td className="p-8">
                                                <div className="flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                                                    <button onClick={() => setSelectedClient(client)} title="Ver Detalhes" className="w-8 h-8 bg-white border border-slate-200 text-slate-400 hover:bg-[#1B2B48] hover:text-white hover:border-[#1B2B48] rounded-lg transition-all shadow-sm flex items-center justify-center"><Eye size={14} /></button>
                                                    <button onClick={() => handleFeatureNotReady('Editar')} title="Editar" className="w-8 h-8 bg-white border border-slate-200 text-slate-400 hover:bg-emerald-500 hover:text-white hover:border-emerald-500 rounded-lg transition-all shadow-sm flex items-center justify-center"><Edit2 size={14} /></button>
                                                    <button onClick={() => handleDeleteClient(client.id, client.nome_completo || '')} title="Excluir" className="w-8 h-8 bg-white border border-slate-200 text-slate-400 hover:bg-red-500 hover:text-white hover:border-red-500 rounded-lg transition-all shadow-sm flex items-center justify-center"><Trash2 size={14} /></button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))
                                )}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>

                {totalCount > 0 && (
                    <div className="p-8 bg-white border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-6">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                            Exibindo {Math.min(itemsPerPage, displayClients.length)} de {totalCount} registros
                        </p>
                        <div className="flex items-center gap-4">
                            <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="w-12 h-12 bg-slate-50 border border-slate-200 text-[#1B2B48] rounded-2xl disabled:opacity-30 hover:bg-white hover:shadow-xl transition-all flex items-center justify-center"><ChevronLeft size={20} /></button>
                            <div className="flex items-center gap-2">
                                {[...Array(Math.min(totalPages, 5))].map((_, i) => (
                                    <button key={i} onClick={() => setCurrentPage(i + 1)} className={cn("w-12 h-12 rounded-2xl text-[10px] font-black transition-all", currentPage === i + 1 ? "bg-[#1B2B48] text-white shadow-2xl shadow-[#1B2B48]/30 scale-110" : "bg-white border border-slate-200 text-slate-400 hover:bg-slate-50")}>{i + 1}</button>
                                ))}
                            </div>
                            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="w-12 h-12 bg-slate-50 border border-slate-200 text-[#1B2B48] rounded-2xl disabled:opacity-30 hover:bg-white hover:shadow-xl transition-all flex items-center justify-center"><ChevronRight size={20} /></button>
                        </div>
                    </div>
                )}
            </div>

            <ClientDetailsDrawer isOpen={!!selectedClient} onClose={() => setSelectedClient(null)} client={selectedClient} />
        </div>
    );
}
