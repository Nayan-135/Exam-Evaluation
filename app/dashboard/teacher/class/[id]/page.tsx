"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function TeacherClassDetails() {
  const { id } = useParams();
  const [classDetails, setClassDetails] = useState<any>(null);
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getRoomData() {
      if (!id) return;
      const { data: info } = await supabase.from("classes").select("*").eq("id", id).maybeSingle();
      const { data: testList } = await supabase.from("exams").select("*").eq("class_id", id);
      
      if (info) setClassDetails(info);
      if (testList) setExams(testList);
      setLoading(false);
    }
    getRoomData();
  }, [id]);

  if (loading) return <div className="p-8 text-center text-sm text-muted animate-pulse">Parsing structural workspace parameters...</div>;
  if (!classDetails) return <div className="p-8 text-center text-sm text-red-500">Target classroom workspace resource not found.</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6 animate-slide-up">
      <div className="border-b border-border pb-4">
        <span className="text-xs uppercase tracking-wider text-primary font-bold">Classroom Ecosystem</span>
        <h1 className="text-2xl font-bold text-foreground mt-1">{classDetails.name}</h1>
        <p className="text-sm text-muted mt-1">{classDetails.description || "No supplemental descriptions attached."}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-foreground">Configured Assessments [cite: 11]</h3>
            <button className="text-xs font-semibold bg-primary text-white px-3 py-1.5 rounded-lg hover:bg-blue-600 transition-colors">
              + New Exam
            </button>
          </div>

          {exams.length === 0 ? (
            <div className="text-center p-8 bg-card border border-border rounded-xl text-xs text-muted">
              No examination metrics initialized for this structure yet[cite: 11].
            </div>
          ) : (
            <div className="space-y-2">
              {exams.map((ex) => (
                <div key={ex.id} className="p-4 bg-card border border-border rounded-xl flex justify-between items-center">
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">{ex.title}</h4>
                    <span className="text-[11px] text-muted">Created: {new Date(ex.created_at).toLocaleDateString()}</span>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-md font-medium ${ex.is_published ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                    {ex.is_published ? "Active" : "Draft"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 bg-card border border-border rounded-xl h-fit space-y-3">
          <h4 className="text-xs font-bold uppercase text-muted tracking-wider">Workspace Diagnostics</h4>
          <div className="text-xs text-foreground space-y-1">
            <div className="flex justify-between"><span>Join Code:</span> <span className="font-mono font-bold text-primary">{classDetails.join_code}</span></div>
            <div className="flex justify-between"><span>Deployment Node:</span> <span className="text-muted">Edge-MVP-Phase1 </span></div>
          </div>
        </div>
      </div>
    </div>
  );
}