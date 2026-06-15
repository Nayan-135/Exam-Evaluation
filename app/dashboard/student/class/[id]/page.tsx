"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Exam } from "@/types";
import { Calendar, Layers, ArrowLeft, Clock, Award, Sparkles, ChevronRight } from "lucide-react";

export default function StudentClassDetails() {
  const { id: classId } = useParams();
  const router = useRouter();
  
  const [classDetails, setClassDetails] = useState<any>(null);
  const [activeExams, setActiveExams] = useState<any[]>([]);
  const [completedExams, setCompletedExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getStudentRoomData() {
      if (!classId) return;
      
      // 1. Fetch metadata matching this specific classroom instance
      const { data: info } = await supabase
        .from("classes")
        .select(`*, users:teacher_id(first_name, last_name)`)
        .eq("id", classId)
        .maybeSingle();
      
      if (info) {
        setClassDetails({
          ...info,
          teacher_name: info.users ? `${info.users.first_name} ${info.users.last_name}` : "Faculty Member"
        });
      }

      // 2. Fetch all exams published in this class
      const { data: totalExams } = await supabase
        .from("exams")
        .select("*")
        .eq("class_id", classId)
        .eq("is_published", true)
        .order("created_at", { ascending: false });

      // 3. Fetch current student's submissions for these exams
      const { data: { user } } = await supabase.auth.getUser();
      if (user && totalExams) {
        const { data: userSubmissions } = await supabase
          .from("submissions")
          .select("*")
          .eq("student_id", user.id)
          .eq("exam_id", totalExams.map(e => e.id));

        // Create a lookup map for faster access speeds
        const subMap = new Map(userSubmissions?.map(s => [s.exam_id, s]));

        const available: any[] = [];
        const completed: any[] = [];

        totalExams.forEach((ex) => {
          const matchingSub = subMap.get(ex.id);
          const examWithSubContext = { ...ex, submission: matchingSub || null };

          if (matchingSub && matchingSub.status === "SUBMITTED") {
            completed.push(examWithSubContext);
          } else {
            available.push(examWithSubContext);
          }
        });

        setActiveExams(available);
        setCompletedExams(completed);
      }
      setLoading(false);
    }
    getStudentRoomData();
  }, [classId]);

  if (loading) {
    return (
      <div className="p-8 text-center text-sm font-mono text-muted animate-pulse">
        Synchronizing academic data vectors...
      </div>
    );
  }
  
  if (!classDetails) {
    return (
      <div className="p-8 text-center text-sm text-red-500 font-semibold">
        Target classroom catalog not found within the database registry.
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 animate-slide-up">
      {/* Breadcrumb Header */}
      <div className="flex items-center gap-3 border-b border-border/60 pb-5">
        <button 
          onClick={() => router.push("/dashboard/student")} 
          className="p-2 border border-border bg-card hover:bg-secondary rounded-xl text-muted hover:text-foreground transition-all"
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted">Enrolled Track Layout</span>
          <h1 className="text-2xl font-black text-foreground tracking-tight">{classDetails.class_name}</h1>
          <p className="text-xs text-muted mt-0.5">Instructor: {classDetails.teacher_name}</p>
        </div>
      </div>

      {/* Grid Segmentation Blocks */}
      <div className="space-y-8">
        
        {/* Section A: Open and Pending Testing Windows */}
        <div className="space-y-4">
          <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
            <Clock size={16} className="text-primary"/> Available Assessments
          </h3>

          {activeExams.length === 0 ? (
            <div className="text-center p-12 bg-card/40 border border-border rounded-2xl text-xs text-muted leading-relaxed">
              No pending examinations assigned to your profile inside this node framework.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {activeExams.map((ex) => {
                const isDraft = ex.submission?.status === "DRAFT";
                return (
                  <div 
                    key={ex.id} 
                    className="p-5 bg-card border border-border rounded-2xl flex flex-col justify-between gap-5 transition-all duration-200 hover:border-primary/30 hover:shadow-md group relative"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                          {ex.title}
                        </h4>
                        {isDraft && (
                          <span className="inline-flex shrink-0 items-center rounded-md bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-bold text-amber-600 border border-amber-500/20">
                            In Progress
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted mt-2 line-clamp-2 leading-relaxed">
                        {ex.description || "No specific instructions parameters provided by instructor."}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between border-t border-border/40 pt-3.5 mt-1">
                      <div className="text-[11px] text-muted font-medium space-y-0.5">
                        <div className="flex items-center gap-1.5"><Layers size={12}/> Max Points: {ex.total_marks}m</div>
                        {ex.due_date && <div className="flex items-center gap-1.5"><Calendar size={12}/> Due: {new Date(ex.due_date).toLocaleDateString()}</div>}
                      </div>
                      
                      <button 
                        onClick={() => router.push(`/dashboard/student/class/${classId}/exam/${ex.id}`)}
                        className="flex items-center gap-1 px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl hover:bg-blue-600 transition-all shadow-xs group-hover:scale-[1.02]"
                      >
                        {isDraft ? "Resume Attempt" : "Start Exam"} <ChevronRight size={13} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Section B: Finalized Submissions & Graded Reports Block */}
        <div className="space-y-4">
          <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
            <Award size={16} className="text-green-500"/> Completed & Graded Submissions
          </h3>

          {completedExams.length === 0 ? (
            <div className="text-center p-10 bg-card/40 border border-border rounded-2xl text-xs text-muted/70 italic">
              No completed logs recorded on this classroom node.
            </div>
          ) : (
            <div className="space-y-3">
              {completedExams.map((ex) => {
                const isReleased = ex.submission?.is_released_by_teacher;
                return (
                  <div 
                    key={ex.id} 
                    className="p-5 bg-card border border-border rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:border-border"
                  >
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-foreground">{ex.title}</h4>
                      <p className="text-[11px] text-muted font-medium">
                        Submitted on: {new Date(ex.submission.submitted_at).toLocaleString()}
                      </p>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 border-border/40 pt-3 md:pt-0">
                      <div className="text-left md:text-right">
                        <span className="text-[10px] font-bold text-muted uppercase tracking-wider block">Evaluation Score</span>
                        <span className="text-md font-black font-mono text-foreground">
                          {isReleased ? (
                            <span className="text-primary">{ex.submission.total_marks} / {ex.total_marks}m</span>
                          ) : (
                            <span className="text-muted/80 text-xs italic font-medium">Awaiting Faculty Release</span>
                          )}
                        </span>
                      </div>

                      <button
                        onClick={() => router.push(`/dashboard/student/class/${classId}/exam/${ex.id}`)}
                        className="px-4 py-2 text-xs font-bold bg-secondary text-foreground hover:bg-secondary/80 border border-border rounded-xl transition-all"
                      >
                        Review Submission
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}