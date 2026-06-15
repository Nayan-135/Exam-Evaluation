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
      
      // Pull metadata details matching dynamic parameter node
      const { data: info } = await supabase.from("classes").select("*").eq("id", id).maybeSingle();
      
      // Pull filtered, authenticated open testing configurations [cite: 13, 22]
      const { data: testList } = await supabase
        .from("exams")
        .select("*")
        .eq("class_id", id)
        .eq("is_published", true);
      
      if (info) setClassDetails(info);
      if (testList) setExams(testList);
      setLoading(false);
    }
    getStudentRoomData();
  }, [id]);

  if (loading) {
    return (
      <div className="p-8 text-center text-sm text-muted animate-pulse font-mono">
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
    <div className="p-8 max-w-5xl mx-auto space-y-6 animate-slide-up">
      {/* Location Hierarchy Tracking */}
      <div className="border-b border-border pb-4">
        <span className="text-xs uppercase tracking-wider text-muted font-bold">Enrolled Track</span>
        <h1 className="text-2xl font-bold text-foreground mt-0.5">{classDetails.name}</h1>
        {classDetails.description && (
          <p className="text-xs text-muted mt-1 leading-relaxed">{classDetails.description}</p>
        )}
      </div>

      {/* Active Assessments Area */}
      <div className="space-y-4">
        <h3 className="font-semibold text-sm text-foreground tracking-tight">Available Assessments [cite: 22]</h3>

        {exams.length === 0 ? (
          <div className="text-center p-12 bg-card/50 border border-border rounded-xl text-xs text-muted">
            No dynamic examinations published by your instructor at this time[cite: 13, 22].
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {exams.map((ex) => (
              <div 
                key={ex.id} 
                className="p-5 bg-card border border-border rounded-xl flex flex-col justify-between gap-5 transition-all duration-200 hover:border-primary/30 hover:shadow-xs group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                      {ex.title}
                    </h4>
                    <span className="inline-flex shrink-0 items-center rounded-md bg-blue-50 dark:bg-blue-950/40 px-1.5 py-0.5 text-[10px] font-medium text-primary border border-primary/10">
                      Open
                    </span>
                  </div>
                  <p className="text-xs text-muted mt-1.5 line-clamp-2 leading-relaxed">
                    {ex.description || "No specific test documentation parameters provided by instructor."}
                  </p>
                </div>
                
                <button className="w-full py-2 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-blue-600 transition-colors shadow-xs">
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