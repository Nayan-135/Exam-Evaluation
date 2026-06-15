"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useTeacherEnv } from "../layout";
import { ArrowLeft } from "lucide-react";

export default function CreateClassPage() {
  const router = useRouter();
  const [className, setClassName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { syncUI } = useTeacherEnv();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Authentication state error. Sign-in session is missing.");

      const joinCode = Math.random().toString(36).substring(2, 8).toUpperCase();

      // FIXED: Aligned payload directly with public.classes table column definition map
      const { error: insertError } = await supabase.from("classes").insert({
        class_name: className,
        description,
        join_code: joinCode,
        teacher_id: user.id,
        is_active: true
      });

      if (insertError) throw insertError;

      await syncUI();
      router.push("/dashboard/teacher");
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during record submission.");
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-xl mx-auto space-y-6 animate-slide-up">
      <div className="flex items-center gap-3 border-b border-border/60 pb-4">
        <button onClick={() => router.back()} className="p-2 border border-border bg-card hover:bg-secondary rounded-xl text-muted hover:text-foreground transition-all">
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">Create Classroom</h1>
          <p className="text-sm text-muted mt-0.5">Initialize an architecture workspace instance manually.</p>
        </div>
      </div>

      {error && <div className="p-3 text-xs bg-red-500/10 text-red-500 rounded-lg border border-red-500/20 leading-relaxed">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold uppercase text-muted tracking-wide">Class Name *</label>
          <input type="text" required placeholder="e.g., AIML" value={className} onChange={(e) => setClassName(e.target.value)} className="w-full rounded-lg border border-border p-2.5 bg-card text-sm text-foreground focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold uppercase text-muted tracking-wide">Description</label>
          <textarea placeholder="Course parameters, scheduling limits, structural criteria parameters..." rows={4} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full rounded-lg border border-border p-2.5 bg-card text-sm text-foreground focus:border-primary focus:ring-1 focus:ring-primary resize-none transition-all" />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={() => router.back()} className="px-4 py-2 text-xs font-semibold rounded-lg border border-border text-foreground hover:bg-secondary transition-colors">Cancel</button>
          <button type="submit" disabled={loading} className="px-4 py-2 text-xs font-semibold text-white bg-primary rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50">
            {loading ? "Deploying Space..." : "Deploy Space"}
          </button>
        </div>
      </form>
    </div>
  );
}