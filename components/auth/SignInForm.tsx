"use client";

import { useState } from "react";
import { UserRole } from "@/types";
import { RoleSelector } from "./RoleSelector";
import Link from "next/link";

export function SignInForm() {
  const [role, setRole] = useState<UserRole>("STUDENT");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement your sign-in logic here (e.g., NextAuth or standard API call)
    console.log("Signing in:", { role, email, password });
  };

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Welcome back
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
          Enter your details to access your {role.toLowerCase()} account
        </p>
      </div>

      <RoleSelector role={role} setRole={setRole} />

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-foreground" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex h-10 w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-foreground dark:border-zinc-800"
            placeholder="m@example.com"
          />
        </div>
        
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-foreground" htmlFor="password">
              Password
            </label>
            <Link href="/forgot-password" className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400">
              Forgot password?
            </Link>
          </div>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="flex h-10 w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-foreground dark:border-zinc-800"
          />
        </div>

        <button
          type="submit"
          className="mt-2 flex h-10 w-full items-center justify-center rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-zinc-800 dark:hover:bg-zinc-200"
        >
          Sign In
        </button>
      </form>
      
      <div className="text-center text-sm text-zinc-500 dark:text-zinc-400">
        Don&apos;t have an account?{" "}
        <Link href="/sign-up" className="font-medium text-foreground hover:underline">
          Sign up
        </Link>
      </div>
    </div>
  );
}