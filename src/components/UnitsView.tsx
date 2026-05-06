import { useState, useEffect, useMemo } from "react";
import {
  ChevronRight,
  Download,
  Plus,
  Building,
  Building2,
  Users,
  Landmark,
  Search,
  Filter,
  ChevronLeft,
  Loader2,
  Map,
  Eye,
  ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "../lib/supabase";
import { Unit } from "../types";

interface UnitsViewProps {
  onSelectUnit: (unit: Unit) => void;
}

export function UnitsView({ onSelectUnit }: UnitsViewProps) {
  const [units, setUnits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterFloor, setFilterFloor] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [expandedFloors, setExpandedFloors] = useState<Set<number>>(new Set());
  const [counts, setCounts] = useState({
    total: 0,
    available: 0,
    waitingList: 0,
    totalValue: 0
  });

  useEffect(() => {
    fetchUnits();

    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'units' },
        (payload) => {
          fetchUnits();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchUnits() {
    try {
      setLoading(true);
      const { data: unitsData, error: unitsErr } = await supabase
        .from('units')
        .select('*')
        .order('id', { ascending: true });

      if (unitsErr) throw unitsErr;

      // Fetch waiting list count (leads with an active Opção 2)
      const { count: waitingCount } = await supabase
        .from('leads')
        .select('*', { count: 'exact', head: true })
        .not('opcao_2', 'is', null);

      if (unitsData) {
        setUnits(unitsData);
        const total = unitsData.length;
        const available = unitsData.filter(u => u.status === 'Livre').length;
        const totalValue = unitsData.reduce((acc, u) => acc + Number(u.value), 0);

        setCounts({
          total,
          available,
          waitingList: waitingCount || 0,
          totalValue
        });

        const floors = new Set(unitsData.map((u: any) => Number(u.floor)));
        setExpandedFloors(floors);
      }
    } catch (err) {
      console.error('Error fetching units:', err);
    } finally {
      setLoading(false);
    }
  }

  function toggleFloor(floor: number) {
    setExpandedFloors(prev => {
      const next = new Set(prev);
      if (next.has(floor)) {
        next.delete(floor);
      } else {
        next.add(floor);
      }
      return next;
    });
  }

  // Filter & group units by floor
  const filteredUnits = useMemo(() => {
    return units.filter(u => {
      if (filterFloor !== "" && u.floor.toString() !== filterFloor) return false;
      if (filterStatus !== "" && u.status !== filterStatus) return false;
      return true;
    });
  }, [units, filterFloor, filterStatus]);

  const groupedByFloor = useMemo(() => {
    const groups: Record<number, any[]> = {};
    filteredUnits.forEach(u => {
      const floor = Number(u.floor);
      if (!groups[floor]) groups[floor] = [];
      groups[floor].push(u);
    });
    return Object.entries(groups)
      .map(([floor, units]) => ({ floor: Number(floor), units }))
      .sort((a, b) => a.floor - b.floor);
  }, [filteredUnits]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <nav className="flex items-center gap-2 text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-widest">
            <span>Início</span>
            <ChevronRight size={12} />
            <span className="text-[#1B2B48]">Unidades Habitacionais</span>
          </nav>
          <h1 className="text-3xl font-bold text-[#1B2B48] tracking-tight">Controle de Unidades</h1>
          <p className="text-slate-500 mt-1">Gestão detalhada do inventário imobiliário e fila de interessados.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors text-slate-700">
            <Download size={16} /> Exportar Excel
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#1B2B48] text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">
            <Plus size={16} /> Nova Unidade
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total de Unidades", val: loading ? "..." : counts.total.toString(), change: "+0%", color: "text-blue-600", bg: "bg-blue-50", icon: Building },
          { label: "Disponíveis", val: loading ? "..." : counts.available.toString(), change: "Estável", color: "text-slate-400", bg: "bg-orange-50", icon: Building2 },
          { label: "Fila de Espera", val: counts.waitingList.toString(), change: "+0", color: "text-green-600", bg: "bg-purple-50", icon: Users },
          { label: "Valor Patrimonial", val: loading ? "..." : `R$ ${(counts.totalValue / 1000000).toFixed(1)}M`, change: "Real", color: "text-slate-400", bg: "bg-green-50", icon: Landmark },
        ].map((m) => (
          <div key={m.label} className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <span className={cn("p-2 rounded", m.bg)}>
                <m.icon size={16} />
              </span>
              <span className={cn("text-[10px] font-bold flex items-center gap-0.5", m.color)}>
                {m.change}
              </span>
            </div>
            <h3 className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{m.label}</h3>
            <p className="text-xl font-bold text-[#1B2B48]">{m.val}</p>
          </div>
        ))}
      </div>

      {/* Generic Floor Plan Map */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8 flex flex-col items-center group overflow-hidden relative">
        <div className="w-full flex items-center justify-between mb-6">
          <h2 className="text-xl font-black text-[#1B2B48] uppercase tracking-tight flex items-center gap-3">
            <Map className="text-emerald-500" size={24} />
            Mapa do Pavimento Tipo
          </h2>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full">Referência de Colunas e Orientação</span>
        </div>
        <div className="w-full relative rounded-2xl overflow-hidden bg-[#F8FAFC] border border-slate-100 flex items-center justify-center p-4">
          <img
            src="/pavimento-tipo.png"
            alt="Planta Humanizada Genérica"
            className="w-full max-h-[500px] object-contain transition-transform duration-700 group-hover:scale-[1.02]"
          />
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-100 flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[300px] relative">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Filtrar por Coluna, Andar ou Interessado..."
              className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#1B2B48]"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterFloor}
              onChange={(e) => setFilterFloor(e.target.value)}
              className="py-2 pl-3 pr-8 text-sm border border-slate-200 rounded-lg bg-slate-50 outline-none focus:ring-2 focus:ring-[#1B2B48]"
            >
              <option value="">Todos os Andares</option>
              <option value="1">1º Andar</option>
              <option value="2">2º Andar</option>
              <option value="3">3º Andar</option>
              <option value="4">4º Andar</option>
              <option value="5">5º Andar</option>
              <option value="6">6º Andar</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="py-2 pl-3 pr-8 text-sm border border-slate-200 rounded-lg bg-slate-50 outline-none focus:ring-2 focus:ring-[#1B2B48]"
            >
              <option value="">Todos os Status</option>
              <option value="Livre">Livre</option>
              <option value="Reservado">Reservado</option>
              <option value="Ocupado">Ocupado</option>
            </select>
            <button onClick={fetchUnits} className="p-2 border border-slate-200 rounded-lg text-slate-400 hover:bg-slate-50">
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Filter size={18} />}
            </button>
          </div>
        </div>

        <div className="overflow-x-auto min-h-[400px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center p-20 gap-4">
              <Loader2 size={40} className="text-[#1B2B48] animate-spin" />
              <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Carregando Unidades...</p>
            </div>
          ) : (
            <table className="w-full text-left font-sans text-xs">
              <thead className="bg-[#F8FAFC] border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Unidade</th>
                  <th className="px-6 py-4">Apto</th>
                  <th className="px-6 py-4">M2</th>
                  <th className="px-6 py-4">Valor Venal (R$)</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">CCCPM</th>
                  <th className="px-6 py-4">Interessados</th>
                  <th className="px-6 py-4 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {groupedByFloor.map(({ floor, units: floorUnits }) => (
                  <>
                    {/* Floor Group Header */}
                    <tr
                      key={`floor-${floor}`}
                      onClick={() => toggleFloor(floor)}
                      className="bg-[#F0F4F8] hover:bg-[#E8EDF2] transition-colors cursor-pointer select-none"
                    >
                      <td colSpan={8} className="px-6 py-3">
                        <div className="flex items-center gap-3">
                          <ChevronDown
                            size={16}
                            className={cn(
                              "text-[#1B2B48] transition-transform duration-200",
                              !expandedFloors.has(floor) && "-rotate-90"
                            )}
                          />
                          <span className="text-xs font-black text-[#1B2B48] uppercase tracking-widest">
                            {floor}º Andar
                          </span>
                          <span className="text-[10px] font-bold text-slate-400 bg-white px-2 py-0.5 rounded-full">
                            {floorUnits.length} {floorUnits.length === 1 ? "unidade" : "unidades"}
                          </span>
                        </div>
                      </td>
                    </tr>
                    {/* Floor Units */}
                    {expandedFloors.has(floor) && floorUnits.map((unit) => {
                      const isCCCPMEligible = Number(unit.value) < 2500000;
                      return (
                        <tr
                          key={unit.id}
                          onClick={() => onSelectUnit(unit)}
                          className="hover:bg-slate-50 transition-colors group cursor-pointer"
                        >
                          <td className="px-6 py-4 font-bold text-[#1B2B48]">Coluna {unit.column}</td>
                          <td className="px-6 py-4 text-slate-600">{unit.id}</td>
                          <td className="px-6 py-4 text-slate-600">{unit.area} m²</td>
                          <td className="px-6 py-4 font-bold text-[#1B2B48]">R$ {Number(unit.value).toLocaleString("pt-BR")}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <span className={cn(
                                "w-2 h-2 rounded-full",
                                unit.status === "Livre" ? "bg-green-500" : unit.status === "Reservado" ? "bg-amber-500" : unit.status === "Ocupado" ? "bg-red-500" : "bg-slate-400"
                              )}></span>
                              <span className="font-medium text-slate-700">{unit.status}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={cn(
                              "px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider",
                              isCCCPMEligible ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
                            )}>
                              {isCCCPMEligible ? "Elegível" : "Não Elegível"}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-[#1B2B48]">{unit.interested_count || 0}</span>
                              <div className="flex -space-x-2">
                                {unit.interested_count > 0 && <div className="w-6 h-6 rounded-full border border-white bg-slate-200 text-[8px] flex items-center justify-center font-bold">...</div>}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onSelectUnit(unit);
                              }}
                              className="text-slate-300 hover:text-[#1B2B48] transition-colors"
                            >
                              <Eye size={18} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className="px-6 py-4 bg-[#F8FAFC] border-t border-slate-200 flex items-center justify-between">
          <p className="text-[10px] text-slate-500 font-medium">Mostrando <span className="font-bold">{filteredUnits.length}</span> de <span className="font-bold">{units.length}</span> unidades</p>
          <div className="flex items-center gap-2">
            <button className="w-8 h-8 flex items-center justify-center border border-slate-200 rounded text-slate-400 disabled:opacity-30"><ChevronLeft size={16} /></button>
            <button className="w-8 h-8 flex items-center justify-center bg-[#1B2B48] text-white rounded font-bold text-xs">1</button>
            <button className="w-8 h-8 flex items-center justify-center border border-slate-200 rounded text-slate-600"><ChevronRight size={16} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}
