"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { TrendingUp, Award, CheckCircle2 } from "lucide-react";

export default function StudentResultsPage() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStudentResults() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("submissions")
        .select(`
          id, total_marks, status, feedback, evaluated_at,
          exams(title, total_marks, classes(class_name))
        `)
        .eq("student_id", user.id)
        .order("evaluated_at", { ascending: false });

      if (data) setSubmissions(data);
      setLoading(false);
    }
    loadStudentResults();
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Performance & Results</h1>
        <p className="text-sm text-muted mt-1">Review graded records, automated point allocations, and AI insight critiques[cite: 24, 25, 34].</p>
      </div>

      {loading ? (
        <div className="h-40 bg-card border border-border rounded-2xl animate-pulse" />
      ) : submissions.length === 0 ? (
        <div className="text-center py-16 bg-card/40 border-2 border-dashed border-border rounded-2xl max-w-4xl mx-auto">
          <TrendingUp size={40} className="mx-auto text-muted/60 mb-3" />
          <h3 className="font-bold text-lg text-foreground">No Grading Logs Documented</h3>
          <p className="text-xs text-muted max-w-xs mx-auto mt-1">Completed exam records will generate AI evaluations here as soon as they are processed.</p>
        </div>
      ) : (
        <div className="space-y-4 animate-slide-up">
          {submissions.map((sub) => (
            <div key={sub.id} className="bg-card border border-border rounded-2xl p-5 shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/40 pb-3">
                <div>
                  <span className="text-[10px] font-bold text-muted uppercase tracking-widest">{sub.exams?.classes?.class_name}</span>
                  <h3 className="text-base font-bold text-foreground mt-0.5">{sub.exams?.title}</h3>
                </div>
                
                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    <p className="text-[10px] font-bold uppercase text-muted tracking-wide">Achieved Score</p>
                    <p className="text-lg font-black text-primary font-mono">
                      {sub.status === "EVALUATED" ? `${sub.total_marks} / ${sub.exams?.total_marks}m` : "Processing"}
                    </p>
                  </div>
                  <span className={`text-[10px] px-2.5 py-1 border rounded-md font-bold uppercase tracking-wider ${
                    sub.status === "EVALUATED" ? "bg-green-500/10 text-green-600 border-green-500/20" : "bg-blue-500/10 text-blue-600 border-blue-500/20"
                  }`}>{sub.status}</span>
                </div>
              </div>

              {sub.feedback && (
                <div className="p-3.5 bg-secondary/40 border border-border rounded-xl text-xs text-muted leading-relaxed">
                  <span className="font-bold text-foreground block mb-1">🤖 AI Evaluation Insight Pipeline:</span>
                  {sub.feedback} [cite: 34]
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}