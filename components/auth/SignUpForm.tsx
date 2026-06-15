"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { RoleSelector } from "./RoleSelector";
import { UserRole } from "@/types";
import { supabase } from "@/lib/supabase";

export function SignUpForm() {
  const router = useRouter();
  const [role, setRole] = useState<UserRole>("STUDENT");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "", password: "", orgCode: "" });

  const set = (key: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [key]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (role === "TEACHER" && formData.orgCode !== "niggawhat") {
        setError("Invalid Teacher Code. Contact your administrator.");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase.auth.signUp({ email: formData.email, password: formData.password });
      if (error) { setError(error.message); setLoading(false); return; }

      const userId = data.user?.id;
      if (!userId) { setError("Account creation failed. Try again."); setLoading(false); return; }

      const { error: insertError } = await supabase.from("users").insert({
        id: userId, first_name: formData.firstName, last_name: formData.lastName,
        email: formData.email, role,
      });

      if (insertError) { setError(insertError.message); setLoading(false); return; }

      router.push(role === "TEACHER" ? "/dashboard/teacher" : "/dashboard/student");
    } catch {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  const inputClass = `
    w-full rounded-lg px-3.5 py-2.5 text-sm transition-all
    bg-card text-foreground placeholder:text-muted
    border border-border focus:border-primary focus:ring-2
  `;

  return (
    <div className="flex w-full flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Create account</h1>
        <p className="text-sm text-muted mt-1">Join AI-LMS as a student or teacher.</p>
      </div>

      <RoleSelector role={role} setRole={setRole} />

      {error && (
        <div className="animate-slide-down rounded-lg border px-4 py-3 text-sm"
          style={{ borderColor: "#fca5a5", background: "#fef2f2", color: "#dc2626" }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">First name</label>
            <input placeholder="Jane" required onChange={set("firstName")} className={inputClass} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">Last name</label>
            <input placeholder="Doe" required onChange={set("lastName")} className={inputClass} />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">Email address</label>
          <input type="email" placeholder="you@example.com" required onChange={set("email")} className={inputClass} />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">Password</label>
          <input type="password" placeholder="••••••••" required onChange={set("password")} className={inputClass} />
        </div>

        {role === "TEACHER" && (
          <div className="flex flex-col gap-1.5 animate-slide-down">
            <label className="text-sm font-medium text-foreground">Teacher Code</label>
            <input placeholder="Code from your administrator" required onChange={set("orgCode")} className={inputClass} />
            <p className="text-xs text-muted">Contact your institution admin for this code.</p>
          </div>
        )}

        <button type="submit" disabled={loading}
          className="mt-1 w-full rounded-lg py-2.5 text-sm font-semibold text-white transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
          style={{ background: "var(--primary)" }}>
          {loading && <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
          </svg>}
          {loading ? "Creating account…" : "Create Account"}
        </button>
      </form>

      <p className="text-center text-sm text-muted">
        Already have an account?{" "}
        <Link href="/auth/sign_in" className="font-semibold text-primary hover:underline">Sign in</Link>
      </p>
    </div>
  );
}