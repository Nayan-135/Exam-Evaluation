import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center justify-between px-8 py-4 border-b border-border bg-card">
        <span className="font-bold text-lg">AI-LMS</span>
        <div className="flex gap-4">
          <Link href="/auth/sign_in" className="text-sm font-medium text-muted hover:text-foreground">Log in</Link>
          <Link href="/auth/sign_up" className="px-4 py-2 text-sm font-semibold bg-primary text-white rounded-lg">Get Started</Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center text-center px-6 pt-20">
        <h1 className="text-5xl font-bold tracking-tight mb-6 animate-slide-up">
          Smarter grading, <span className="text-primary">better outcomes.</span>
        </h1>
        <p className="text-muted max-w-lg mb-10 animate-slide-up delay-100">
          Automate exam evaluations with AI similarity scoring and manage your entire classroom workflow from one dashboard[cite: 1].
        </p>
        <div className="flex gap-4 animate-slide-up delay-200">
          <Link href="/auth/sign_up" className="px-8 py-3 bg-primary text-white font-semibold rounded-lg">Start as Teacher</Link>
          <Link href="/auth/sign_up" className="px-8 py-3 border border-border bg-card font-semibold rounded-lg">Join as Student</Link>
        </div>
      </main>
    </div>
  );
}