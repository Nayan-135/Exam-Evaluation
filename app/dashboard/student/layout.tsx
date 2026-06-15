"use client";
import { useEffect, useState, createContext, useContext } from "react";
import { supabase } from "@/lib/supabase";
import DashboardHeader from "@/components/layout/DashboardHeader";
import StudentSidebar from "@/components/layout/StudentSidebar";
import { JoinClassModal } from "@/components/classroom/JoinClassModal";

// Create context to allow child views to trigger sidebar mutations safely
const StudentDashboardContext = createContext<{ refreshSidebar: () => Promise<void> }>({
  refreshSidebar: async () => {},
});

export const useStudentDashboard = () => useContext(StudentDashboardContext);

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const [userProfile, setUserProfile] = useState<{ name: string; role: string } | null>(null);
  const [joinedClasses, setJoinedClasses] = useState<any[]>([]);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchSidebarData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Fetch Profile
    const { data: profile } = await supabase
      .from("users")
      .select("first_name, last_name, role")
      .eq("id", user.id)
      .single();

    if (profile) {
      setUserProfile({
        name: `${profile.first_name} ${profile.last_name}`,
        role: profile.role,
      });
    }

    // Fetch Enrolled Classes [cite: 21]
    const { data: enrollmentData } = await supabase
      .from("class_members")
      .select(`classes(id, name)`)
      .eq("student_id", user.id);

    if (enrollmentData) {
      const formattedClasses = enrollmentData.map((e: any) => ({
        id: e.classes?.id,
        class_name: e.classes?.name || "Unnamed Class",
      }));
      setJoinedClasses(formattedClasses);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSidebarData();
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background text-muted text-xs font-mono animate-pulse">
        Initializing Secure Student Environment Vectors...
      </div>
    );
  }

  return (
    <StudentDashboardContext.Provider value={{ refreshSidebar: fetchSidebarData }}>
      <div className="flex flex-col h-screen overflow-hidden bg-background">
        {/* Unified Top Navigation */}
        <DashboardHeader 
          name={userProfile?.name || "Student Core"} 
          role={userProfile?.role || "STUDENT"} 
        />

        {/* Workspace Splitting Layout */}
        <div className="flex flex-1 overflow-hidden">
          <StudentSidebar 
            classes={joinedClasses} 
            onJoinClass={() => setIsJoinModalOpen(true)} 
          />
          
          <main className="flex-1 overflow-y-auto bg-background/50">
            {children}
          </main>
        </div>

        {/* Global Join Code Sheet Portal */}
        <JoinClassModal 
          isOpen={isJoinModalOpen} 
          onClose={() => setIsJoinModalOpen(false)} 
          onSuccess={fetchSidebarData} 
        />
      </div>
    </StudentDashboardContext.Provider>
  );
}