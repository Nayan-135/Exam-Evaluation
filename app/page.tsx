import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-black">
      {/* Navigation Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
        <div className="font-bold text-xl tracking-tight text-foreground">
          AI-LMS
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/auth/sign_in"
            className="text-sm font-medium text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white transition-colors"
          >
            Log in
          </Link>
          <Link
            href="/auth/sign_up"
            className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-zinc-800 dark:hover:bg-zinc-200"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center py-24">
        <div className="inline-flex items-center rounded-full border border-zinc-200 bg-white px-3 py-1 text-sm font-medium dark:border-zinc-800 dark:bg-zinc-950 mb-8">
          <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2"></span>
          AI-Evaluation is now live
        </div>

        <h1 className="max-w-3xl text-5xl font-bold tracking-tight text-foreground sm:text-6xl mb-6">
          Smarter grading, <br className="hidden sm:block" />
          better learning outcomes.
        </h1>
        
        <p className="max-w-2xl text-lg text-zinc-600 dark:text-zinc-400 mb-10">
          A unified platform for teachers and students. Automate exam evaluations with AI, track performance analytics, and manage classrooms effortlessly.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center max-w-md">
          <Link
            href="/auth/sign_up"
            className="flex h-12 flex-1 items-center justify-center rounded-full bg-foreground px-8 text-base font-medium text-background transition-colors hover:bg-zinc-800 dark:hover:bg-zinc-200"
          >
            Start as Teacher
          </Link>
          <Link
            href="/auth/sign_up"
            className="flex h-12 flex-1 items-center justify-center rounded-full border border-zinc-200 bg-white px-8 text-base font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900"
          >
            Join as Student
          </Link>
        </div>
      </main>
    </div>
  );
}