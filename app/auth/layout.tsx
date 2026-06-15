import React from "react";
import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Branding Panel */}
      <div className="hidden lg:flex w-[44%] flex-col justify-between bg-primary p-12 text-white">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="font-bold text-lg">AI-LMS</span>
        </Link>
        <div className="animate-slide-left">
          <h2 className="text-3xl font-bold mb-8">Evaluate smarter.<br />Teach better.<br />Learn faster.</h2>
          <ul className="space-y-4 text-sm text-white/70">
            <li>• AI-Graded exam submissions</li>
            <li>• Real-time performance analytics</li>
            <li>• Zero-setup classroom management</li>
          </ul>
        </div>
        <p className="text-xs text-white/40">© {new Date().getFullYear()} AI-LMS</p>
      </div>

      {/* Form Panel */}
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="w-full max-w-[420px] animate-slide-up">
          {children}
        </div>
      </div>
    </div>
  );
}