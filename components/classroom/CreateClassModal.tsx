"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { X } from "lucide-react";

interface CreateClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateClassModal({ isOpen, onClose, onSuccess }: CreateClassModalProps) {
  const [className, setClassName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const generateJoinCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Authentication session not found. Please log in again.");

      const joinCode = generateJoinCode();

      // FIXED: Swapped 'name' to 'class_name' to accurately match your Supabase schema configuration
      const { error: insertError } = await supabase.from("classes").insert({
        class_name: className,
        description: description,
        join_code: joinCode,
        teacher_id: user.id,
        is_active: true
      });

      if (insertError) throw insertError;

      setClassName("");
      setDescription("");
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "An unexpected database insertion error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-background/80 backdrop-blur-xs transition-opacity" onClick={onClose} />
      
      <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-xl transition-all animate-slide-up">
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <h3 className="text-lg font-bold text-foreground">Create New Class</h3>
          <button onClick={onClose} className="rounded-lg p-1 text-muted hover:bg-secondary hover:text-foreground transition-colors">
            <X size={16} />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 text-xs bg-red-500/10 text-red-500 rounded-lg border border-red-500/20 leading-relaxed">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-foreground">Class Name *</label>
            <input 
              type="text" 
              required 
              placeholder="e.g., AIML" 
              value={className} 
              onChange={(e) => setClassName(e.target.value)} 
              className="w-full rounded-lg border border-border p-2.5 bg-background text-sm text-foreground focus:border-primary focus:ring-1 focus:ring-primary transition-all" 
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-foreground">Description</label>
            <textarea 
              placeholder="Optional details or section schedules..." 
              rows={3} 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              className="w-full rounded-lg border border-border p-2.5 bg-background text-sm text-foreground focus:border-primary focus:ring-1 focus:ring-primary resize-none transition-all" 
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-semibold rounded-lg border border-border text-foreground hover:bg-secondary transition-colors">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 text-xs font-semibold text-white bg-primary rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50">
              {loading ? "Creating..." : "Create Class"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}