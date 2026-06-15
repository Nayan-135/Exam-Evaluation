"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { ClassItem } from "@/types";
import { ClassCard } from "@/components/classroom/ClassCard";
import { JoinClassModal } from "@/components/classroom/JoinClassModal";
import { useStudentDashboard } from "./layout";

export default function StudentDashboard() {
  const [enrolledClasses, setEnrolledClasses] = useState<ClassItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { refreshSidebar } = useStudentDashboard();

  const fetchEnrolledClasses = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from("class_members")
        .select(`
          classes(id, class_name, description, join_code, teacher_id, is_active, created_at,
          users:teacher_id(first_name, last_name))
        `)
        .eq("student_id", user.id);
      
      if (data) {
        const classesCleaned: any[] = data.map((item: any) => {
          if (!item.classes) return null;
          return {
            ...item.classes,
            class_name: item.classes.class_name, // Map column string perfectly
            teacher_name: item.classes.users 
              ? `${item.classes.users.first_name} ${item.classes.users.last_name}` 
              : "Faculty Member"
          };
        }).filter(Boolean);
        
        setEnrolledClasses(classesCleaned);
      }
    }
    setLoading(false);
  };

  useEffect(() => { fetchEnrolledClasses(); }, []);

  const handleJoinSuccess = async () => {
    await fetchEnrolledClasses();
    await refreshSidebar();
  };

  return (
    <div className="min-h-full p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border/60 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Student Workstation</h1>
          <p className="text-sm text-muted mt-1">Review active classes, visual benchmarks, and semantic feedback grids[cite: 24, 25, 34].</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)} 
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl shadow-xs hover:bg-blue-600 transition-all active:scale-95"
        >
          🔑 Enter Access Code
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2].map((n) => <div key={n} className="h-44 rounded-2xl bg-card border border-border animate-pulse" />)}
        </div>
      ) : enrolledClasses.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-border rounded-2xl bg-card/20 max-w-4xl mx-auto animate-slide-up">
          <div className="text-4xl mb-4">🎒</div>
          <h3 className="font-bold text-xl text-foreground">Not connected to a class</h3>
          <p className="text-sm text-muted max-w-sm mx-auto mt-1 leading-relaxed">
            Input a connection token provided by an instructor to begin standard examination workflows[cite: 21, 23].
          </p>
          <button 
            onClick={() => setIsModalOpen(true)} 
            className="mt-5 text-xs font-semibold px-4 py-2 bg-secondary text-foreground hover:bg-secondary/80 border border-border rounded-xl transition-all"
          >
            Enter Access Code Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-up">
          {enrolledClasses.map((c) => <ClassCard key={c.id} item={c} role="STUDENT" />)}
        </div>
      )}

      <JoinClassModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={handleJoinSuccess} />
    </div>
  );
}