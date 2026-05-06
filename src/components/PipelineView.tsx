import { motion } from "motion/react";
import {
  MoreHorizontal,
  Building,
  HelpCircle,
  Filter
} from "lucide-react";
import { cn } from "@/Residencial_Oceania/src/lib/utils";
import { INTERESTED_PARTIES } from "../constants";
import { PipelineStage } from "../types";

interface PipelineViewProps {
  onAddClient?: () => void;
}

export function PipelineView({ onAddClient }: PipelineViewProps) {
  const stages: PipelineStage[] = [
    "Cadastro Realizado",
    "Contato Inicial",
    "Aguardando Documentação",
    "Visita Realizada",
    "Em Análise Financeira",
    "Apto para Aquisição"
  ];

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
          {["Pequeno", "Médio", "Grande"].map(f => (
            <button key={f} className="bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-50">{f}</button>
          ))}
          <button className="bg-white border border-slate-200 text-slate-600 p-2 rounded-lg"><Filter size={18} /></button>
        </div>
      </div>

      <div className="flex-1 flex gap-4 overflow-x-auto pb-8 -mx-8 px-8 custom-scrollbar">
        {stages.map((stage) => (
          <div key={stage} className="flex-shrink-0 w-80 flex flex-col">
            <div className="flex items-center justify-between mb-4 px-2">
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">{stage}</h3>
                <span className="bg-slate-200 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {INTERESTED_PARTIES.filter(p => p.stage === stage).length}
                </span>
              </div>
              <button className="text-slate-400 hover:text-[#1B2B48]"><MoreHorizontal size={14} /></button>
            </div>
            <div className="flex-1 bg-[#F1F5F9]/50 p-2 rounded-xl border border-slate-200 border-dashed space-y-3">
              {INTERESTED_PARTIES.filter(p => p.stage === stage).map((party) => (
                <motion.div
                  layoutId={party.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  key={party.id}
                  className={cn("bg-white p-4 rounded-lg border border-slate-200 shadow-sm transition-shadow cursor-grab border-l-4", getStageColor(party.stage))}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="bg-slate-50 text-slate-600 text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter shadow-sm">{party.hierarchy}</span>
                    <HelpCircle size={14} className="text-slate-300" />
                  </div>
                  <h4 className="font-bold text-[#1B2B48] text-sm mb-1">{party.name}</h4>
                  <div className="flex items-center gap-1.5 text-slate-400 text-[10px] mb-3 font-medium">
                    <Building size={12} />
                    <span>UH Opção 1: Coluna 0{party.preferredUnitId}</span>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[8px] font-bold text-slate-500">
                        {party.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <span className="text-[9px] text-[#1B2B48] font-bold">SCORE {party.score}</span>
                    </div>
                    <span className="text-[9px] text-slate-400 font-medium">{party.lastActivity}</span>
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
        ))}
      </div>
    </div>
  );
}
