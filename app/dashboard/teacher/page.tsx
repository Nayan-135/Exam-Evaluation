"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { ClassItem } from "@/types";
import { ClassCard } from "@/components/classroom/ClassCard";
import { CreateClassModal } from "@/components/classroom/CreateClassModal";
import { useTeacherEnv } from "./layout";

export default function TeacherDashboard() {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { syncUI } = useTeacherEnv();

  const loadDashboardMatrix = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Direct accurate schema call aggregating standard join relations 
    const { data, error } = await supabase
      .from("classes")
      .select(`
        id, class_name, description, join_code, is_active, created_at, teacher_id,
        class_members(count),
        exams(count)
      `)
      .eq("teacher_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Dashboard engine structural fetch execution error:", error);
    } else if (data) {
      const processed: ClassItem[] = data.map((c: any) => ({
        ...c,
        member_count: c.class_members?.[0]?.count || 0,
        exam_count: c.exams?.[0]?.count || 0
      }));
      setClasses(processed);
    }
    setLoading(false);
  };

  useEffect(() => { loadDashboardMatrix(); }, []);

  const handleCreateSuccess = async () => {
    await loadDashboardMatrix();
    await syncUI();
  };

  return (
    <div className="min-h-full p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border/60 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Instructor Dashboard</h1>
          <p className="text-sm text-muted mt-1">Deploy digital examinations and overview automated score frameworks[cite: 4, 14].</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl shadow-xs hover:bg-blue-600 active:scale-95 transition-all">
          <span>+</span> Create Class
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => <div key={n} className="h-44 rounded-2xl bg-card border border-border animate-pulse" />)}
        </div>
      ) : classes.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-border rounded-2xl bg-card/20 max-w-4xl mx-auto animate-slide-up">
          <p className="text-4xl mb-4">🏫</p>
          <h3 className="font-bold text-xl text-foreground">No classrooms deployed</h3>
          <p className="text-sm text-muted max-w-sm mx-auto mt-1 leading-relaxed">
            Initialize your base classroom footprint to distribute exam evaluations across connected students[cite: 4, 11].
          </p>
          <button onClick={() => setIsModalOpen(true)} className="mt-5 text-xs font-semibold px-4 py-2 bg-secondary text-foreground hover:bg-secondary/80 border border-border rounded-xl transition-all">
            Deploy First Class Node
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-up">
          {classes.map((c) => <ClassCard key={c.id} item={c} role="TEACHER" />)}
        </div>
      )}

      <CreateClassModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={handleCreateSuccess} />
    </div>
  );
}