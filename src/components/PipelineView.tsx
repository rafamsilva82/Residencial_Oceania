import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  MoreHorizontal,
  Building,
  HelpCircle,
  Filter,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "../lib/supabase";
import { InterestedParty, PipelineStage } from "../types";

interface PipelineViewProps {
  onAddClient?: () => void;
}

export function PipelineView({ onAddClient }: PipelineViewProps) {
  const [leads, setLeads] = useState<InterestedParty[]>([]);
  const [loading, setLoading] = useState(true);

  const stages: PipelineStage[] = [
    "Cadastro Realizado",
    "Contato Inicial",
    "Aguardando Documentação",
    "Visita Realizada",
    "Em Análise Financeira",
    "Apto para Aquisição"
  ];

  useEffect(() => {
    fetchLeads();
  }, []);

  async function fetchLeads() {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('leads').select('*');
      if (error) throw error;
      if (data) setLeads(data as InterestedParty[]);
    } catch (err) {
      console.error('Error fetching leads:', err);
    } finally {
      setLoading(false);
    }
  }

  const getStageColor = (stage: PipelineStage) => {
    switch (stage) {
      case "Cadastro Realizado": return "border-l-blue-500";
      case "Contato Inicial": return "border-l-orange-500";
      case "Aguardando Documentação": return "border-l-purple-500";
      case "Visita Realizada": return "border-l-teal-500";
      case "Em Análise Financeira": return "border-l-amber-500";
      case "Apto para Aquisição": return "border-l-green-500";
      default: return "border-l-slate-400";
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-[#1B2B48]" size={40} />
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sincronizando Pipeline...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 h-full flex flex-col">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-[#1B2B48] tracking-tight">Pipeline de Interessados</h1>
          <p className="text-slate-500 mt-1">Gerencie o fluxo de aquisição das Unidades Habitacionais em tempo real.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="bg-[#1B2B48] text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2">
            <span>Todos Círculos</span>
          </button>
          <button className="bg-white border border-slate-200 text-slate-600 p-2 rounded-lg"><Filter size={18} /></button>
        </div>
      </div>

      <div className="flex-1 flex gap-4 overflow-x-auto pb-8 -mx-8 px-8 custom-scrollbar">
        {stages.map((stage) => {
          const stageLeads = leads.filter(l => (l.situacao_lead || 'Cadastro Realizado') === stage);
          return (
            <div key={stage} className="flex-shrink-0 w-80 flex flex-col">
              <div className="flex items-center justify-between mb-4 px-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">{stage}</h3>
                  <span className="bg-slate-200 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {stageLeads.length}
                  </span>
                </div>
                <button className="text-slate-400 hover:text-[#1B2B48]"><MoreHorizontal size={14} /></button>
              </div>
              <div className="flex-1 bg-[#F1F5F9]/50 p-2 rounded-xl border border-slate-200 border-dashed space-y-3">
                {stageLeads.map((lead) => (
                  <motion.div
                    layoutId={lead.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    key={lead.id}
                    className={cn("bg-white p-4 rounded-lg border border-slate-200 shadow-sm transition-all border-l-4", getStageColor(stage))}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="bg-slate-50 text-slate-600 text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter shadow-sm">{lead.circulo_hierarquico}</span>
                      <HelpCircle size={14} className="text-slate-300" />
                    </div>
                    <h4 className="font-bold text-[#1B2B48] text-sm mb-1">{lead.nome_completo}</h4>
                    <div className="flex items-center gap-1.5 text-slate-400 text-[10px] mb-3 font-medium">
                      <Building size={12} />
                      <span>{lead.opcao_1 ? `Apto ${lead.opcao_1}` : 'Nenhuma unidade'}</span>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-[#1B2B48] flex items-center justify-center text-[8px] font-bold text-white uppercase">
                          {lead.nome_completo.split(" ").map(n => n[0]).join("")}
                        </div>
                        <span className="text-[9px] text-[#1B2B48] font-bold">{lead.posto_graduacao}</span>
                      </div>
                      <span className="text-[9px] text-slate-400 font-medium">
                        {lead.created_at ? new Date(lead.created_at).toLocaleDateString() : ''}
                      </span>
                    </div>
                  </motion.div>
                ))}
                <button
                  onClick={onAddClient}
                  className="w-full py-2 border border-slate-200 border-dashed rounded-lg text-slate-400 text-[10px] font-bold uppercase tracking-widest hover:bg-white/50 transition-colors"
                >
                  + Adicionar Interessado
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
