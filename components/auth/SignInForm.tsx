"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export function SignInForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) { setError(authError.message); setLoading(false); return; }

    const { data: profile } = await supabase.from("users").select("role").eq("id", data.user.id).single();
    router.push(profile?.role === "TEACHER" ? "/dashboard/teacher" : "/dashboard/student");
  };

  return (
    <div className="flex w-full flex-col gap-7">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
        <p className="text-sm text-muted mt-1">Sign in to your AI-LMS account.</p>
      </div>

      {error && <div className="p-3 text-xs bg-red-50 text-red-600 rounded-lg border border-red-100">{error}</div>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input type="email" placeholder="Email address" required className="w-full rounded-lg border border-border p-2.5 bg-card" onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" required className="w-full rounded-lg border border-border p-2.5 bg-card" onChange={(e) => setPassword(e.target.value)} />
        <button type="submit" disabled={loading} className="w-full rounded-lg py-2.5 font-semibold text-white bg-primary disabled:opacity-50">
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
      <p className="text-center text-sm text-muted">
        Don't have an account? <Link href="/auth/sign_up" className="font-semibold text-primary">Create one</Link>
      </p>
    </div>
  );
}