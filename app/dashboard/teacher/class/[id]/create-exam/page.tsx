"use client";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, Plus, Trash2, HelpCircle, Save, Layers, Calendar } from "lucide-react";

interface QuestionInput {
  question_text: string;
  sample_answer: string;
  marks: number;
}

export default function CreateExamPage() {
  const { id: classId } = useParams();
  const router = useRouter();
  
  // Exam Metadata State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  
  // Questions Sub-Array State (Initialized with one blank question structure)
  const [questions, setQuestions] = useState<QuestionInput[]>([
    { question_text: "", sample_answer: "", marks: 10 }
  ]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Compute total marks on the fly using standard arithmetic accumulation
  const totalExamMarks = questions.reduce((sum, q) => sum + Number(q.marks || 0), 0);

  const handleAddQuestion = () => {
    setQuestions([...questions, { question_text: "", sample_answer: "", marks: 10 }]);
  };

  const handleRemoveQuestion = (index: number) => {
    if (questions.length === 1) return; // Retain at least one query node
    const updated = questions.filter((_, i) => i !== index);
    setQuestions(updated);
  };

  const handleQuestionChange = (index: number, field: keyof QuestionInput, value: any) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    setQuestions(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Exam title is explicitly required.");
      return;
    }
    
    setLoading(true);
    setError("");

    try {
      // 1. Insert the parent record into the 'exams' table
      const { data: examData, error: examError } = await supabase
        .from("exams")
        .insert({
          class_id: classId,
          title: title.trim(),
          description: description.trim(),
          total_marks: totalExamMarks,
          due_date: dueDate ? new Date(dueDate).toISOString() : null,
          is_published: isPublished
        })
        .select("id")
        .single();

      if (examError) throw examError;
      if (!examData) throw new Error("Failed to initialize the exam destination entry.");

      // 2. Prepare child question records embedded with the foreign key context
      const questionsPayload = questions.map((q, idx) => ({
        exam_id: examData.id,
        question_text: q.question_text.trim(),
        sample_answer: q.sample_answer.trim(),
        marks: Number(q.marks || 10),
        question_number: idx + 1
      }));

      // 3. Perform a batch insertion into the 'questions' table
      const { error: questionsError } = await supabase
        .from("questions")
        .insert(questionsPayload);

      if (questionsError) throw questionsError;

      // 4. Navigate cleanly back to the overview panel of the classroom ecosystem
      router.push(`/dashboard/teacher/class/${classId}`);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred while writing parameters to database schema caches.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 animate-slide-up">
      {/* Navigation & Header */}
      <div className="flex items-center gap-3 border-b border-border/60 pb-5">
        <button 
          type="button"
          onClick={() => router.back()} 
          className="p-2 border border-border bg-card hover:bg-secondary rounded-xl text-muted hover:text-foreground transition-all"
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-primary">Assessment Matrix Builder</span>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Design New Examination</h1>
        </div>
      </div>

      {error && (
        <div className="p-4.5 text-xs bg-red-500/10 text-red-500 rounded-xl border border-red-500/20 leading-relaxed font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Section 1: Core Exam Configurations */}
        <div className="bg-card border border-border rounded-2xl p-6 space-y-4 shadow-2xs">
          <h3 className="text-sm font-bold text-foreground border-b border-border/40 pb-2.5">1. Meta Configurations</h3>
          
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-muted uppercase tracking-wide">Exam Title *</label>
            <input 
              type="text" 
              required 
              placeholder="e.g., Database Management Systems Mid-Term" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-border p-3 bg-background text-sm text-foreground focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-muted uppercase tracking-wide">Instructions / Description</label>
            <textarea 
              placeholder="Specify exam boundary rules, systemic targets, or semantic guidelines..." 
              rows={3} 
              value={description} 
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-border p-3 bg-background text-sm text-foreground focus:border-primary focus:ring-1 focus:ring-primary resize-none transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-muted uppercase tracking-wide flex items-center gap-1.5">
                <Calendar size={13}/> Due Date & Time
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
                <Layers size={13}/> Accumulative Evaluation Value
              </label>
              <div className="h-11 rounded-xl border border-border bg-secondary/30 flex items-center px-4 text-sm font-bold text-primary font-mono">
                {totalExamMarks} Marks Calculated
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Dynamic Question Items Area */}
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b border-border/60 pb-2">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <HelpCircle size={16} className="text-primary"/> 2. Question Evaluation Matrix Elements
            </h3>
            <button
              type="button"
              onClick={handleAddQuestion}
              className="flex items-center gap-1.5 text-xs font-bold text-primary bg-primary/5 hover:bg-primary/10 border border-primary/20 px-3.5 py-2 rounded-xl transition-all"
            >
              <Plus size={14} /> Add Next Question
            </button>
          </div>

          {questions.map((q, idx) => (
            <div key={idx} className="bg-card border border-border rounded-2xl p-6 space-y-4 shadow-2xs relative animate-slide-up group">
              <div className="flex justify-between items-center border-b border-border/40 pb-2.5">
                <span className="text-xs font-black text-primary font-mono bg-primary/5 px-2.5 py-0.5 rounded-md border border-primary/10">
                  Question #{idx + 1}
                </span>
                
                {questions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveQuestion(idx)}
                    className="p-1.5 text-muted hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                    title="Remove item node"
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
                    placeholder="Enter assessment question criteria..."
                    value={q.question_text}
                    onChange={(e) => handleQuestionChange(idx, "question_text", e.target.value)}
                    className="w-full rounded-xl border border-border p-2.5 bg-background text-sm text-foreground focus:border-primary transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-muted uppercase">Marks weight *</label>
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
                  AI Evaluation Baseline Answer (Sample Answer)
                </label>
                <textarea
                  placeholder="Provide the core parameters, keywords, and semantic arguments that constitute a full-marks solution. This serves as the baseline embedding for AI similarity scoring."
                  rows={3}
                  value={q.sample_answer}
                  onChange={(e) => handleQuestionChange(idx, "sample_answer", e.target.value)}
                  className="w-full rounded-xl border border-border p-3 bg-background text-sm text-foreground focus:border-primary resize-none transition-all leading-relaxed placeholder:text-muted/60"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Section 3: Publishing Framework Control & Submission */}
        <div className="bg-card border border-border rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-start gap-3">
            <input 
              type="checkbox" 
              id="publishToggle"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="mt-1 h-4 w-4 accent-primary rounded border-border"
            />
            <label htmlFor="publishToggle" className="select-none">
              <p className="text-sm font-bold text-foreground">Publish immediately to student workstation pipelines</p>
              <p className="text-xs text-muted mt-0.5">If left unchecked, this assessment saves as a structural draft.</p>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white text-sm font-bold rounded-xl hover:bg-blue-600 active:scale-95 transition-all shadow-sm disabled:opacity-50 shrink-0"
          >
            <Save size={16} />
            {loading ? "Committing Node..." : "Save Assessment Template"}
          </button>
        </div>

      </form>
    </div>
  );
}