import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Building2,
  Users,
  GitBranch,
  BarChart3
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (t: string) => void;
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "units", label: "Unidades", icon: Building2 },
    { id: "clients", label: "Clientes", icon: Users },
    { id: "pipeline", label: "Pipeline", icon: GitBranch },
    { id: "reports", label: "Relatórios", icon: BarChart3 },
  ];

  return (
    <aside className="hidden md:flex flex-col h-screen fixed left-0 top-0 pt-20 bg-[#F8FAFC] border-r border-slate-200 w-64 z-30">
      <div className="px-6 mb-8">
        <h2 className="text-xl font-black text-[#1B2B48] font-sans uppercase tracking-wider">Gestão UH</h2>
        <p className="text-xs font-semibold text-slate-500 font-sans uppercase">Administração Central</p>
      </div>
      <nav className="flex flex-col gap-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "flex items-center gap-3 px-6 py-3 transition-all text-xs uppercase tracking-wider font-semibold font-sans text-left",
              activeTab === item.id
                ? "bg-white text-[#1B2B48] border-r-4 border-[#1B2B48] shadow-sm"
                : "text-slate-500 hover:bg-slate-200"
            )}
          >
            <item.icon size={18} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="mt-auto p-6">
        <div className="bg-[#1B2B48] p-4 rounded-lg text-white">
          <p className="text-[10px] opacity-80 mb-2 uppercase tracking-widest font-bold">Suporte Técnico</p>
          <p className="text-xs font-bold mb-3">Dúvidas sobre UH?</p>
          <button className="w-full bg-white text-[#1B2B48] text-[10px] py-2 rounded font-bold uppercase tracking-widest hover:bg-slate-100 transition-colors">
            Abrir Chamado
          </button>
        </div>
      </div>
    </aside>
  );
}
