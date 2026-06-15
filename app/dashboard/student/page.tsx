"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { ClassItem } from "@/types";
import { ClassCard } from "@/components/classroom/ClassCard";
import { JoinClassModal } from "@/components/classroom/JoinClassModal";

export default function StudentDashboard() {
  const [enrolledClasses, setEnrolledClasses] = useState<ClassItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchEnrolledClasses = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from("class_members")
        .select(`classes(*, users:teacher_id(first_name, last_name))`)
        .eq("student_id", user.id);
      
      if (data) {
        const classesCleaned = data.map((item: any) => ({
          ...item.classes,
          teacher_name: item.classes?.users ? `${item.classes.users.first_name} ${item.classes.users.last_name}` : "Faculty Member"
        }));
        setEnrolledClasses(classesCleaned);
      }
    }
    setLoading(false);
  };

  useEffect(() => { fetchEnrolledClasses(); }, []);

  return (
    <div className="min-h-screen p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Student Workstation</h1>
          <p className="text-sm text-muted mt-1">Review active classes, visual benchmarks, and semantic feedback grids[cite: 24, 25, 34].</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-4 py-2.5 bg-secondary text-foreground text-sm font-semibold border border-border rounded-xl shadow-xs hover:bg-secondary/80 transition-colors">
          🔑 Enter Access Code
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2].map((n) => <div key={n} className="h-44 rounded-2xl bg-card border border-border animate-pulse" />)}
        </div>
      ) : enrolledClasses.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-border rounded-2xl bg-card/40">
          <div className="text-4xl mb-3">🎒</div>
          <h3 className="font-bold text-lg text-foreground">Not connected to a class</h3>
          <p className="text-sm text-muted max-w-xs mx-auto mt-1">Input a connection token provided by an instructor to begin standard examination workflows.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrolledClasses.map((c) => <ClassCard key={c.id} item={c} role="STUDENT" />)}
        </div>
      )}

      <JoinClassModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={fetchEnrolledClasses} />
    </div>
  );
}