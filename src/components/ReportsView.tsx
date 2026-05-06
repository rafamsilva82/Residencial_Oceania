import {
  Download,
  FileText,
  Users,
  TrendingUp,
  AlertTriangle,
  BarChart3
} from "lucide-react";
import { cn } from "@/lib/utils";

export function ReportsView() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#1B2B48] tracking-tight">Relatórios Estratégicos</h1>
          <p className="text-slate-500 mt-1">Gere e exporte dados analíticos da ocupação e demanda habitacional.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-[#1B2B48] text-[#1B2B48] font-bold rounded-lg text-sm hover:bg-slate-50 transition-colors">
            <Download size={16} /> Exportar Excel
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#1B2B48] text-white font-bold rounded-lg text-sm hover:opacity-90 transition-opacity">
            <FileText size={16} /> Gerar PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8 bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
          <h3 className="text-xl font-bold text-[#1B2B48] mb-6">Selecione o Modelo de Relatório</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { id: "r1", title: "Interessados por UH", desc: "Agrupamento detalhado por unidade habitacional e status de reserva.", icon: Users, checked: true },
              { id: "r2", title: "Ranking por Prioridade", desc: "Oficiais Generais > Ordem Inscrição > Pagamento à Vista.", icon: TrendingUp },
              { id: "r3", title: "Capacidade Insuficiente", desc: "Clientes com margem ou crédito abaixo do valor da UH pretendida.", icon: AlertTriangle },
              { id: "r4", title: "Distribuição por Círculo", desc: "Visão macro da distribuição hierárquica entre os interessados.", icon: BarChart3 },
            ].map((r) => (
              <label key={r.id} className={cn(
                "relative flex flex-col p-5 border rounded-xl hover:shadow-md cursor-pointer transition-all group",
                r.checked ? "border-[#1B2B48] bg-slate-50" : "border-slate-200"
              )}>
                <input type="radio" name="report" defaultChecked={r.checked} className="absolute right-5 top-5 text-[#1B2B48] focus:ring-[#1B2B48]" />
                <div className="flex items-center gap-3 mb-3">
                  <r.icon size={20} className={cn(r.checked ? "text-[#1B2B48]" : "text-slate-400")} />
                  <span className="font-bold text-[#1B2B48]">{r.title}</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed font-medium">{r.desc}</p>
              </label>
            ))}
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
          <h3 className="text-xl font-bold text-[#1B2B48] mb-6">Filtros Avançados</h3>
          <div className="space-y-6">
            <div>
              <label className="text-[10px] font-black text-slate-400 block mb-2 uppercase tracking-widest">Período de Inscrição</label>
              <div className="flex gap-2">
                <input type="date" className="flex-1 text-xs border-slate-200 rounded-lg focus:ring-[#1B2B48] p-2" />
                <input type="date" className="flex-1 text-xs border-slate-200 rounded-lg focus:ring-[#1B2B48] p-2" />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 block mb-2 uppercase tracking-widest">Janela de Visitação</label>
              <select className="w-full text-xs border-slate-200 rounded-lg focus:ring-[#1B2B48] p-2 bg-white">
                <option>Próximos 30 dias</option>
                <option>Últimos 15 dias</option>
                <option>Período customizado</option>
              </select>
            </div>
            <button className="w-full bg-[#1B2B48]/5 text-[#1B2B48] font-black py-3 rounded-xl text-[10px] hover:bg-[#1B2B48]/10 transition-colors uppercase tracking-widest border border-transparent hover:border-[#1B2B48]/20">
              Aplicar Filtros
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-md overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-[#F8FAFC]">
          <h2 className="text-xl font-bold text-[#1B2B48]">Visualização Prévia: Ranking por Prioridade</h2>
          <span className="bg-[#1B2B48] text-white text-[9px] font-black px-2 py-1 rounded uppercase tracking-[0.2em] shadow-sm">Tempo Real</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <tr>
                <th className="px-8 py-4">Posição</th>
                <th className="px-8 py-4">Interessado</th>
                <th className="px-8 py-4">UH Pretendida</th>
                <th className="px-8 py-4">Critério</th>
                <th className="px-8 py-4">Data</th>
                <th className="px-8 py-4 text-right">Análise</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {[
                { pos: "01º", name: "Gen. Div Ricardo Fontes", sub: "Oficial General", unit: "Bloco C - Apto 402", crit: "Prioridade A", date: "12/05/24", res: "Suficiente", resCol: "text-green-600" },
                { pos: "02º", name: "Cel. Antonio Macedo", sub: "Oficial Superior", unit: "Bloco A - Apto 101", crit: "Inscrição", date: "14/05/24", res: "Suficiente", resCol: "text-green-600" },
                { pos: "03º", name: "Maj. Luísa Mendes", sub: "Oficial Superior", unit: "Bloco B - Apto 305", crit: "Inscrição", date: "15/05/24", res: "Em Análise", resCol: "text-amber-600" },
                { pos: "04º", name: "Cap. Marcos Oliveira", sub: "Oficial Intermediário", unit: "Bloco C - Apto 202", crit: "À Vista", date: "16/05/24", res: "Crítico", resCol: "text-red-600" }
              ].map((row, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-8 py-5 font-black text-[#1B2B48]">{row.pos}</td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"></div>
                      <div>
                        <p className="font-bold text-sm text-[#1B2B48]">{row.name}</p>
                        <p className="text-[10px] text-slate-400 font-medium">{row.sub}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-xs text-slate-600 font-medium">{row.unit}</td>
                  <td className="px-8 py-5">
                    <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-[9px] font-black uppercase tracking-tighter">{row.crit}</span>
                  </td>
                  <td className="px-8 py-5 text-xs text-slate-500 font-mono">{row.date}</td>
                  <td className={cn("px-8 py-5 text-right font-black text-xs uppercase tracking-tighter", row.resCol)}>{row.res}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
