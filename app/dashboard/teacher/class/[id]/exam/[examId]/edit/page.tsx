"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, Plus, Trash2, HelpCircle, Save, Layers, Calendar, RefreshCw } from "lucide-react";

interface QuestionInput {
  id?: string; // Presence indicates a pre-existing record row
  question_text: string;
  sample_answer: string;
  marks: number;
}

export default function EditExamPage() {
  const { id: classId, examId } = useParams();
  const router = useRouter();

  // Exam Meta States
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [isPublished, setIsPublished] = useState(false);

  // Questions State array
  const [questions, setQuestions] = useState<QuestionInput[]>([]);
  const [initialQuestionIds, setInitialQuestionIds] = useState<string[]>([]);

  const [loading, setLoading] = useState(true);
  const [committing, setCommitting] = useState(false);
  const [error, setError] = useState("");

  // Aggregate summation total marks calculated reactively
  const totalExamMarks = questions.reduce((sum, q) => sum + Number(q.marks || 0), 0);

  useEffect(() => {
    async function fetchExamStructureForEditing() {
      if (!examId) return;
      setLoading(true);

      // 1. Pull current parent master metadata record parameters
      const { data: examData, error: examErr } = await supabase
        .from("exams")
        .select("*")
        .eq("id", examId)
        .maybeSingle();

      if (examErr) {
        setError(examErr.message);
        setLoading(false);
        return;
      }

      if (examData) {
        setTitle(examData.title);
        setDescription(examData.description || "");
        setIsPublished(examData.is_published || false);
        if (examData.due_date) {
          // Format timestamp string cleanly to fit HTML5 input specification matrices
          const localIsoStr = new Date(examData.due_date).toISOString().slice(0, 16);
          setDueDate(localIsoStr);
        }
      }

      // 2. Fetch associated child question arrays
      const { data: qData } = await supabase
        .from("questions")
        .select("id, question_text, sample_answer, marks")
        .eq("exam_id", examId)
        .order("question_number", { ascending: true });

      if (qData) {
        setQuestions(qData);
        // Cache initial ids locally to evaluate structural deletion matrices later
        setInitialQuestionIds(qData.map((q) => q.id).filter(Boolean) as string[]);
      }
      setLoading(false);
    }

    fetchExamStructureForEditing();
  }, [examId]);

  const handleAddQuestion = () => {
    setQuestions([...questions, { question_text: "", sample_answer: "", marks: 10 }]);
  };

  const handleRemoveQuestion = (index: number) => {
    if (questions.length === 1) return; // Maintain at least one node element
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleQuestionChange = (index: number, field: keyof QuestionInput, value: any) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    setQuestions(updated);
  };

  const handleFormSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("An examination title string context is explicitly required.");
      return;
    }

    setCommitting(true);
    setError("");

    try {
      // 1. Perform master entry metadata updates
      const { error: examUpdateError } = await supabase
        .from("exams")
        .update({
          title: title.trim(),
          description: description.trim(),
          total_marks: totalExamMarks,
          due_date: dueDate ? new Date(dueDate).toISOString() : null,
          is_published: isPublished
        })
        .eq("id", examId);

      if (examUpdateError) throw examUpdateError;

      // 2. Evaluate structural items targeted for deletion
      const currentQuestionIds = questions.map((q) => q.id).filter(Boolean) as string[];
      const idsToDelete = initialQuestionIds.filter((id) => !currentQuestionIds.includes(id));

      if (idsToDelete.length > 0) {
        const { error: deleteError } = await supabase
          .from("questions")
          .delete()
          .in("id", idsToDelete);
        if (deleteError) throw deleteError;
      }

      // 3. Process remaining question nodes sequentially via upside transactions
      for (let idx = 0; idx < questions.length; idx++) {
        const q = questions[idx];
        const basePayload = {
          exam_id: examId,
          question_text: q.question_text.trim(),
          sample_answer: q.sample_answer.trim(),
          marks: Number(q.marks || 10),
          question_number: idx + 1
        };

        if (q.id) {
          // Pre-existing node: execute standard modifications
          const { error: updateQErr } = await supabase
            .from("questions")
            .update(basePayload)
            .eq("id", q.id);
          if (updateQErr) throw updateQErr;
        } else {
          // New node configuration: instantiate addition
          const { error: insertQErr } = await supabase
            .from("questions")
            .insert(basePayload);
          if (insertQErr) throw insertQErr;
        }
      }

      // 4. Clean cache fallback traces and reroute smoothly to control room view
      router.push(`/dashboard/teacher/class/${classId}/exam/${examId}`);
    } catch (err: any) {
      setError(err.message || "An exception occurred while modifying configuration parameters.");
    } finally {
      setCommitting(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-sm font-mono text-muted animate-pulse">De-serializing template matrix configurations...</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 animate-slide-up">
      {/* Header element trace */}
      <div className="flex items-center gap-3 border-b border-border/60 pb-5">
        <button 
          type="button"
          onClick={() => router.back()} 
          className="p-2 border border-border bg-card hover:bg-secondary rounded-xl text-muted hover:text-foreground transition-all"
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-primary">Template Modifier Control Deck</span>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Edit Assessment Framework</h1>
        </div>
      </div>

      {error && (
        <div className="p-4 text-xs bg-red-500/10 text-red-500 rounded-xl border border-red-500/20 leading-relaxed font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleFormSubmission} className="space-y-8">
        
        {/* Exam Meta Configurations */}
        <div className="bg-card border border-border rounded-2xl p-6 space-y-4 shadow-2xs">
          <h3 className="text-sm font-bold text-foreground border-b border-border/40 pb-2.5">Core Parameters</h3>
          
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-muted uppercase tracking-wide">Exam Title *</label>
            <input 
              type="text" 
              required 
              placeholder="e.g., AI Mock Trial Assessment" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-border p-3 bg-background text-sm text-foreground focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-muted uppercase tracking-wide">Instructions / Summary</label>
            <textarea 
              placeholder="Specify structural assessment parameters..." 
              rows={3} 
              value={description} 
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-border p-3 bg-background text-sm text-foreground focus:border-primary focus:ring-1 focus:ring-primary resize-none transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-muted uppercase tracking-wide flex items-center gap-1.5">
                <Calendar size={13}/> Closing Threshold Target
              </label>
              <input 
                type="datetime-local" 
                value={dueDate} 
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full rounded-xl border border-border p-2.5 bg-background text-sm text-muted focus:text-foreground focus:border-primary transition-all font-mono"
              />
            </div>
            
            <div className="flex flex-col gap-1.5 justify-end pb-1">
              <label className="text-xs font-semibold text-muted uppercase tracking-wide flex items-center gap-1.5 mb-2">
                Accumulated Point Index Allocation
              </label>
              <div className="h-11 rounded-xl border border-border bg-secondary/30 flex items-center px-4 text-sm font-bold text-primary font-mono">
                {totalExamMarks} Marks Calculated
              </div>
            </div>
          </div>
        </div>

        {/* Question Array Iteration Canvas */}
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b border-border/60 pb-2">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <HelpCircle size={16} className="text-primary"/> Question Elements Track
            </h3>
            <button
              type="button"
              onClick={handleAddQuestion}
              className="flex items-center gap-1.5 text-xs font-bold text-primary bg-primary/5 hover:bg-primary/10 border border-primary/20 px-3.5 py-2 rounded-xl transition-all"
            >
              <Plus size={14} /> Append Next Question
            </button>
          </div>

          {questions.map((q, idx) => (
            <div key={idx} className="bg-card border border-border rounded-2xl p-6 space-y-4 shadow-2xs relative animate-slide-up group">
              <div className="flex justify-between items-center border-b border-border/40 pb-2.5">
                <span className="text-xs font-black text-primary font-mono bg-primary/5 px-2.5 py-0.5 rounded-md border border-primary/10">
                  Question Node #{idx + 1}
                </span>
                
                {questions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveQuestion(idx)}
                    className="p-1.5 text-muted hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                    title="Remove item layout"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-3 flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-muted uppercase">Question Text *</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter explicit query text prompt limits..."
                    value={q.question_text}
                    onChange={(e) => handleQuestionChange(idx, "question_text", e.target.value)}
                    className="w-full rounded-xl border border-border p-2.5 bg-background text-sm text-foreground focus:border-primary transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-muted uppercase">Marks Weight *</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={q.marks}
                    onChange={(e) => handleQuestionChange(idx, "marks", parseInt(e.target.value) || 0)}
                    className="w-full rounded-xl border border-border p-2.5 bg-background text-sm text-foreground font-mono font-bold focus:border-primary transition-all"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-muted uppercase">
                  AI Evaluation Baseline Target Answer Key *
                </label>
                <textarea
                  required
                  placeholder="Provide correct structural milestones, keywords, and systemic arguments required to receive maximum evaluation value marks allocations during automatic AI embedding similarity scans."
                  rows={3}
                  value={q.sample_answer}
                  onChange={(e) => handleQuestionChange(idx, "sample_answer", e.target.value)}
                  className="w-full rounded-xl border border-border p-3 bg-background text-sm text-foreground focus:border-primary resize-none transition-all leading-relaxed"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Form Submission Docking Layer with Direct Publishing Triggers */}
        <div className="bg-card border border-border rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-start gap-3">
            <input 
              type="checkbox" 
              id="publishStatusToggle"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="mt-1 h-4 w-4 accent-primary rounded border-border"
            />
            <label htmlFor="publishStatusToggle" className="select-none">
              <p className="text-sm font-bold text-foreground">Publish and deploy assessment immediately to students</p>
              <p className="text-xs text-muted mt-0.5">Checking this instantly triggers broadcast alerts down to registered student notification dropdown layers.</p>
            </label>
          </div>

          <button
            type="submit"
            disabled={committing}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white text-sm font-bold rounded-xl hover:bg-blue-600 active:scale-95 transition-all shadow-sm disabled:opacity-50 shrink-0 font-sans"
          >
            {committing ? (
              <><RefreshCw size={15} className="animate-spin" /> Updating Assets...</>
            ) : (
              <><Save size={16} /> Save & Synchronize Template</>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}