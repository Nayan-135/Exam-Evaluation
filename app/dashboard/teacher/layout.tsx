"use client";
import { useEffect, useState, createContext, useContext } from "react";
import { supabase } from "@/lib/supabase";
import DashboardHeader from "@/components/layout/DashboardHeader";
import TeacherSidebar from "@/components/layout/TeacherSidebar";
import { CreateClassModal } from "@/components/classroom/CreateClassModal";

const TeacherContext = createContext<{ syncUI: () => Promise<void> }>({ syncUI: async () => {} });
export const useTeacherEnv = () => useContext(TeacherContext);

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState({ name: "Faculty Core", role: "TEACHER" });
  const [sidebarClasses, setSidebarClasses] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Unified global state to track and control the sliding effect on the teacher side
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const fetchSyncData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: userProfile } = await supabase.from("users").select("first_name, last_name, role").eq("id", user.id).single();
    if (userProfile) {
      setProfile({ name: `${userProfile.first_name} ${userProfile.last_name}`, role: userProfile.role });
    }

    const { data: sideClasses } = await supabase.from("classes").select("id, class_name").eq("teacher_id", user.id).order("created_at", { ascending: false });
    if (sideClasses) setSidebarClasses(sideClasses);
    setLoading(false);
  };

  useEffect(() => { fetchSyncData(); }, []);

  if (loading) {
    return (
      <div className="h-screen w-screen flex flex-col gap-3 items-center justify-center bg-background text-xs font-mono text-muted animate-pulse">
         Synchronizing Secure Architecture Subsystems...
      </div>
    );
  }

  return (
    <TeacherContext.Provider value={{ syncUI: fetchSyncData }}>
      <div className="flex flex-col h-screen overflow-hidden bg-background">
        
        {/* Linked with state hooks to inject the sliding menu action button */}
        <DashboardHeader 
          name={profile.name} 
          role={profile.role} 
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
        
        <div className="flex flex-1 overflow-hidden h-[calc(100vh-64px)] w-full">
          {/* Linked with layout visibility variables to execute hardware shifts */}
          <TeacherSidebar 
            classes={sidebarClasses} 
            onCreateClass={() => setIsModalOpen(true)} 
            isCollapsed={isSidebarCollapsed}
          />
          
          <main className="flex-1 overflow-y-auto bg-background/40">
            {children}
          </main>
        </div>

        <CreateClassModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={fetchSyncData} 
        />
      </div>
    </TeacherContext.Provider>
  );
}