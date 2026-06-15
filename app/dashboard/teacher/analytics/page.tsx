"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { BarChart2, TrendingUp, Award, Clock } from "lucide-react";

export default function PerformanceReportsPage() {
  const [stats, setStats] = useState({ classCount: 0, testCount: 0, pendingCount: 0 });
  const [recentEvaluations, setRecentEvaluations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAnalytics() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { count: classesCount } = await supabase.from("classes").select("*", { count: "exact", head: true }).eq("teacher_id", user.id);
      const { data: subs } = await supabase
        .from("submissions")
        .select(`*, exams!inner(title, class_id, classes!inner(teacher_id)), users(first_name, last_name)`)
        .eq("exams.classes.teacher_id", user.id)
        .order("submitted_at", { ascending: false });

      if (subs) {
        setRecentEvaluations(subs.slice(0, 5));
        const evaluated = subs.filter((s: any) => s.status === "EVALUATED").length;
        setStats({
          classCount: classesCount || 0,
          testCount: new Set(subs.map((s: any) => s.exam_id)).size,
          pendingCount: subs.length - evaluated
        });
      }
      setLoading(false);
    }
    loadAnalytics();
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Performance Reports</h1>
        <p className="text-sm text-muted mt-1">Oversee evaluation analytics metrics and review semantic AI scores.</p>
      </div>

      {/* Aggregate Matrix Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {[
          { label: "Tracked Classrooms", val: stats.classCount, icon: TrendingUp, color: "text-blue-500 bg-blue-500/10" },
          { label: "Processed Assessments", val: stats.testCount, icon: Award, color: "text-purple-500 bg-purple-500/10" },
          { label: "Pending Evaluations", val: stats.pendingCount, icon: Clock, color: "text-amber-500 bg-amber-500/10" },
        ].map((card) => (
          <div key={card.label} className="p-6 bg-card border border-border rounded-2xl flex items-center justify-between shadow-2xs">
            <div className="space-y-1">
              <p className="text-xs font-bold uppercase text-muted tracking-wider">{card.label}</p>
              <p className="text-3xl font-black text-foreground">{loading ? "..." : card.val}</p>
            </div>
            <div className={`p-3 rounded-xl ${card.color}`}><card.icon size={22} /></div>
          </div>
        ))}
      </div>

      {/* Evaluation Submissions Log */}
      <div className="space-y-4">
        <h3 className="font-bold text-md text-foreground">Recent Submission Operations</h3>
        {loading ? (
          <div className="h-32 bg-card border border-border rounded-2xl animate-pulse" />
        ) : recentEvaluations.length === 0 ? (
          <div className="p-8 text-center text-xs text-muted border border-border bg-card rounded-xl">
             No student examination entries discovered inside current databases.
          </div>
        ) : (
          <div className="bg-card border border-border rounded-xl overflow-hidden shadow-2xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-secondary/50 border-b border-border text-muted font-bold uppercase tracking-wider">
                  <th className="p-4">Student</th>
                  <th className="p-4">Exam Element</th>
                  <th className="p-4">Submission Date</th>
                  <th className="p-4">Awarded Score</th>
                  <th className="p-4 text-right">Pipeline Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-foreground font-medium">
                {recentEvaluations.map((row) => (
                  <tr key={row.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="p-4 font-semibold">{row.users?.first_name} {row.users?.last_name}</td>
                    <td className="p-4 text-muted">{row.exams?.title}</td>
                    <td className="p-4 text-muted font-mono">{new Date(row.submitted_at).toLocaleDateString()}</td>
                    <td className="p-4 font-bold font-mono text-primary">{row.status === "EVALUATED" ? `${row.total_marks}m` : "--"}</td>
                    <td className="p-4 text-right">
                      <span className={`inline-flex rounded-md px-2 py-0.5 text-[10px] font-bold border ${
                        row.status === "EVALUATED" ? "bg-green-500/10 text-green-600 border-green-500/20" : "bg-blue-500/10 text-blue-600 border-blue-500/20"
                      }`}>{row.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}