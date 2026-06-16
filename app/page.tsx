import Link from "next/link";
import { Sparkles, Bell, FileSpreadsheet, Layers, ShieldCheck, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground antialiased selection:bg-primary/20">
      
      {/* Navigation Header */}
      <header className="flex items-center justify-between px-8 py-4 border-b border-border/60 bg-card/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center text-white font-black text-xs shadow-xs">
            AI
          </div>
          <span className="font-extrabold text-lg tracking-tight">AI-LMS</span>
        </div>
        
        <div className="flex items-center gap-5">
          <Link href="/auth/sign_in" className="text-sm font-bold text-muted hover:text-foreground transition-colors">
            Log in
          </Link>
          <Link href="/auth/sign_up" className="px-4 py-2 text-sm font-bold bg-primary text-white rounded-xl hover:bg-blue-600 transition-all shadow-xs active:scale-98">
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero Interactive Core Section */}
      <main className="flex-1 flex flex-col items-center px-6 pt-24 pb-20 max-w-6xl mx-auto space-y-24">
        
        <div className="flex flex-col items-center text-center space-y-6 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[11px] font-bold uppercase tracking-wider animate-fade-in">
            <Sparkles size={12} /> Next-Generation Academic Workspace
          </div>
          
          <h1 className="text-5xl sm:text-6xl font-black tracking-tight leading-tight animate-slide-up">
            Smarter grading, <br />
            <span className="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
              better outcomes.
            </span>
          </h1>
          
          <p className="text-sm sm:text-base text-muted max-w-xl mx-auto leading-relaxed animate-slide-up delay-100">
            Automate exam evaluations with Gemini-powered semantic similarity grading. Coordinate classroom feeds, review automated critiques, and release grades instantly from a dark minimalist dashboard infrastructure.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 pt-4 animate-slide-up delay-200">
            <Link href="/auth/sign_up" className="flex items-center gap-1.5 px-8 py-3.5 bg-primary text-white font-bold rounded-xl hover:bg-blue-600 shadow-md transition-all active:scale-95 text-sm group">
              Start as Teacher <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link href="/auth/sign_up" className="px-8 py-3.5 border border-border bg-card/60 font-bold rounded-xl hover:bg-secondary text-foreground transition-all active:scale-95 text-sm">
              Join as Student
            </Link>
          </div>
        </div>

        {/* Dynamic Interactive Features Array Grid */}
        <div className="w-full space-y-8 pt-6">
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-black tracking-tight text-foreground">Engineered Features Ecosystem</h2>
            <p className="text-xs text-muted">A full stack blueprint tailored for rapid academic deployments.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Feature 1: AI Grading */}
            <div className="p-6 bg-card/60 border border-border rounded-2xl space-y-4 shadow-2xs hover:border-primary/20 transition-all group">
              <div className="p-2.5 bg-primary/5 border border-primary/10 text-primary rounded-xl w-fit">
                <Sparkles size={18} />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-foreground group-hover:text-primary transition-colors">Gemini Similarity Scoring</h3>
                <p className="text-xs text-muted mt-2 leading-relaxed">
                  Submissions run through custom contextual models, matching student answers against teacher baseline guidelines to produce real-time grades and actionable text feedback.
                </p>
              </div>
            </div>

            {/* Feature 2: Deep-Linked Notifications */}
            <div className="p-6 bg-card/60 border border-border rounded-2xl space-y-4 shadow-2xs hover:border-primary/20 transition-all group">
              <div className="p-2.5 bg-purple-500/5 border border-purple-500/10 text-purple-500 rounded-xl w-fit">
                <Bell size={18} />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-foreground group-hover:text-purple-500 transition-colors">Deep-Linked Notifications</h3>
                <p className="text-xs text-muted mt-2 leading-relaxed">
                  Automated Supabase database triggers push instant alerts to users upon test publication or hand-in, featuring direct navigation links to jump straight into targeted views.
                </p>
              </div>
            </div>

            {/* Feature 3: Native Excel Ledgers */}
            <div className="p-6 bg-card/60 border border-border rounded-2xl space-y-4 shadow-2xs hover:border-primary/20 transition-all group">
              <div className="p-2.5 bg-green-500/5 border border-green-500/10 text-green-500 rounded-xl w-fit">
                <FileSpreadsheet size={18} />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-foreground group-hover:text-green-500 transition-colors">Clean Presentation Ledgers</h3>
                <p className="text-xs text-muted mt-2 leading-relaxed">
                  A minimal export sub-page that formats student lists down to only Student Name, Exam Title, and Score Obtained for native printing (`Ctrl + P`) or fallback CSV spreadsheet downloads.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Platform Status Ribbon */}
        <div className="w-full flex justify-center pt-8">
          <div className="inline-flex items-center gap-4 px-5 py-2.5 rounded-xl border border-border/60 bg-card/30 text-[11px] font-mono font-bold text-muted shadow-2xs">
            <span className="flex items-center gap-1"><Layers size={13}/> Stack: Next.js + Supabase</span>
            <span className="h-3 w-px bg-border" />
            <span className="flex items-center gap-1 text-green-500"><ShieldCheck size={13}/> Global Pipelines Operational</span>
          </div>
        </div>

      </main>

      {/* Footer Branding block */}
      <footer className="border-t border-border/40 py-6 px-8 text-center text-[11px] text-muted/60 font-medium font-sans bg-card/20">
        &copy; {new Date().getFullYear()} AI-LMS Security & Education Systems Core. All rights reserved.
      </footer>
    </div>
  );
}