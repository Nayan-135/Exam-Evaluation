"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Exam } from "@/types";
import { FileSpreadsheet, Plus, HelpCircle, Activity } from "lucide-react";

export default function ExamTemplatesPage() {
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadExams() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("exams")
        .select(`*, classes!inner(class_name, teacher_id), questions(count)`)
        .eq("classes.teacher_id", user.id)
        .order("created_at", { ascending: false });

      if (data) setExams(data);
      setLoading(false);
    }
    loadExams();
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border/60 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Exam Templates</h1>
          <p className="text-sm text-muted mt-1">Configure diagnostic evaluation questions, sample items, and semantic answer metrics.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl shadow-xs hover:bg-blue-600 transition-all">
          <Plus size={16} /> Design New Template
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2].map((n) => <div key={n} className="h-20 bg-card border border-border rounded-xl animate-pulse" />)}
        </div>
      ) : exams.length === 0 ? (
        <div className="text-center py-16 bg-card/40 border-2 border-dashed border-border rounded-2xl max-w-4xl mx-auto">
          <FileSpreadsheet size={40} className="mx-auto text-muted/60 mb-3" />
          <h3 className="font-bold text-lg text-foreground">No Exam Templates Registered</h3>
          <p className="text-xs text-muted max-w-xs mx-auto mt-1">Initialize examination frameworks directly from your individual classroom page routes.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {exams.map((ex) => (
            <div key={ex.id} className="p-5 bg-card border border-border rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-primary/20 shadow-2xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <h4 className="text-sm font-bold text-foreground">{ex.title}</h4>
                  <span className="text-[10px] px-2 py-0.5 bg-secondary text-secondary-foreground font-semibold rounded-md border border-border">
                    {ex.classes?.class_name}
                  </span>
                </div>
                <p className="text-xs text-muted max-w-xl line-clamp-1">{ex.description || "No accompanying instructions specified."}</p>
              </div>

              <div className="flex items-center gap-6 text-xs text-muted font-medium shrink-0">
                <span className="flex items-center gap-1.5"><HelpCircle size={14}/> {ex.questions?.[0]?.count || 0} Questions</span>
                <span className="flex items-center gap-1.5"><Activity size={14}/> {ex.total_marks || 100} Marks Total</span>
                <span className={`text-[10px] px-2 py-0.5 border rounded-md font-bold ${
                  ex.is_published ? "bg-green-500/10 text-green-600 border-green-500/20" : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                }`}>
                  {ex.is_published ? "Active" : "Draft"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}