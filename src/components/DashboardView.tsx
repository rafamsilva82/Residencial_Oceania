import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Users,
  Building2,
  ShieldCheck,
  Landmark,
  Filter,
  Download,
  MoreHorizontal,
  FileText,
  ArrowUp,
  ArrowDown,
  ChevronRight,
  AlertTriangle,
  CreditCard,
  Clock,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { IMAGES } from "../constants";
import { supabase } from "../lib/supabase";

export function DashboardView() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalLeads: 0,
    availableUnits: 0,
    qualifiedLeads: 0,
    totalVolume: 0,
    funnel: [
      { label: "CADASTRO", val: 0, color: "bg-[#1B2B48]" },
      { label: "CONTATO", val: 0, color: "bg-[#2A3F65]" },
      { label: "VISITA", val: 0, color: "bg-[#3D5A91]" },
      { label: "PROPOSTA", val: 0, color: "bg-[#5F7DBB]" },
      { label: "FECHADO", val: 0, color: "bg-[#8BA3D5]" },
    ],
    hierarchy: [
      { label: "Oficiais Gen.", color: "bg-[#1B2B48]", val: 0, perc: 0 },
      { label: "Oficiais Sup.", color: "bg-[#3D5A91]", val: 0, perc: 0 },
      { label: "Oficiais Sub.", color: "bg-[#5F7DBB]", val: 0, perc: 0 },
      { label: "Outros", color: "bg-slate-200", val: 0, perc: 0 },
    ],
    financial: {
      under15: { total: 0, apto: 0, analise: 0 },
      above15: { total: 0, apto: 0, analise: 0 }
    }
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const parseCurrency = (val: string | null): number => {
    if (!val) return 0;
    const clean = val.replace(/[R$\s.]/g, '').replace(',', '.');
    return parseFloat(clean) || 0;
  };

  async function fetchStats() {
    try {
      setLoading(true);

      const { data: leads, error: leadsErr } = await supabase.from('leads').select('*');
      if (leadsErr) throw leadsErr;

      const { count: availableUnits } = await supabase
        .from('units')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'Livre');

      const totalLeads = leads?.length || 0;
      let totalVolume = 0;
      let qualifiedLeadsCount = 0;

      // Funnel counters
      const funnelCounts = {
        cadastro: 0,
        contato: 0,
        visita: 0,
        proposta: 0,
        fechado: 0
      };

      // Hierarchy counters
      const hierarchyCounts = { gen: 0, sup: 0, sub: 0, others: 0 };

      // Financial segments
      const financial = {
        under15: { total: 0, apto: 0, analise: 0 },
        above15: { total: 0, apto: 0, analise: 0 }
      };

      leads?.forEach(lead => {
        // Volume & Qualification
        const val1 = parseCurrency(lead.capacidade_financeira_ate);
        const val2 = parseCurrency(lead.capacidade_financeira);
        const maxVal = Math.max(val1, val2);
        totalVolume += maxVal;
        if (maxVal > 0) qualifiedLeadsCount++;

        // Funnel Mapping
        const status = (lead.situacao_lead || '').toUpperCase();
        funnelCounts.cadastro++; // Everyone is registered
        if (status.includes('CONTATO') || status.includes('EMAIL')) funnelCounts.contato++;
        if (status.includes('VISITA') || status.includes('VISITOU')) funnelCounts.visita++;
        if (status.includes('PROPOSTA') || status.includes('APROVADO')) funnelCounts.proposta++;
        if (status.includes('FECHADO') || status.includes('TITULAR')) funnelCounts.fechado++;

        // Hierarchy Mapping
        const circulo = (lead.circulo_hierarquico || '').toUpperCase();
        if (circulo.includes('GENERAL')) hierarchyCounts.gen++;
        else if (circulo.includes('SUPERIOR')) hierarchyCounts.sup++;
        else if (circulo.includes('SUBALTERNO') || circulo.includes('INTERMEDIÁRIO')) hierarchyCounts.sub++;
        else hierarchyCounts.others++;

        // Financial Segmentation
        const isAbove = maxVal > 1500000;
        const target = isAbove ? financial.above15 : financial.under15;
        target.total++;
        if (lead.analise_documental === 'Aprovado') target.apto++;
        else target.analise++;
      });

      const getPerc = (val: number) => totalLeads > 0 ? (val / totalLeads) * 100 : 0;

      setStats({
        totalLeads,
        availableUnits: availableUnits || 0,
        qualifiedLeads: qualifiedLeadsCount,
        totalVolume,
        funnel: [
          { label: "CADASTRO", val: funnelCounts.cadastro, color: "bg-[#1B2B48]" },
          { label: "CONTATO", val: funnelCounts.contato, color: "bg-[#2A3F65]" },
          { label: "VISITA", val: funnelCounts.visita, color: "bg-[#3D5A91]" },
          { label: "PROPOSTA", val: funnelCounts.proposta, color: "bg-[#5F7DBB]" },
          { label: "FECHADO", val: funnelCounts.fechado, color: "bg-[#8BA3D5]" },
        ],
        hierarchy: [
          { label: "Oficiais Gen.", color: "bg-[#1B2B48]", val: hierarchyCounts.gen, perc: getPerc(hierarchyCounts.gen) },
          { label: "Oficiais Sup.", color: "bg-[#3D5A91]", val: hierarchyCounts.sup, perc: getPerc(hierarchyCounts.sup) },
          { label: "Oficiais Sub.", color: "bg-[#5F7DBB]", val: hierarchyCounts.sub, perc: getPerc(hierarchyCounts.sub) },
          { label: "Outros", color: "bg-slate-200", val: hierarchyCounts.others, perc: getPerc(hierarchyCounts.others) },
        ],
        financial
      });
    } catch (err) {
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  }

  const metrics = [
    { label: "TOTAL DE INTERESSADOS", value: stats.totalLeads.toString(), change: loading ? "..." : "+0%", changeType: "info" as const, sub: "vs. mês anterior", icon: Users },
    { label: "UNIDADES DISPONÍVEIS", value: stats.availableUnits.toString(), change: loading ? "..." : "Ocupação: " + (100 - (stats.availableUnits / 66 * 100)).toFixed(0) + "%", changeType: "down" as const, sub: "Status Real", icon: Building2 },
    { label: "INTERESSADOS APTOS", value: stats.qualifiedLeads.toString(), change: loading ? "..." : "Aguardando", changeType: "info" as const, sub: `(${(stats.totalLeads > 0 ? (stats.qualifiedLeads / stats.totalLeads * 100).toFixed(0) : 0)}% do total)`, icon: ShieldCheck },
    { label: "VOL. EM NEGOCIAÇÃO", value: loading ? "..." : `R$ ${(stats.totalVolume / 1000000).toFixed(1)}M`, change: "Estimado", changeType: "up" as const, sub: "baseado na cap. financeira", icon: Landmark },
  ];



  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#1B2B48] tracking-tight">Painel de Gestão Estratégica</h1>
          <p className="text-slate-500 mt-1">Consolidado institucional de unidades habitacionais e pipeline de interessados.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={fetchStats} className="bg-white border border-slate-200 px-4 py-2 text-sm font-semibold rounded hover:bg-slate-50 transition-colors flex items-center gap-2 text-slate-700">
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Filter size={14} />} {loading ? 'Atualizando...' : 'Recarregar Dados'}
          </button>
          <button className="bg-[#1B2B48] text-white px-4 py-2 text-sm font-semibold rounded hover:bg-[#2A3F65] transition-colors flex items-center gap-2">
            <Download size={14} /> Exportar Relatório
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 overflow-hidden rounded-2xl shadow-xl relative group">
          <img
            src="/oceania-building.jpg"
            alt="Empreendimento Oceania"
            className="w-full h-[400px] object-cover transition-transform duration-700 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1B2B48]/90 via-transparent to-transparent flex flex-col justify-end p-8 text-white">
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-emerald-500 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest">Em Construção</span>
              <span className="bg-white/20 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest">SMU - Brasília/DF</span>
            </div>
            <h2 className="text-4xl font-black uppercase tracking-tight mb-2">Residencial Oceania</h2>
            <p className="text-white/70 max-w-xl text-sm font-medium leading-relaxed">
              Empreendimento estratégico destinado aos Militares da Marinha do Brasil.
              Localização privilegiada com infraestrutura completa de segurança e lazer institucional.
            </p>
            <div className="mt-6 flex gap-8 border-t border-white/20 pt-6">
              <div>
                <p className="text-[10px] font-bold opacity-60 uppercase mb-1">Entrega Prevista</p>
                <p className="font-bold">Outubro / 2026</p>
              </div>
              <div>
                <p className="text-[10px] font-bold opacity-60 uppercase mb-1">Unidades Totais</p>
                <p className="font-bold">66 Apartamentos</p>
              </div>
              <div>
                <p className="text-[10px] font-bold opacity-60 uppercase mb-1">Gestor Responsável</p>
                <p className="font-bold text-[10px]">Caixa de Construções de Casas para o Pessoal da Marinha</p>
              </div>
            </div>
          </div>
          <button className="absolute top-6 right-6 p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-white hover:text-[#1B2B48] transition-all">
            <MoreHorizontal size={24} />
          </button>
        </div>

        <div className="lg:col-span-4 grid grid-rows-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="text-xl font-bold text-[#1B2B48] mb-1">Tour Virtual 360º</h3>
              <p className="text-xs text-slate-500 mb-4 font-medium uppercase tracking-tight">Ver unidade decorada</p>
              <button className="bg-[#1B2B48] text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity">
                Iniciar Tour
              </button>
            </div>
            <img
              src={IMAGES.floorPlan1}
              alt="Planta Decorada"
              className="absolute -right-4 -bottom-4 w-40 h-40 object-cover rounded-full opacity-10 group-hover:opacity-20 transition-opacity rotate-12"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="bg-[#1B2B48] border border-white/10 rounded-2xl p-6 shadow-sm flex flex-col justify-between text-white relative overflow-hidden">
            <div className="relative z-10">
              <div className="bg-white/10 p-2 w-fit rounded-lg mb-4">
                <FileText size={20} />
              </div>
              <h3 className="text-xl font-bold mb-1">Editais e Atos</h3>
              <p className="text-xs text-white/60 font-medium">Confira as últimas publicações oficiais sobre a gestão das UH.</p>
            </div>
            <button className="relative z-10 w-full mt-4 py-2 bg-white text-[#1B2B48] rounded text-xs font-black uppercase tracking-widest hover:bg-slate-100">
              Acessar Biblioteca
            </button>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, i) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={metric.label}
            className="bg-white p-6 border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{metric.label}</span>
              <metric.icon size={20} className="text-[#1B2B48]" />
            </div>
            <h2 className="text-3xl font-bold text-[#1B2B48]">{metric.value}</h2>
            <div className="mt-4 flex items-center gap-2 text-xs">
              <span className={cn(
                "font-bold flex items-center gap-0.5",
                metric.changeType === "up" ? "text-green-600" : metric.changeType === "down" ? "text-red-600" : "text-blue-600"
              )}>
                {metric.changeType === "up" && <ArrowUp size={12} />}
                {metric.changeType === "down" && <ArrowDown size={12} />}
                {metric.change}
              </span>
              <span className="text-slate-400 italic">{metric.sub}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white p-6 border border-slate-200 rounded-xl shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold text-[#1B2B48]">Funil de Conversão</h3>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Fluxo de Interessados</span>
          </div>
          <div className="space-y-4">
            {stats.funnel.map((step, i) => (
              <div key={step.label} className="flex items-center">
                <div className="w-32 text-right pr-4 text-[10px] font-bold text-slate-400">{step.label}</div>
                <div
                  className={cn("flex-1 h-12 rounded-l-lg flex items-center px-4 justify-between transition-all hover:brightness-110 cursor-default", step.color)}
                  style={{ width: (stats.totalLeads > 0 ? `${(step.val / stats.totalLeads * 100)}%` : '0%'), minWidth: '40px' }}
                >
                  <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
                    <motion.div
                      key={step.val}
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 1, delay: i * 0.1 }}
                      className="bg-white/40 h-full"
                    />
                  </div>
                  <span className="text-white font-bold ml-4">{step.val}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 bg-white p-6 border border-slate-200 rounded-xl shadow-sm flex flex-col">
          <h3 className="text-xl font-bold text-[#1B2B48] mb-6">Círculo Hierárquico</h3>
          <div className="flex-1 flex flex-col justify-center items-center">
            <div className="relative w-48 h-48 rounded-full border-[16px] border-slate-50 flex items-center justify-center">
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                {/* Circumference is approx 502 (2 * PI * 80) */}
                <circle 
                  cx="96" cy="96" r="80" fill="none" stroke="#1B2B48" strokeWidth="16" 
                  strokeDasharray="502" 
                  strokeDashoffset={502 - (502 * (stats.hierarchy[0]?.perc || 0) / 100)} 
                  className="transition-all duration-1000"
                />
                <circle 
                  cx="96" cy="96" r="80" fill="none" stroke="#3D5A91" strokeWidth="16" 
                  strokeDasharray="502" 
                  strokeDashoffset={502 - (502 * (stats.hierarchy[1]?.perc || 0) / 100)} 
                  transform={`rotate(${(stats.hierarchy[0]?.perc || 0) * 3.6}, 96, 96)`}
                  className="transition-all duration-1000"
                />
                <circle 
                  cx="96" cy="96" r="80" fill="none" stroke="#5F7DBB" strokeWidth="16" 
                  strokeDasharray="502" 
                  strokeDashoffset={502 - (502 * (stats.hierarchy[2]?.perc || 0) / 100)} 
                  transform={`rotate(${((stats.hierarchy[0]?.perc || 0) + (stats.hierarchy[1]?.perc || 0)) * 3.6}, 96, 96)`}
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="text-center bg-white rounded-full w-32 h-32 flex flex-col items-center justify-center shadow-inner z-10">
                <span className="block text-3xl font-bold text-[#1B2B48] tracking-tight">{stats.totalLeads > 0 ? '100%' : '0%'}</span>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Distribuição</span>
              </div>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-4 w-full">
              {stats.hierarchy.map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <div className={cn("w-2 h-2 rounded-full", item.color)}></div>
                  <span className="text-[10px] font-semibold text-slate-600 truncate">{item.label}</span>
                  <span className="text-[10px] text-slate-400 ml-auto font-bold">{item.perc.toFixed(0)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white p-6 border border-slate-200 rounded-xl shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-[#1B2B48]">Capacidade de Financiamento</h3>
            <div className="flex gap-4">
              <span className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest"><div className="w-2 h-2 bg-[#1B2B48] rounded-sm"></div> Aptos</span>
              <span className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest"><div className="w-2 h-2 bg-slate-200 rounded-sm"></div> Em Análise</span>
            </div>
          </div>
          <div className="space-y-8 py-4">
            {[
              { label: "Até R$ 1.5M", data: stats.financial.under15 },
              { label: "Acima de R$ 1.5M", data: stats.financial.above15 },
            ].map((bar) => (
              <div key={bar.label}>
                <div className="flex justify-between text-xs font-bold mb-2 uppercase tracking-tight">
                  <span className="text-slate-500">{bar.label}</span>
                  <span className="text-[#1B2B48]">{bar.data.total} Interessados</span>
                </div>
                <div className="h-6 w-full bg-slate-100 flex rounded overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: bar.data.total > 0 ? `${(bar.data.apto / bar.data.total * 100)}%` : '0%' }}
                    transition={{ duration: 1.2 }}
                    className="bg-[#1B2B48] h-full"
                  />
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: bar.data.total > 0 ? `${(bar.data.analise / bar.data.total * 100)}%` : '0%' }}
                    transition={{ duration: 1.2, delay: 0.2 }}
                    className="bg-slate-300 h-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 bg-[#F8FAFC]">
            <h3 className="text-lg font-bold text-[#1B2B48] flex items-center gap-2">
              <AlertTriangle size={18} className="text-red-500" /> Alertas de Atenção
            </h3>
          </div>
          <div className="flex-1 divide-y divide-slate-100">
            {[
              { title: "Documentação Pendente", desc: `${stats.qualifiedLeads} interessados aptos com certidões vencidas no dossiê habitacional.`, hide: stats.totalLeads === 0, type: "CRÍTICO", color: "bg-red-50 text-red-700", icon: FileText },
              { title: "Capacidade Insuficiente", desc: "Verifique as margens consignáveis dos novos interessados.", type: "ATENÇÃO", color: "bg-amber-50 text-amber-700", icon: CreditCard },
              { title: "Prazos de Reserva", desc: "Acompanhe as unidades com reserva prestes a expirar.", type: "INFO", color: "bg-blue-50 text-blue-700", icon: Clock },
            ].filter(a => !a.hide).map((alert) => (
              <div key={alert.title} className="p-4 flex gap-4 hover:bg-slate-50 transition-colors group cursor-pointer">
                <div className={cn("w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0", alert.color)}>
                  <alert.icon size={18} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <p className="text-sm font-bold text-[#1B2B48]">{alert.title}</p>
                    <span className={cn("text-[9px] font-black px-1.5 py-0.5 rounded tracking-tighter", alert.color)}>{alert.type}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{alert.desc}</p>
                </div>
                <ChevronRight size={16} className="text-slate-300 group-hover:text-slate-500 transition-colors self-center" />
              </div>
            ))}
            {stats.totalLeads === 0 && (
              <div className="flex-1 flex items-center justify-center p-8 text-center text-slate-400 font-bold uppercase text-[10px] tracking-widest">
                Sem alertas ativos no momento
              </div>
            )}
          </div>
          <div className="p-4 bg-slate-50 text-center border-t border-slate-100 mt-auto">
            <button className="text-[10px] font-bold text-[#1B2B48] hover:underline uppercase tracking-widest">Ver todos os alertas</button>
          </div>
        </div>
      </div>
    </div>
  );
}
