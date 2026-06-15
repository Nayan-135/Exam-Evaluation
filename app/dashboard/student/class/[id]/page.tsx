"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function StudentClassDetails() {
  const { id } = useParams();
  const [classDetails, setClassDetails] = useState<any>(null);
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getStudentRoomData() {
      if (!id) return;
      const { data: info } = await supabase.from("classes").select("*").eq("id", id).maybeSingle();
      const { data: testList } = await supabase.from("exams").select("*").eq("class_id", id).eq("is_published", true);
      
      if (info) setClassDetails(info);
      if (testList) setExams(testList);
      setLoading(false);
    }
    getStudentRoomData();
  }, [id]);

  if (loading) return <div className="p-8 text-center text-sm text-muted animate-pulse">Synchronizing academic data vectors...</div>;
  if (!classDetails) return <div className="p-8 text-center text-sm text-red-500">Target classroom catalog not found.</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6 animate-slide-up">
      <div className="border-b border-border pb-4">
        <span className="text-xs uppercase tracking-wider text-muted font-bold">Enrolled Track</span>
        <h1 className="text-2xl font-bold text-foreground mt-0.5">{classDetails.name}</h1>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold text-sm text-foreground">Available Assessments [cite: 22]</h3>

        {exams.length === 0 ? (
          <div className="text-center p-8 bg-card border border-border rounded-xl text-xs text-muted">
            No dynamic examinations published by your instructor at this time[cite: 13, 22].
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {exams.map((ex) => (
              <div key={ex.id} className="p-5 bg-card border border-border rounded-xl flex flex-col justify-between gap-4 transition-all hover:border-primary/20">
                <div>
                  <h4 className="text-sm font-bold text-foreground">{ex.title}</h4>
                  <p className="text-xs text-muted mt-1 line-clamp-2">{ex.description || "No parameters provided."}</p>
                </div>
                <button className="w-full py-2 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-blue-600 transition-colors">
                  Launch Assessment Matrix [cite: 23]
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}