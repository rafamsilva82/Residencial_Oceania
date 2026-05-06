/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import {
  Users,
  Plus
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { UNITS } from "./constants";
import { Unit } from "./types";
import { supabase } from "./lib/supabase";
import { Session } from "@supabase/supabase-js";
import { Toaster } from "react-hot-toast";

// --- Components ---
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { DashboardView } from "./components/DashboardView";
import { UnitsView } from "./components/UnitsView";
import { PipelineView } from "./components/PipelineView";
import { ReportsView } from "./components/ReportsView";
import { UnitModal } from "./components/UnitModal";
import { AddClientModal } from "./components/AddClientModal";
import { ClientsView } from "./components/ClientsView";
import { Auth } from "./components/Auth";

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const toggleAddClientModal = () => setIsAddClientModalOpen(!isAddClientModalOpen);

  if (!session) {
    return <Auth />;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="md:ml-64 flex flex-col min-h-screen">
        <Header activeTab={activeTab} />

        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto h-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                {activeTab === "dashboard" && <DashboardView />}
                {activeTab === "units" && (
                  <UnitsView onSelectUnit={setSelectedUnit} />
                )}
                {activeTab === "pipeline" && <PipelineView onAddClient={toggleAddClientModal} />}
                {activeTab === "reports" && <ReportsView />}
                {activeTab === "clients" && (
                  <ClientsView onAddClient={toggleAddClientModal} />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>

      <AnimatePresence>
        {selectedUnit && <UnitModal unit={selectedUnit} onClose={() => setSelectedUnit(null)} />}
      </AnimatePresence>

      <AnimatePresence>
        {isAddClientModalOpen && (
          <AddClientModal
            isOpen={isAddClientModalOpen}
            onClose={toggleAddClientModal}
          />
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleAddClientModal}
        className="fixed bottom-8 right-8 w-16 h-16 bg-[#1B2B48] text-white rounded-full shadow-2xl flex items-center justify-center z-50 hover:bg-[#2A3F65] transition-all group"
      >
        <Plus size={28} className="group-hover:rotate-90 transition-transform duration-300" />
      </motion.button>

      <Toaster position="top-right" />
    </div>
  );
}
