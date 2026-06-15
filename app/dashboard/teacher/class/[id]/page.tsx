"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Exam } from "@/types";
import Link from "next/link"; // Ensure Link is imported for layout routing
import { Calendar, Layers, ShieldCheck, ArrowLeft, FilePlus, Mail, Users as UsersIcon } from "lucide-react";

export default function TeacherClassDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [classDetails, setClassDetails] = useState<any>(null);
  const [exams, setExams] = useState<Exam[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"exams" | "students">("exams");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getRoomData() {
      if (!id) return;
      
      const { data: info } = await supabase.from("classes").select("*").eq("id", id).maybeSingle();
      const { data: testList } = await supabase.from("exams").select("*").eq("class_id", id).order("created_at", { ascending: false });
      const { data: memberList } = await supabase
        .from("class_members")
        .select(`
          joined_at,
          users:student_id (first_name, last_name, email, avatar_url)
        `)
        .eq("class_id", id);
      
      if (info) setClassDetails(info);
      if (testList) setExams(testList);
      if (memberList) setStudents(memberList);
      setLoading(false);
    }
    getRoomData();
  }, [id]);

  if (loading) return <div className="p-8 text-center text-sm font-mono text-muted animate-pulse">Parsing structural workspace parameters...</div>;
  if (!classDetails) return <div className="p-8 text-center text-sm text-red-500 font-semibold">Target classroom workspace resource not found.</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 animate-slide-up">
      {/* Header and Sub-navigation Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border/60 pb-6">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => router.push("/dashboard/teacher")} 
            className="p-2 border border-border bg-card hover:bg-secondary rounded-xl text-muted hover:text-foreground transition-all"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-primary">Classroom Ecosystem</span>
            <h1 className="text-2xl font-extrabold text-foreground tracking-tight">{classDetails.class_name}</h1>
          </div>
        </div>

        {/* Modular View Segment Switcher */}
        <div className="flex bg-secondary/50 p-1 rounded-xl border border-border shrink-0">
          <button onClick={() => setActiveTab("exams")} className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${activeTab === "exams" ? "bg-card text-primary shadow-sm" : "text-muted hover:text-foreground"}`}>
            Exams
          </button>
          <button onClick={() => setActiveTab("students")} className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${activeTab === "students" ? "bg-card text-primary shadow-sm" : "text-muted hover:text-foreground"}`}>
            Students ({students.length})
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Side Dynamic Main Block */}
        <div className="lg:col-span-2 space-y-5">
          
          {activeTab === "exams" ? (
            <>
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-md text-foreground">Configured Assessments</h3>
                <button 
                  onClick={() => router.push(`/dashboard/teacher/class/${id}/create-exam`)}
                  className="flex items-center gap-1.5 text-xs font-bold bg-primary text-white px-3.5 py-2 rounded-xl hover:bg-blue-600 transition-all shadow-xs active:scale-95"
                >
                  <FilePlus size={14} /> New Exam
                </button>
              </div>

              {exams.length === 0 ? (
                <div className="text-center py-12 bg-card border-2 border-dashed border-border/60 rounded-2xl text-xs text-muted">
                  No examination metrics initialized for this structure yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {exams.map((ex) => (
                    // UPDATED: Wrapped the card layout inside a dynamic Link route endpoint anchor
                    <Link 
                      key={ex.id} 
                      href={`/dashboard/teacher/class/${id}/exam/${ex.id}`}
                      className="p-4 bg-card border border-border rounded-xl flex justify-between items-center hover:border-primary/40 hover:bg-secondary/20 transition-all shadow-2xs group cursor-pointer block"
                    >
                      <div>
                        <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{ex.title}</h4>
                        <div className="flex items-center gap-3 text-[11px] text-muted mt-1 font-medium">
                          <span className="flex items-center gap-1"><Layers size={12}/> Max: {ex.total_marks}m</span>
                          {ex.due_date && <span className="flex items-center gap-1"><Calendar size={12}/> Due: {new Date(ex.due_date).toLocaleDateString()}</span>}
                        </div>
                      </div>
                      <span className={`text-[10px] px-2.5 py-0.5 border rounded-md font-bold ${
                        ex.is_published 
                          ? "bg-green-500/10 text-green-600 border-green-500/20" 
                          : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                      }`}>
                        {ex.is_published ? "Active" : "Draft"}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </>
          ) : (
            // Students tab container rendering path code trace
            <>
              <h3 className="font-bold text-md text-foreground">Enrolled Students</h3>
              {students.length === 0 ? (
                <div className="text-center py-12 bg-card border-2 border-dashed border-border/60 rounded-2xl text-xs text-muted">
                  No students have used your join code to enter this classroom node yet.
                </div>
              ) : (
                <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-2xs">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-secondary/50 border-b border-border text-muted font-bold uppercase tracking-wider">
                        <th className="p-4">Student Name</th>
                        <th className="p-4">Email Address</th>
                        <th className="p-4 text-right">Joined Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border text-foreground font-medium">
                      {students.map((member, idx) => (
                        <tr key={idx} className="hover:bg-secondary/20 transition-colors">
                          <td className="p-4 flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-[10px]">
                              {member.users?.first_name?.[0]}{member.users?.last_name?.[0]}
                            </div>
                            <span className="font-semibold">{member.users?.first_name} {member.users?.last_name}</span>
                          </td>
                          <td className="p-4 text-muted">
                            <span className="flex items-center gap-1.5"><Mail size={12}/> {member.users?.email}</span>
                          </td>
                          <td className="p-4 text-right text-muted font-mono">
                            {new Date(member.joined_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>

        {/* Right Side Diagnostics Panel */}
        <div className="p-5 bg-card border border-border rounded-2xl space-y-4 shadow-2xs">
          <div>
            <h4 className="text-xs font-bold uppercase text-muted tracking-widest">Workspace Diagnostics</h4>
            <p className="text-[11px] text-muted/80 mt-0.5">Ecosystem properties layout parameters.</p>
          </div>
          <div className="text-xs space-y-3 pt-2">
            <div className="flex justify-between items-center border-b border-border/40 pb-2.5">
              <span className="text-muted font-medium">Join Code</span> 
              <span className="font-mono font-bold text-primary select-all bg-primary/5 px-2.5 py-1 rounded-lg border border-primary/10 tracking-widest uppercase">
                {classDetails.join_code}
              </span>
            </div>
            <div className="flex justify-between items-center border-b border-border/40 pb-2.5">
              <span className="text-muted font-medium">Total Registered</span> 
              <span className="text-foreground font-bold flex items-center gap-1"><UsersIcon size={13}/> {students.length} Enrolled</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted font-medium">Status</span> 
              <span className="flex items-center gap-1 text-green-500 font-bold">
                <ShieldCheck size={14}/> Operational
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}