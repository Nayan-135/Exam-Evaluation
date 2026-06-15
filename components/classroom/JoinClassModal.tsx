"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

interface JoinClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function JoinClassModal({ isOpen, onClose, onSuccess }: JoinClassModalProps) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Session expired. Please log in again.");

      // Verify targeted class code exists
      const { data: classData, error: classError } = await supabase
        .from("classes")
        .select("id")
        .eq("join_code", code.trim().toUpperCase())
        .maybeSingle();

      if (classError) throw classError;
      if (!classData) throw new Error("No class discovered matching that dynamic join code.");

      // Map member connection record
      const { error: joinError } = await supabase.from("class_members").insert({
        class_id: classData.id,
        student_id: user.id
      });

      if (joinError) {
        if (joinError.code === "23505") throw new Error("You are already enrolled within this classroom.");
        throw joinError;
      }

      setCode("");
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "Something went sideways.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-background/80 backdrop-blur-xs" onClick={onClose} />
      
      <div className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-xl animate-slide-up">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <h3 className="text-md font-bold text-foreground">Join Classroom</h3>
          <button onClick={onClose} className="text-muted hover:text-foreground">✕</button>
        </div>

        {error && <div className="mt-3 p-2.5 text-xs bg-red-50 text-red-600 rounded-lg border border-red-100">{error}</div>}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-foreground">Dynamic Join Code</label>
            <input type="text" maxLength={6} required placeholder="ABCXYZ" value={code} onChange={(e) => setCode(e.target.value)} className="w-full text-center font-mono tracking-widest text-lg uppercase rounded-lg border border-border p-2.5 bg-background text-foreground focus:border-primary" />
            <p className="text-[11px] text-muted text-center">Ask your instructor for the 6-digit access code[cite: 9].</p>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-border">
            <button type="button" onClick={onClose} className="px-3 py-1.5 text-xs font-medium rounded-lg border border-border hover:bg-secondary">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-1.5 text-xs font-semibold text-white bg-primary rounded-lg hover:bg-blue-600 disabled:opacity-50">
              {loading ? "Joining..." : "Join Class"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}