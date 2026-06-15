"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Exam } from "@/types";
import { 
  ArrowLeft, 
  Layers, 
  ShieldCheck, 
  Sparkles, 
  Eye, 
  Settings2, 
  Clock,
  FileText,
  Printer,
  Plus
} from "lucide-react";
import Link from "next/link";

export default function TeacherExamControlCenter() {
  const { id: classId, examId } = useParams();
  const router = useRouter();

  const [classDetails, setClassDetails] = useState<any>(null);
  const [exam, setExam] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadExamDashboardData() {
      if (!examId) return;

      const { data: classData } = await supabase
        .from("classes")
        .select("*")
        .eq("id", classId)
        .maybeSingle();

      const { data: examData } = await supabase
        .from("exams")
        .select("*")
        .eq("id", examId)
        .maybeSingle();
      
      const { data: qData } = await supabase
        .from("questions")
        .select("*")
        .eq("exam_id", examId)
        .order("question_number", { ascending: true });
      
      const { data: subData } = await supabase
        .from("submissions")
        .select(`
          id, 
          total_marks, 
          status, 
          submitted_at, 
          is_released_by_teacher,
          users:student_id (first_name, last_name, email)
        `)
        .eq("exam_id", examId)
        .order("submitted_at", { ascending: false });

      if (classData) setClassDetails(classData);
      if (examData) setExam(examData);
      if (qData) setQuestions(qData);
      if (subData) setSubmissions(subData);
      setLoading(false);
    }
    loadExamDashboardData();
  }, [examId, classId]);

  // Clean Native Browser Print Interface Execution Track
  const handlePrintTrigger = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  if (loading) return (
    <div className="p-8 text-center text-sm font-mono text-muted animate-pulse">
      Synchronizing assessment command vectors...
    </div>
  );

  if (!exam) return (
    <div className="p-8 text-center text-sm text-red-500 font-semibold">
      Target examination template node resource not discovered.
    </div>
  );

  return (
    <div className="min-h-full p-8 max-w-6xl mx-auto space-y-8 animate-slide-up">
      
      {/* ================================================================= */}
      
      <div className="no-print space-y-8">
        
        {/* Top Header Actions Layout */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border/60 pb-5">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => router.push(`/dashboard/teacher/class/${classId}`)} 
              className="p-2 border border-border bg-card hover:bg-secondary rounded-xl text-muted hover:text-foreground transition-all"
            >
              <ArrowLeft size={16} />
            </button>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-primary">Assessment Command Module</span>
              <h1 className="text-2xl font-black text-foreground tracking-tight">{exam.title}</h1>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handlePrintTrigger}
              disabled={submissions.length === 0}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold bg-transparent border border-border text-foreground hover:text-primary hover:bg-secondary/40 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs active:scale-[0.98]"
            >
              <Printer size={14} />
              Print Performance Report
            </button>

            <button
              onClick={() => router.push(`/dashboard/teacher/class/${classId}/exam/${examId}/edit`)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold bg-secondary text-foreground hover:bg-secondary/80 hover:text-primary border border-border rounded-xl transition-all shadow-2xs"
            >
              <Settings2 size={14} /> Edit & Publish
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Main Dashboard Column */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Student Submissions Log Table */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                  <Sparkles size={18} className="text-primary"/> Student Submissions Matrix
                </h3>
                <span className="text-xs font-medium text-muted">{submissions.length} total entries</span>
              </div>
              
              {submissions.length === 0 ? (
                <div className="text-center py-12 bg-card border-2 border-dashed border-border/60 rounded-2xl text-xs text-muted">
                  No students have committed submissions for this test matrix yet.
                </div>
              ) : (
                <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-2xs">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-secondary/50 border-b border-border text-muted font-bold uppercase tracking-wider">
                        <th className="p-4">Student</th>
                        <th className="p-4">Submitted</th>
                        <th className="p-4">AI Score</th>
                        <th className="p-4">Visibility</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border text-foreground font-medium">
                      {submissions.map((sub) => (
                        <tr key={sub.id} className="hover:bg-secondary/10 transition-colors">
                          <td className="p-4 font-semibold">
                            {sub.users?.first_name} {sub.users?.last_name}
                          </td>
                          <td className="p-4 text-muted font-mono">
                            {new Date(sub.submitted_at).toLocaleDateString()}
                          </td>
                          <td className="p-4 font-bold font-mono text-primary">
                            {sub.total_marks} / {exam.total_marks}m
                          </td>
                          <td className="p-4">
                            <span className={`inline-flex rounded-md px-2 py-0.5 text-[10px] font-bold border ${
                              sub.is_released_by_teacher 
                                ? "bg-green-500/10 text-green-600 border-green-500/20" 
                                : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                            }`}>
                              {sub.is_released_by_teacher ? "Published" : "Hidden"}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <Link 
                              href={`/dashboard/teacher/class/${classId}/submission/${sub.id}`}
                              className="inline-flex items-center gap-1 text-[11px] font-bold px-3 py-1.5 bg-secondary hover:bg-primary hover:text-white rounded-lg border border-border/60 transition-all"
                            >
                              <Eye size={12}/> Review
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Exam Outline Preview */}
            <div className="space-y-4">
              <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                <FileText size={18} className="text-primary"/> Structural Outline ({questions.length} Items)
              </h3>
              <div className="grid gap-3">
                {questions.map((q) => (
                  <div key={q.id} className="p-5 bg-card border border-border rounded-2xl space-y-3 transition-all hover:border-primary/20">
                    <div className="flex justify-between text-[11px] font-mono border-b border-border/40 pb-2">
                      <span className="font-bold text-primary uppercase">Item #{q.question_number}</span>
                      <span className="text-muted font-bold">Max Weight: {q.marks}m</span>
                    </div>
                    <p className="text-sm font-bold text-foreground leading-relaxed">{q.question_text}</p>
                    <div className="bg-secondary/30 p-3 rounded-xl border border-border/40">
                      <span className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1">Baseline Target Key (Sample Answer)</span>
                      <p className="text-[11px] text-muted leading-relaxed font-medium">
                        {q.sample_answer}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Metrics Sidebar */}
          <div className="space-y-6">
            <div className="p-6 bg-card border border-border rounded-2xl space-y-4 shadow-2xs">
              <h4 className="text-xs font-bold uppercase text-muted tracking-widest">Ecosystem Metrics</h4>
              
              <div className="space-y-4 pt-2">
                <div className="flex justify-between items-center border-b border-border/40 pb-3">
                  <span className="text-xs font-medium text-muted">Total Marks</span>
                  <span className="font-mono font-bold text-foreground bg-secondary px-2 py-0.5 rounded-md border border-border">
                    {exam.total_marks}m
                  </span>
                </div>

                <div className="flex justify-between items-center border-b border-border/40 pb-3">
                  <span className="text-xs font-medium text-muted">Submissions</span>
                  <span className="text-primary font-bold">{submissions.length}</span>
                </div>

                <div className="flex justify-between items-center border-b border-border/40 pb-3">
                  <span className="text-xs font-medium text-muted">Due Date</span>
                  <span className="text-foreground text-xs font-bold">
                    {exam.due_date ? new Date(exam.due_date).toLocaleDateString() : "No Limit"}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium text-muted">Status</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                    exam.is_published 
                      ? "bg-green-500/10 text-green-600 border-green-500/20" 
                      : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                  }`}>
                    {exam.is_published ? "Active Deployment" : "Draft Staging"}
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ================================================================= */}
      {/* ================================================================= */}
      <div className="hidden print-only bg-white text-black p-4 space-y-8 font-sans">
        
        {/* Executive Print Report Header */}
        <div className="border-b-4 border-blue-600 pb-4 flex justify-between items-end">
          <div>
            <p className="text-xs font-bold text-blue-600 tracking-widest uppercase">AI-LMS Executive Academic Report</p>
            <h1 className="text-3xl font-black text-slate-900 mt-1 tracking-tight">{exam?.title}</h1>
            <p className="text-xs text-slate-500 mt-1">Classroom Identifier Track: <span className="font-semibold text-slate-800">{classDetails?.class_name}</span></p>
          </div>
          <div className="text-right font-mono text-xs text-slate-600 space-y-1">
            <p>Report Date: {new Date().toLocaleDateString()}</p>
            <p>Total Examinees: <span className="font-bold text-slate-900">{submissions.length}</span></p>
            <p>Max Weight: <span className="font-bold text-slate-900">{exam?.total_marks}m</span></p>
          </div>
        </div>

        {/* Executive Tabular Submission List Ledger */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">Student Submission Performance Records</h2>
          <div className="border border-slate-300 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-300 text-slate-700 font-bold uppercase tracking-wide">
                  <th className="p-3 w-10 text-center">#</th>
                  <th className="p-3">Student Name</th>
                  <th className="p-3">Email Address</th>
                  <th className="p-3">Handed-In Date</th>
                  <th className="p-3">Pipeline Status</th>
                  <th className="p-3 text-right">Achieved Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-800">
                {submissions.map((sub, index) => (
                  <tr key={sub.id} className="bg-transparent">
                    <td className="p-3 text-center font-mono font-bold text-slate-400">{index + 1}</td>
                    <td className="p-3 font-bold text-slate-900">{sub.users?.first_name} {sub.users?.last_name}</td>
                    <td className="p-3 text-slate-600 font-mono">{sub.users?.email}</td>
                    <td className="p-3 text-slate-600 font-mono">{sub.submitted_at ? new Date(sub.submitted_at).toLocaleDateString() : "N/A"}</td>
                    <td className="p-3 font-bold tracking-wide text-slate-700 text-[10px] uppercase">{sub.status}</td>
                    <td className="p-3 text-right font-mono font-black text-blue-600 text-sm">{sub.total_marks} / {exam.total_marks}m</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Document Footer Endnote */}
        <div className="border-t border-slate-200 pt-8 text-center text-[10px] text-slate-400 font-medium">
          * This document represents secure, authenticated grade metrics recorded via AI-LMS Automated Similarity Evaluation Pipelines.
        </div>
      </div>

    </div>
  );
}