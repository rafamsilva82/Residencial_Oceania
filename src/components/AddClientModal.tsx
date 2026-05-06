import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { X, User, Building, Shield, CreditCard, ChevronRight, Loader2, AlertCircle, Mail, Phone, Award, Briefcase, FileText, Calendar } from "lucide-react";
import { cn } from "@/Residencial_Oceania/src/lib/utils";
import { supabase } from "../lib/supabase";
import { Unit } from "../types";
import toast from "react-hot-toast";

interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const POSTOS_GRADUACOES = [
  {
    group: "Oficiais", items: [
      "Almirante de Esquadra", "Vice-Almirante", "Contra-Almirante",
      "Capitão de Mar e Guerra", "Capitão de Fragata", "Capitão de Corveta",
      "Capitão-Tenente", "Primeiro-Tenente", "Segundo-Tenente", "Guarda-Marinha"
    ]
  },
  {
    group: "Praças", items: [
      "Suboficial", "Primeiro-Sargento", "Segundo-Sargento",
      "Terceiro-Sargento", "Cabo", "Marinheiro"
    ]
  },
  { group: "Outros", items: ["Servidor Civil", "Pensionista"] }
];

const CIRCULOS = [
  "Oficial General", "Oficial Superior", "Oficial Intermediário",
  "Oficial Subalterno", "Praças", "Servidor Civil", "Pensionista"
];

const FORMAS_INSCRICAO = [
  "INSCRIÇÃO SÍTIO", "INSCRIÇÃO GABINETE", "PRESENCIAL",
  "BONO nº 179/2025", "BONO nº 56/2026", "BONO nº 63/2026"
];

const SITUACOES_LEAD = [
  "Cadastrado", "Contato inicial realizado", "Aguardando documentação",
  "Documentação recebida", "Em análise documental", "Aprovado documentalmente",
  "Em análise financeira", "Aprovado financeiramente", "Reprovado",
  "Visita agendada", "Visitou unidade", "Titular", "Reserva", "Desistente"
];

function formatCurrency(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (!digits) return "";
  const num = parseInt(digits, 10) / 100;
  return num.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function parseCurrencyToRaw(formatted: string): string {
  return formatted.replace(/\D/g, "");
}

export function AddClientModal({ isOpen, onClose }: AddClientModalProps) {
  const [loading, setLoading] = useState(false);
  const [fetchingUnits, setFetchingUnits] = useState(true);
  const [units, setUnits] = useState<Unit[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    nome_completo: "",
    posto_graduacao: "",
    circulo_hierarquico: "",
    situacao_do: "",
    situacao: "ATIVO",
    vinculado_a: "",
    email: "",
    telefone: "",
    opcao_1: "",
    opcao_2: "",
    forma_pagamento: "",
    forma_inscricao: "",
    situacao_lead: "",
    analise_documental: "",
    capacidade_financeira_ate: "",
    capacidade_financeira: "",
    data_visita: ""
  });

  // Raw digits for currency fields
  const [capAteRaw, setCapAteRaw] = useState("");
  const [capAcimaRaw, setCapAcimaRaw] = useState("");

  useEffect(() => {
    if (isOpen) fetchUnits();
  }, [isOpen]);

  async function fetchUnits() {
    try {
      setFetchingUnits(true);
      const { data, error } = await supabase
        .from('units').select('*').eq('status', 'Livre').order('id', { ascending: true });
      if (error) throw error;
      if (data) setUnits(data);
    } catch (err: any) {
      console.error('Error fetching units:', err.message);
    } finally {
      setFetchingUnits(false);
    }
  }

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!formData.nome_completo.trim()) e.nome_completo = "Nome é obrigatório";
    if (!formData.posto_graduacao) e.posto_graduacao = "Selecione o posto/graduação";
    if (!formData.circulo_hierarquico) e.circulo_hierarquico = "Selecione o círculo hierárquico";
    if (!formData.situacao) e.situacao = "Selecione a situação militar";
    if (!formData.situacao_lead) e.situacao_lead = "Selecione a situação do processo";
    if (!formData.forma_pagamento) e.forma_pagamento = "Selecione a forma de pagamento";
    if (!formData.forma_inscricao) e.forma_inscricao = "Selecione a forma de inscrição";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) { toast.error("Preencha todos os campos obrigatórios."); return; }
    setLoading(true);
    try {
      const { error: insertError } = await supabase.from("leads").insert([{
        id: `IP-${Date.now()}`,
        nome_completo: formData.nome_completo.toUpperCase(),
        posto_graduacao: formData.posto_graduacao,
        circulo_hierarquico: formData.circulo_hierarquico,
        situacao_do: formData.situacao_do,
        situacao: formData.situacao,
        vinculado_a: formData.vinculado_a,
        email: formData.email,
        telefone: formData.telefone,
        opcao_1: formData.opcao_1 || null,
        opcao_2: formData.opcao_2 || null,
        forma_pagamento: formData.forma_pagamento,
        forma_inscricao: formData.forma_inscricao,
        situacao_lead: formData.situacao_lead,
        analise_documental: formData.analise_documental,
        capacidade_financeira_ate: capAteRaw ? formatCurrency(capAteRaw) : null,
        capacidade_financeira: capAcimaRaw ? formatCurrency(capAcimaRaw) : null,
        data_visita: formData.data_visita
      }]);
      if (insertError) throw insertError;
      toast.success('Cliente cadastrado com sucesso!');
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Erro ao cadastrar.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const fieldBase = "w-full px-4 py-3 bg-white border rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#1B2B48]/5 text-sm font-bold text-[#1B2B48] transition-all appearance-none";
  const labelBase = "text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-2";
  const errBorder = (field: string) => errors[field] ? "border-red-300" : "border-slate-200";

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-[#1B2B48]/60 backdrop-blur-md" />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-20">
          <div>
            <h2 className="text-xl font-black text-[#1B2B48] uppercase tracking-tight">Cadastro Padronizado</h2>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-8 h-1 bg-emerald-500 rounded-full" />
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Preencha todos os campos obrigatórios</span>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400"><X size={24} /></button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">

          {/* Nome Completo - full width */}
          <div>
            <label className={labelBase}><User size={12} /> Nome Completo *</label>
            <input type="text" required value={formData.nome_completo} onChange={(e) => setFormData(p => ({ ...p, nome_completo: e.target.value }))} placeholder="Nome completo do interessado" className={cn(fieldBase, errBorder("nome_completo"))} />
            {errors.nome_completo && <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.nome_completo}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Posto/Graduação */}
            <div>
              <label className={labelBase}><Award size={12} /> Posto / Graduação *</label>
              <select required value={formData.posto_graduacao} onChange={(e) => setFormData(p => ({ ...p, posto_graduacao: e.target.value }))} className={cn(fieldBase, errBorder("posto_graduacao"))}>
                <option value="">Selecione...</option>
                {POSTOS_GRADUACOES.map(g => (
                  <optgroup key={g.group} label={g.group}>
                    {g.items.map(item => <option key={item} value={item}>{item}</option>)}
                  </optgroup>
                ))}
              </select>
              {errors.posto_graduacao && <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.posto_graduacao}</p>}
            </div>

            {/* Círculo Hierárquico */}
            <div>
              <label className={labelBase}><Shield size={12} /> Círculo Hierárquico *</label>
              <select required value={formData.circulo_hierarquico} onChange={(e) => setFormData(p => ({ ...p, circulo_hierarquico: e.target.value }))} className={cn(fieldBase, errBorder("circulo_hierarquico"))}>
                <option value="">Selecione...</option>
                {CIRCULOS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              {errors.circulo_hierarquico && <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.circulo_hierarquico}</p>}
            </div>

            {/* Situação Militar */}
            <div>
              <label className={labelBase}><Briefcase size={12} /> Situação Militar *</label>
              <select required value={formData.situacao} onChange={(e) => setFormData(p => ({ ...p, situacao: e.target.value }))} className={cn(fieldBase, errBorder("situacao"))}>
                <option value="">Selecione...</option>
                <option value="ATIVO">ATIVO</option>
                <option value="RESERVA">RESERVA</option>
                <option value="PENSIONISTA">PENSIONISTA</option>
              </select>
            </div>

            {/* Vinculado a */}
            <div>
              <label className={labelBase}>Vinculado a (se pensionista)</label>
              <input type="text" value={formData.vinculado_a} onChange={(e) => setFormData(p => ({ ...p, vinculado_a: e.target.value }))} placeholder="Nome do titular (se aplicável)" className={cn(fieldBase, "border-slate-200")} />
            </div>

            {/* Email */}
            <div>
              <label className={labelBase}><Mail size={12} /> E-mail</label>
              <input type="email" value={formData.email} onChange={(e) => setFormData(p => ({ ...p, email: e.target.value.toLowerCase() }))} placeholder="email@dominio.com.br" className={cn(fieldBase, "border-slate-200")} />
            </div>

            {/* Telefone */}
            <div>
              <label className={labelBase}><Phone size={12} /> Telefone / WhatsApp</label>
              <input type="text" value={formData.telefone} onChange={(e) => setFormData(p => ({ ...p, telefone: e.target.value }))} placeholder="(61) 99999-0000" className={cn(fieldBase, "border-slate-200")} />
            </div>

            {/* Forma de Inscrição */}
            <div>
              <label className={labelBase}><FileText size={12} /> Forma de Inscrição *</label>
              <select required value={formData.forma_inscricao} onChange={(e) => setFormData(p => ({ ...p, forma_inscricao: e.target.value }))} className={cn(fieldBase, errBorder("forma_inscricao"))}>
                <option value="">Selecione...</option>
                {FORMAS_INSCRICAO.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
              {errors.forma_inscricao && <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.forma_inscricao}</p>}
            </div>

            {/* Situação (novo campo obrigatório) */}
            <div>
              <label className={labelBase}><FileText size={12} /> Situação do Processo *</label>
              <select required value={formData.situacao_lead} onChange={(e) => setFormData(p => ({ ...p, situacao_lead: e.target.value }))} className={cn(fieldBase, errBorder("situacao_lead"))}>
                <option value="">Selecione...</option>
                {SITUACOES_LEAD.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              {errors.situacao_lead && <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.situacao_lead}</p>}
            </div>

            {/* Opção 1 */}
            <div>
              <label className={labelBase}><Building size={12} /> Opção 1 (Unidade Pretendida)</label>
              <select value={formData.opcao_1} onChange={(e) => setFormData(p => ({ ...p, opcao_1: e.target.value }))} disabled={fetchingUnits} className={cn(fieldBase, "border-slate-200 disabled:opacity-50")}>
                <option value="">Selecione...</option>
                {units.map(u => <option key={u.id} value={u.id}>Apto {u.id}</option>)}
              </select>
            </div>

            {/* Opção 2 */}
            <div>
              <label className={labelBase}><Building size={12} /> Opção 2 (Unidade Suplente)</label>
              <select value={formData.opcao_2} onChange={(e) => setFormData(p => ({ ...p, opcao_2: e.target.value }))} disabled={fetchingUnits} className={cn(fieldBase, "border-slate-200 disabled:opacity-50")}>
                <option value="">Selecione...</option>
                {units.map(u => <option key={u.id} value={u.id}>Apto {u.id}</option>)}
              </select>
            </div>

            {/* Forma de Pagamento */}
            <div>
              <label className={labelBase}><CreditCard size={12} /> Forma de Pagamento *</label>
              <select required value={formData.forma_pagamento} onChange={(e) => setFormData(p => ({ ...p, forma_pagamento: e.target.value }))} className={cn(fieldBase, errBorder("forma_pagamento"))}>
                <option value="">Selecione...</option>
                <option value="1">1 - À Vista</option>
                <option value="2">2 - FI CCCPM</option>
                <option value="3">3 - Financiamento Externo</option>
              </select>
              {errors.forma_pagamento && <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.forma_pagamento}</p>}
            </div>

            {/* Data Visita */}
            <div>
              <label className={labelBase}><Calendar size={12} /> Data da Visita</label>
              <input type="date" value={formData.data_visita} onChange={(e) => setFormData(p => ({ ...p, data_visita: e.target.value }))} className={cn(fieldBase, "border-slate-200")} />
            </div>

            {/* Análise Documental */}
            <div>
              <label className={labelBase}><FileText size={12} /> Análise Documental</label>
              <select value={formData.analise_documental} onChange={(e) => setFormData(p => ({ ...p, analise_documental: e.target.value }))} className={cn(fieldBase, "border-slate-200")}>
                <option value="">Selecione...</option>
                <option value="Aguardando">Aguardando</option>
                <option value="Em Análise">Em Análise</option>
                <option value="Aprovado">Aprovado</option>
                <option value="Pendente">Pendente</option>
                <option value="Reprovado">Reprovado</option>
              </select>
            </div>

            {/* Capacidade Financeira Até 1.500.000 */}
            <div>
              <label className={labelBase}>Capac. Finan. até 1.500.000</label>
              <input
                type="text"
                inputMode="numeric"
                value={capAteRaw ? formatCurrency(capAteRaw) : ""}
                onChange={(e) => {
                  const raw = e.target.value.replace(/\D/g, "");
                  setCapAteRaw(raw);
                }}
                placeholder="R$ 0,00"
                className={cn(fieldBase, "border-slate-200")}
              />
            </div>

            {/* Capacidade Financeira Acima de 1.500.000 */}
            <div>
              <label className={labelBase}>Capac. Finan. acima de 1.500.000</label>
              <input
                type="text"
                inputMode="numeric"
                value={capAcimaRaw ? formatCurrency(capAcimaRaw) : ""}
                onChange={(e) => {
                  const raw = e.target.value.replace(/\D/g, "");
                  setCapAcimaRaw(raw);
                }}
                placeholder="R$ 0,00"
                className={cn(fieldBase, "border-slate-200")}
              />
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="p-6 bg-white border-t border-slate-100 flex gap-4 sticky bottom-0 z-20">
          <button type="button" onClick={onClose} className="flex-1 py-4 border border-slate-200 rounded-2xl text-xs font-black text-slate-500 uppercase tracking-widest hover:bg-slate-100 transition-colors">
            Cancelar
          </button>
          <button
            onClick={(e) => handleSubmit(e as any)}
            disabled={loading || fetchingUnits}
            className="flex-1 py-4 bg-[#1B2B48] text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-xl shadow-[#1B2B48]/20 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <>Finalizar Cadastro <ChevronRight size={20} /></>}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
