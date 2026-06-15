"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { ClassItem } from "@/types";
import { ClassCard } from "@/components/classroom/ClassCard";
import { CreateClassModal } from "@/components/classroom/CreateClassModal";

export default function TeacherDashboard() {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchClasses = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from("classes")
        .select(`*, class_members(count), exams(count)`)
        .eq("teacher_id", user.id)
        .order("created_at", { ascending: false });
      
      if (data) {
        const structuralMap = data.map((c: any) => ({
          ...c,
          _count: {
            class_members: c.class_members?.[0]?.count || 0,
            exams: c.exams?.[0]?.count || 0,
          }
        }));
        setClasses(structuralMap);
      }
    }
    setLoading(false);
  };

  useEffect(() => { fetchClasses(); }, []);

  return (
    <div className="min-h-screen p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Instructor Dashboard</h1>
          <p className="text-sm text-muted mt-1">Deploy digital examinations and overview automated score frameworks[cite: 4, 14].</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl shadow-xs hover:bg-blue-600 transition-colors">
          <span>+</span> Create Class
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => <div key={n} className="h-44 rounded-2xl bg-card border border-border animate-pulse" />)}
        </div>
      ) : classes.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-border rounded-2xl bg-card/40">
          <div className="text-4xl mb-3">🏫</div>
          <h3 className="font-bold text-lg text-foreground">No classrooms deployed</h3>
          <p className="text-sm text-muted max-w-xs mx-auto mt-1">Initialize your base classroom footprint to distribute exam evaluations[cite: 4, 11].</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((c) => <ClassCard key={c.id} item={c} role="TEACHER" />)}
        </div>
      )}

      <CreateClassModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={fetchClasses} />
    </div>
  );
}