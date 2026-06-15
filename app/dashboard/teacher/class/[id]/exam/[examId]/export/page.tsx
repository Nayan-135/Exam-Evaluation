"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, Printer, Download } from "lucide-react";

export default function ExamLedgerExportPage() {
  const { id: classId, examId } = useParams();
  const router = useRouter();

  const [exam, setExam] = useState<any>(null);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLedgerData() {
      if (!examId) return;

      try {
        // 1. Fetch parent assessment data
        const { data: examData } = await supabase
          .from("exams")
          .select("title, total_marks")
          .eq("id", examId)
          .maybeSingle();

        // 2. Fetch associated student entry rows
        const { data: subData } = await supabase
          .from("submissions")
          .select(`
            id, total_marks,
            users:student_id (first_name, last_name)
          `)
          .eq("exam_id", examId)
          .order("submitted_at", { ascending: false });

        if (examData) setExam(examData);
        if (subData) setSubmissions(subData);
      } catch (error) {
        console.error("Error compiling ledger records:", error);
      } finally {
        setLoading(false);
      }
    }
    loadLedgerData();
  }, [examId]);

  const executePrintAction = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const downloadBackupExcelCSV = () => {
    if (submissions.length === 0) return;
    
    const headers = ["Student Name", "Exam Name", "Score Obtained", "Max Marks"];
    const rows = submissions.map(sub => {
      const studentName = `${sub.users?.first_name || ""} ${sub.users?.last_name || ""}`.trim();
      const examTitle = exam?.title || "Assessment";
      return [
        `"${studentName.replace(/"/g, '""')}"`,
        `"${examTitle.replace(/"/g, '""')}"`,
        `"${sub.total_marks ?? 0}"`,
        `"${exam?.total_marks ?? 0}"`
      ];
    });

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Ledger_${exam?.title?.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] space-y-3">
        <div className="w-6 h-6 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-mono text-slate-500 tracking-wider">Generating data sheet...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-4 antialiased text-slate-200">
      
      {/* Print Overrides Injection for clean physical or PDF sheets */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body { background: white !important; color: black !important; }
          .no-print { display: none !important; }
          .print-bg-clean { background: transparent !important; color: black !important; border: none !important; box-shadow: none !important; }
          .print-text-dark { color: #000000 !important; }
          .print-border-clean { border-bottom: 1px solid #cbd5e1 !important; }
        }
      `}} />

      {/* Action Controller Strip */}
      <div className="no-print flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 bg-slate-900 border border-slate-800 rounded-xl p-3 shadow-md">
        <button
          onClick={() => router.back()}
          className="flex items-center justify-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 transition-all active:scale-[0.99]"
        >
          <ArrowLeft size={14} />
          Back
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={downloadBackupExcelCSV}
            disabled={submissions.length === 0}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800 border border-slate-700 text-slate-300 transition-all active:scale-[0.99]"
          >
            <Download size={14} />
            CSV Export
          </button>

          <button
            onClick={executePrintAction}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-1.5 text-xs font-medium rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-all active:scale-[0.99]"
          >
            <Printer size={14} />
            Print / PDF
          </button>
        </div>
      </div>

      {/* Main Ledger Frame */}
      <div className="print-bg-clean bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        
        {/* Minimalized Institutional Identification Block */}
        <div className="print-bg-clean bg-slate-900/40 px-6 py-6 border-b border-slate-800/80 flex justify-between items-baseline gap-4">
          <div>
            <p className="text-[10px] tracking-widest uppercase font-bold text-slate-500 block mb-1">
              Examination Grade Sheet
            </p>
            <h1 className="print-text-dark text-xl font-bold text-slate-100 tracking-tight">
              {exam?.title || "Academic Assessment Record"}
            </h1>
          </div>
          <div className="print-text-dark text-[11px] font-mono text-slate-400">
            {new Date().toLocaleDateString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit' })}
          </div>
        </div>

        {/* Core Sheet Content */}
        <div className="p-4">
          {submissions.length === 0 ? (
            <div className="text-center py-10 border border-dashed border-slate-800 rounded-lg">
              <p className="text-xs text-slate-500 font-mono">No data entries available for this query block.</p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-lg border border-slate-800/60">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="print-border-clean bg-slate-900/80 text-slate-400 uppercase tracking-wider text-[9px] font-bold border-b border-slate-800">
                    <th scope="col" className="py-2.5 pl-4 text-center w-12 text-slate-500">#</th>
                    <th scope="col" className="py-2.5 px-3">Student Name</th>
                    <th scope="col" className="py-2.5 px-3">Exam Name</th>
                    <th scope="col" className="py-2.5 pr-6 text-right w-36">Marks Obtained</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40 print:divide-y print:divide-slate-300">
                  {submissions.map((sub, idx) => (
                    <tr
                      key={sub.id}
                      className="print-border-clean hover:bg-slate-900/20 transition-colors"
                    >
                      <td className="py-3 pl-4 text-center font-mono text-slate-600 print:text-slate-500">
                        {idx + 1}
                      </td>
                      <td className="py-3 px-3 font-medium text-slate-200 print:text-black">
                        {sub.users?.first_name || ""} {sub.users?.last_name || ""}
                      </td>
                      <td className="py-3 px-3 text-slate-400 print:text-slate-800">
                        {exam?.title}
                      </td>
                      <td className="py-3 pr-6 text-right font-mono font-bold text-slate-200 print:text-black">
                        {sub.total_marks ?? 0} <span className="text-slate-600 print:text-slate-400 font-normal">/ {exam?.total_marks || 0}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Minimal Footer Signature Flag */}
        <div className="border-t border-slate-900 px-6 py-3 text-[10px] text-center font-mono text-slate-600 tracking-wider uppercase">
          End of Ledger Report
        </div>

      </div>
    </div>
  );
}