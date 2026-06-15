"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, Save, ShieldCheck, Sparkles, AlertCircle, HelpCircle, FileText, CheckCircle2 } from "lucide-react";

export default function StudentExamWorkspace() {
  const { id: classId, examId } = useParams();
  const router = useRouter();

  const [exam, setExam] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [itemizedGrades, setItemizedGrades] = useState<any[]>([]);
  
  const [submission, setSubmission] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [evaluating, setEvaluating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function initWorkspace() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // 1. Load exam metadata
      const { data: examData } = await supabase.from("exams").select("*").eq("id", examId).single();
      
      // 2. Load questions
      const { data: qData } = await supabase.from("questions").select("*").eq("exam_id", examId).order("question_number", { ascending: true });
      
      // 3. Check for an existing student submission
      const { data: subData } = await supabase.from("submissions").select("*").eq("exam_id", examId).eq("student_id", user.id).maybeSingle();

      if (examData) setExam(examData);
      if (qData) setQuestions(qData);
      
      if (subData) {
        setSubmission(subData);
        
        // Populate typed answers from submission history metadata matrix
        if (subData.student_answers) {
          const mappedAnswers: { [key: string]: string } = {};
          subData.student_answers.forEach((ans: any) => {
            mappedAnswers[ans.question_id] = ans.answer_text;
          });
          setAnswers(mappedAnswers);
        }

        // If the teacher has released the results, fetch detailed itemized marks and feedback
        if (subData.is_released_by_teacher) {
          const { data: gradesData } = await supabase
            .from("answers")
            .select("*")
            .eq("submission_id", subData.id);
          if (gradesData) setItemizedGrades(gradesData);
        }
      }
      setLoading(false);
    }
    initWorkspace();
  }, [examId]);

  const handleTextChange = (qId: string, txt: string) => {
    if (submission && submission.status === "SUBMITTED") return; // Read-only if locked
    setAnswers({ ...answers, [qId]: txt });
  };

  // Safe and defensive AI Evaluation connection routine targeting Gemini Pro 1.5 API models
  const runAIEvaluationPipeline = async (questionText: string, sampleAnswer: string, studentAnswer: string, maxMarks: number) => {
    const key = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!key) throw new Error("Gemini API access key configuration token is missing in .env environment caches.");

    const prompt = `
      You are an expert academic evaluator tool grading an LMS exam response. 
      Analyze the student's response based on the baseline answer guidelines provided.
      
      [Question]: ${questionText}
      [Baseline Target Answer]: ${sampleAnswer}
      [Student Answer]: ${studentAnswer}
      [Maximum Possible Marks]: ${maxMarks}

      Perform a rigorous comparison. Award marks proportionately based on how well the student's answer captures the core concepts, correctness, and keywords compared to the baseline answer. Provide a constructive, professional critique.
      
      Return EXACTLY a clean JSON format block with no markdown wrappers:
      {
        "awarded_marks": number,
        "feedback": "string critique text"
      }
    `;

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });

    const outputJson = await res.json();

    // FIXED: Bulletproof optional chaining and node check conditions guarding against API schema structure variance crashes
    const textSegmentResult = outputJson?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!textSegmentResult) {
      console.error("Gemini API error trace response envelope:", outputJson);
      throw new Error("Invalid or empty response payload returned from the AI evaluation engine.");
    }

    const cleanJsonString = textSegmentResult.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleanJsonString);
  };

  const executeSubmissionPipeline = async (isFinalCommit: boolean) => {
    setEvaluating(true);
    setError("");
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User session token mismatch error.");

      const formattedAnswersArray = questions.map(q => ({
        question_id: q.id,
        answer_text: answers[q.id] || ""
      }));

      let cumulativeScore = 0;
      let evaluatedAnswersList: any[] = [];

      // Run AI pipeline evaluations synchronously only if explicitly finalizing submission
      if (isFinalCommit) {
        for (const q of questions) {
          const studentTxt = answers[q.id] || "";
          try {
            const aiGradingResult = await runAIEvaluationPipeline(q.question_text, q.sample_answer, studentTxt, q.marks);
            cumulativeScore += Number(aiGradingResult.awarded_marks || 0);
            evaluatedAnswersList.push({
              question_id: q.id,
              answer_text: studentTxt,
              awarded_marks: Number(aiGradingResult.awarded_marks || 0),
              feedback: aiGradingResult.feedback || "Automated review completed."
            });
          } catch (e) {
            console.error("AI automated pipeline calculation fault line:", e);
            evaluatedAnswersList.push({ 
              question_id: q.id, 
              answer_text: studentTxt, 
              awarded_marks: 0, 
              feedback: "Automated analysis pipeline encountered a timeout error profile." 
            });
          }
        }
      }

      const submissionPayload = {
        exam_id: examId,
        student_id: user.id,
        student_answers: formattedAnswersArray,
        total_marks: cumulativeScore,
        status: isFinalCommit ? "SUBMITTED" : "DRAFT",
        feedback: isFinalCommit ? `Automated AI evaluation grading metrics generated successfully.` : null,
        evaluated_at: isFinalCommit ? new Date().toISOString() : null,
        submitted_at: isFinalCommit ? new Date().toISOString() : null
      };

      let saveResult;
      if (submission) {
        saveResult = await supabase.from("submissions").update(submissionPayload).eq("id", submission.id).select().single();
      } else {
        saveResult = await supabase.from("submissions").insert(submissionPayload).select().single();
      }

      if (saveResult.error) throw saveResult.error;
      
      // Batch write items inside public.answers table relational schema maps
      if (isFinalCommit && saveResult.data) {
        const answersPayload = evaluatedAnswersList.map(item => ({
          submission_id: saveResult.data.id,
          question_id: item.question_id,
          answer_text: item.answer_text,
          awarded_marks: item.awarded_marks,
          feedback: item.feedback
        }));
        await supabase.from("answers").insert(answersPayload);
      }

      setSubmission(saveResult.data);
      if (isFinalCommit) {
        router.push(`/dashboard/student/class/${classId}`);
      } else {
        alert("Draft parameters saved successfully.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to commit response data mapping matrices.");
    } finally {
      setEvaluating(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-sm font-mono text-muted animate-pulse">Synchronizing assessment workstation layers...</div>;

  const isLocked = submission?.status === "SUBMITTED";
  const resultsPublished = submission?.is_released_by_teacher;
  const gradeLookup = new Map(itemizedGrades.map(g => [g.question_id, g]));

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 animate-slide-up">
      
      {/* Header View Mapping */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border/60 pb-5">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push(`/dashboard/student/class/${classId}`)} className="p-2 border border-border bg-card hover:bg-secondary rounded-xl text-muted hover:text-foreground transition-all">
            <ArrowLeft size={16} />
          </button>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-primary">Examination Engine View</span>
            <h1 className="text-2xl font-black text-foreground tracking-tight">{exam?.title}</h1>
          </div>
        </div>

        {isLocked && (
          <div className="flex flex-wrap gap-2 shrink-0">
            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 border border-green-500/20 text-green-500 text-xs font-bold rounded-xl">
              <ShieldCheck size={13}/> Handed In
            </span>
            {resultsPublished && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 border border-primary/20 text-primary text-xs font-black rounded-xl font-mono">
                Final Grade: {submission.total_marks} / {exam.total_marks}m
              </span>
            )}
          </div>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-xs font-semibold leading-relaxed">
          <AlertCircle size={14} className="inline mr-1.5" /> {error}
        </div>
      )}

      {/* Main Questions Array Mapping Layout */}
      <div className="space-y-6">
        {questions.map((q, idx) => {
          const matchingGrade = gradeLookup.get(q.id);
          
          return (
            <div key={q.id} className="p-6 bg-card border border-border rounded-2xl space-y-4 shadow-2xs">
              <div className="flex justify-between items-center font-mono text-xs border-b border-border/40 pb-2">
                <span className="font-bold text-primary">Question #{idx + 1}</span>
                <div className="flex items-center gap-3 font-bold">
                  {resultsPublished && matchingGrade ? (
                    <span className="text-primary bg-primary/5 px-2 py-0.5 border border-primary/10 rounded-md">
                      Score: {matchingGrade.awarded_marks} / {q.marks}m
                    </span>
                  ) : (
                    <span className="text-muted">Weight: {q.marks} Marks</span>
                  )}
                </div>
              </div>

              <p className="text-sm font-bold text-foreground leading-relaxed">{q.question_text}</p>
              
              <textarea
                disabled={isLocked || evaluating}
                value={answers[q.id] || ""}
                onChange={(e) => handleTextChange(q.id, e.target.value)}
                placeholder="Type your structured exam answer response here..."
                rows={5}
                className="w-full p-3 bg-background border border-border text-sm text-foreground rounded-xl focus:border-primary resize-none disabled:opacity-70 transition-all leading-relaxed placeholder:text-muted/50"
              />

              {/* Review AI Insights and Comments if published by the teacher */}
              {resultsPublished && matchingGrade?.feedback && (
                <div className="p-4 bg-primary/5 border border-primary/10 rounded-xl text-xs text-muted leading-relaxed animate-slide-up">
                  <span className="font-bold text-foreground block mb-1 flex items-center gap-1.5">
                    <Sparkles size={13} className="text-primary" /> Faculty & AI Feedback Metrics:
                  </span>
                  {matchingGrade.feedback}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Interactive Bottom Control Action Row */}
      {!isLocked && (
        <div className="p-4 bg-card border border-border rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4 shadow-2xs">
          <p className="text-[11px] text-muted font-medium">
            * Finalizing will run the answers through the semantic similarity grading pipelines.
          </p>
          <div className="flex gap-2 w-full sm:w-auto shrink-0">
            <button 
              type="button" 
              disabled={evaluating} 
              onClick={() => executeSubmissionPipeline(false)} 
              className="flex-1 sm:flex-none px-5 py-2.5 text-xs font-bold border border-border bg-transparent text-foreground hover:bg-secondary rounded-xl transition-all"
            >
              Save Draft
            </button>
            <button 
              type="button" 
              disabled={evaluating} 
              onClick={() => executeSubmissionPipeline(true)} 
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-bold bg-primary text-white hover:bg-blue-600 rounded-xl transition-all shadow-md active:scale-98"
            >
              {evaluating ? (
                <>Evaluating Answer Matrix...</>
              ) : (
                <><Sparkles size={14}/> Hand In & AI Grade</>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}