import { Search, Bell } from "lucide-react";
import { IMAGES } from "../constants";

interface HeaderProps {
  activeTab: string;
}

export function Header({ activeTab }: HeaderProps) {
  return (
    <header className="flex justify-between items-center w-full px-6 h-16 sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="flex items-center gap-8">
        <span className="text-lg font-bold text-[#1B2B48] font-sans tracking-tight">Gestão de Interessados UH</span>
        {/* Navigation items removed from here as per user request */}
      </div>
      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
          <input 
            type="text" 
            placeholder="Pesquisar..." 
            className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2B48] w-64 transition-all"
          />
        </div>
        <button className="relative p-2 rounded-full hover:bg-slate-50 transition-colors">
          <Bell size={20} className="text-slate-500" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>
        <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-200 cursor-pointer hover:ring-2 hover:ring-[#1B2B48] transition-all">
          <img src={IMAGES.avatar1} alt="User Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        </div>
      </div>
    </header>
  );
}
