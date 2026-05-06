import { motion, AnimatePresence } from "motion/react";
import { ChevronRight, Plus, X, Trash2, ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";
import { IMAGES } from "../constants";
import { Unit, InterestedParty } from "../types";
import { supabase } from "../lib/supabase";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

interface UnitModalProps {
  unit: Unit | null;
  onClose: () => void;
}

export function UnitModal({ unit, onClose }: UnitModalProps) {
  const [interestedParties, setInterestedParties] = useState<InterestedParty[]>([]);
  const [loadingLeads, setLoadingLeads] = useState(false);
  const [humanizedPlan, setHumanizedPlan] = useState<string | null>(null);
  const [loadingPlan, setLoadingPlan] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    if (unit) {
      fetchInterestedParties();
      fetchHumanizedPlan();
    }
  }, [unit]);

  async function fetchHumanizedPlan() {
    if (!unit) return;
    try {
      setLoadingPlan(true);
      const columnNumber = parseInt(unit.column.replace(/\D/g, ''), 10);

      const { data, error } = await supabase
        .from('humanized_plans')
        .select('image_url')
        .eq('column_number', columnNumber)
        .single();

      if (error) throw error;
      setHumanizedPlan(data?.image_url || null);
    } catch (err) {
      console.error("Error loading humanized plan:", err);
      setHumanizedPlan(null);
    } finally {
      setLoadingPlan(false);
    }
  }

  async function fetchInterestedParties() {
    if (!unit) return;
    try {
      setLoadingLeads(true);
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .or(`opcao_1.eq.${unit.id},opcao_2.eq.${unit.id}`);

      if (error) throw error;
      if (data) {
        setInterestedParties(data as InterestedParty[]);
      }
    } catch (err) {
      console.error("Error fetching leads:", err);
    } finally {
      setLoadingLeads(false);
    }
  }

  async function handleRemoveInterest(party: any) {
    if (!window.confirm("Tem certeza que deseja remover este interessado desta unidade?")) return;
    try {
      const updates: any = {};
      if (party.opcao_1 === unit?.id) updates.opcao_1 = null;
      if (party.opcao_2 === unit?.id) updates.opcao_2 = null;

      const { error } = await supabase
        .from('leads')
        .update(updates)
        .eq('id', party.id);

      if (error) throw error;

      toast.success("Interessado removido com sucesso!");
      fetchInterestedParties();
    } catch (err) {
      console.error(err);
      toast.error("Erro ao remover interessado.");
    }
  }

  if (!unit) return null;

  // Logic for primary (opcao_1) and waitlist (opcao_2)
  const primaryInterested = interestedParties.find(p => p.opcao_1 === unit.id);
  const waitlist = interestedParties.filter(p => p.id !== primaryInterested?.id);

  // CCCPM eligibility rule: value < R$ 2,500,000
  const isCCCPMEligible = Number(unit.value) < 2500000;

  return (
    <>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#1B2B48]/40 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[95vh] max-h-[95vh]"
        >
          {/* TOP IMAGE SECTION */}
          <div className="w-full h-1/2 md:h-[55%] bg-[#F0F4F8] relative border-b border-slate-200 flex-shrink-0 flex items-center justify-center group overflow-hidden">

            {loadingPlan ? (
              <div className="w-full h-full flex flex-col items-center justify-center animate-pulse p-8">
                <div className="w-64 h-64 bg-slate-200/50 rounded-lg mb-4"></div>
                <div className="h-4 w-48 bg-slate-200 rounded"></div>
              </div>
            ) : humanizedPlan ? (
              <div
                className="relative w-full h-full cursor-zoom-in"
                onClick={() => setLightboxOpen(true)}
              >
                <img
                  src={humanizedPlan}
                  alt="Planta da Unidade"
                  className="w-full h-full object-contain p-8 transition-transform duration-700 ease-in-out group-hover:scale-[1.02]"
                  referrerPolicy="no-referrer"
                />
                {/* Zoom indicator on hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <div className="bg-[#1B2B48]/70 backdrop-blur-sm text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
                    <ZoomIn size={18} />
                    <span className="text-xs font-bold uppercase tracking-wider">Ampliar</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center p-8">
                <div className="w-20 h-20 bg-slate-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
                    <path d="M3 3v18h18" />
                    <path d="M18 17V9a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v8" />
                  </svg>
                </div>
                <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Planta não disponível</p>
                <p className="text-[10px] uppercase font-bold text-slate-300 mt-1">A imagem humanizada para esta coluna ainda não consta no repositório geral.</p>
              </div>
            )}

            <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-white/80 backdrop-blur-md rounded-full text-slate-600 hover:text-[#1B2B48] hover:bg-white border border-slate-200 transition-all z-[20] shadow-sm">
              <X size={24} />
            </button>
          </div>

          {/* BOTTOM DATA SECTION */}
          <div className="w-full flex flex-col flex-1 overflow-y-auto bg-white p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-3xl font-black text-[#1B2B48] uppercase tracking-tight">Apartamento {unit.id} • Col {unit.column}</h2>
                <p className="text-slate-500 font-medium tracking-tight">Andar {unit.floor} • Área Restrita Empreendimento Oceania</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Área Privativa</p>
                <p className="text-xl font-bold text-[#1B2B48]">{unit.area} m²</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Valor Unitário</p>
                <p className="text-xl font-bold text-[#1B2B48]">R$ {unit.value.toLocaleString("pt-BR")}</p>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-sm font-medium text-slate-500">Status Ocupacional</span>
                <span className={cn(
                  "px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest",
                  unit.status === "Livre" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                )}>{unit.status}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-sm font-medium text-slate-500">Convênio CCCPM</span>
                <span className={cn(
                  "px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest",
                  isCCCPMEligible ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
                )}>
                  {isCCCPMEligible ? "Elegível" : "Não Elegível"}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-sm font-medium text-slate-500">Cota Condominial (Est.)</span>
                <span className="text-sm font-bold text-[#1B2B48]">R$ {Number(unit.condo_fee || (unit as any).condo_fee || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            <div className="mt-auto">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Interessados Prioritários</h3>
              <div className="space-y-2 mb-6">
                {loadingLeads ? (
                  <p className="text-[10px] text-slate-400 animate-pulse">Carregando interessados...</p>
                ) : primaryInterested ? (
                  <>
                    <div className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg shadow-sm ring-1 ring-emerald-500/20">
                      <div className="w-8 h-8 rounded-full bg-[#1B2B48] text-white flex items-center justify-center text-[10px] font-bold">
                        {(primaryInterested.nome_completo || "").split(" ").map(n => n[0]).join("")}
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-bold text-[#1B2B48]">{primaryInterested.nome_completo}</p>
                        <p className="text-[9px] text-slate-400 font-medium uppercase tracking-tighter">{primaryInterested.posto_graduacao}</p>
                      </div>
                      <div className="text-right flex items-center gap-3">
                        <p className="text-[10px] font-black text-emerald-600">OPÇÃO 1</p>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleRemoveInterest(primaryInterested); }}
                          className="p-1.5 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-md transition-colors"
                          title="Remover Reserva"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    {waitlist.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Lista Reserva</h4>
                        <div className="space-y-1">
                          {waitlist.map(p => (
                            <div key={p.id} className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-100 rounded-md">
                              <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-[8px] font-bold text-slate-600">
                                {(p.nome_completo || "").split(" ").map(n => n[0]).join("")}
                              </div>
                              <span className="text-[10px] font-medium text-slate-600 truncate">{p.nome_completo}</span>
                              <div className="ml-auto flex items-center gap-2">
                                <span className="text-[8px] font-bold text-amber-600 uppercase">OPÇÃO 2</span>
                                <button
                                  onClick={(e) => { e.stopPropagation(); handleRemoveInterest(p); }}
                                  className="p-1 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-md transition-colors"
                                  title="Remover da Fila"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-[10px] text-slate-400 italic">Nenhum interessado para esta unidade.</p>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* LIGHTBOX for zoomed image */}
      <AnimatePresence>
        {lightboxOpen && humanizedPlan && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLightboxOpen(false)}
              className="absolute inset-0 bg-black/70 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-[90vw] h-[90vh] flex items-center justify-center"
            >
              <img
                src={humanizedPlan}
                alt="Planta Ampliada"
                className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
                referrerPolicy="no-referrer"
              />
              <button
                onClick={() => setLightboxOpen(false)}
                className="absolute top-4 right-4 p-3 bg-white/90 backdrop-blur-md rounded-full text-slate-700 hover:text-[#1B2B48] hover:bg-white border border-slate-200 transition-all shadow-lg"
              >
                <X size={28} />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
