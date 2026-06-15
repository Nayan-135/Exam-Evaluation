"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { FileText, Calendar, ShieldAlert } from "lucide-react";

export default function StudentExamsPage() {
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStudentExams() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("class_members")
        .select(`
          classes(
            class_name,
            exams(id, title, description, total_marks, due_date, is_published)
          )
        `)
        .eq("student_id", user.id);

      if (data) {
        const flattenedExams = data.flatMap((item: any) => {
          const roomExams = item.classes?.exams || [];
          return roomExams
            .filter((e: any) => e.is_published === true)
            .map((e: any) => ({ ...e, class_name: item.classes.class_name }));
        });
        setExams(flattenedExams);
      }
      setLoading(false);
    }
    loadStudentExams();
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">My Assessments</h1>
        <p className="text-sm text-muted mt-1">Access active testing suites, structured specifications, and time criteria.</p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2].map((n) => <div key={n} className="h-24 bg-card border border-border rounded-xl animate-pulse" />)}
        </div>
      ) : exams.length === 0 ? (
        <div className="text-center py-16 bg-card/40 border-2 border-dashed border-border rounded-2xl max-w-4xl mx-auto">
          <FileText size={40} className="mx-auto text-muted/60 mb-3" />
          <h3 className="font-bold text-lg text-foreground">No Pending Exams Discovered</h3>
          <p className="text-xs text-muted max-w-xs mx-auto mt-1">Excellent standing! There are currently no active testing vectors waiting for submission.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-slide-up">
          {exams.map((ex) => (
            <div key={ex.id} className="p-5 bg-card border border-border rounded-xl flex flex-col justify-between gap-5 transition-all hover:border-primary/20 shadow-2xs group">
              <div>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/5 px-2 py-0.5 rounded-md border border-primary/10 mb-1.5 inline-block">
                      {ex.class_name}
                    </span>
                    <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">{ex.title}</h4>
                  </div>
                  <span className="text-xs font-mono font-bold text-muted whitespace-nowrap">{ex.total_marks} Marks</span>
                </div>
                <p className="text-xs text-muted mt-2 line-clamp-2 leading-relaxed">{ex.description || "No custom instructions specified."}</p>
              </div>

              <div className="flex items-center justify-between border-t border-border/40 pt-3.5 mt-2">
                <span className="flex items-center gap-1.5 text-[11px] text-muted font-medium">
                  <Calendar size={13}/> Due: {ex.due_date ? new Date(ex.due_date).toLocaleDateString() : "No Limit"}
                </span>
                <button className="px-4 py-1.5 bg-primary text-white text-xs font-bold rounded-lg hover:bg-blue-600 transition-colors shadow-2xs">
                  Launch Test [cite: 23]
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}