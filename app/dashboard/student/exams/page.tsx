"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { FileText, Calendar, CheckCircle2, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function StudentExamsPage() {
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function loadStudentExams() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // 1. Load exams assigned to student's classes
      const { data: classData } = await supabase
        .from("class_members")
        .select(`
          class_id,
          classes(
            class_name,
            exams(id, title, description, total_marks, due_date, is_published)
          )
        `)
        .eq("student_id", user.id);

      // 2. Gather student submissions to verify completed items
      const { data: subData } = await supabase
        .from("submissions")
        .select("exam_id, status")
        .eq("student_id", user.id);

      const subStatusMap = new Map(subData?.map(s => [s.exam_id, s.status]));

      if (classData) {
        const flattenedExams = classData.flatMap((item: any) => {
          const roomExams = item.classes?.exams || [];
          const classId = item.class_id;
          
          return roomExams
            .filter((e: any) => e.is_published === true)
            .map((e: any) => {
              const submissionStatus = subStatusMap.get(e.id) || null;
              return { 
                ...e, 
                class_id: classId,
                class_name: item.classes.class_name,
                isCompleted: submissionStatus === "SUBMITTED"
              };
            });
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
            <div key={ex.id} className={`p-5 bg-card border rounded-xl flex flex-col justify-between gap-5 transition-all shadow-2xs group ${ex.isCompleted ? 'border-border opacity-75' : 'border-border hover:border-primary/20'}`}>
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
                
                {ex.isCompleted ? (
                  <button 
                    onClick={() => router.push(`/dashboard/student/class/${ex.class_id}/exam/${ex.id}`)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 border border-green-500/20 text-green-500 text-xs font-bold rounded-lg transition-all"
                  >
                    <CheckCircle2 size={13} /> Completed
                  </button>
                ) : (
                  <button 
                    onClick={() => router.push(`/dashboard/student/class/${ex.class_id}/exam/${ex.id}`)}
                    className="flex items-center gap-1 px-4 py-1.5 bg-primary text-white text-xs font-bold rounded-lg hover:bg-blue-600 transition-colors shadow-2xs"
                  >
                    Launch Test <ArrowRight size={13} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}