"use client";

import { useState } from "react";
import { UserRole } from "@/types";
import { RoleSelector } from "./RoleSelector";
import Link from "next/link";

export function SignUpForm() {
  const [role, setRole] = useState<UserRole>("STUDENT");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    orgCode: "", // Added for teacher verification
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Connect to your /users database table 
    console.log("Registering:", { role, ...formData });
  };

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Create an account
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
          Join the platform as a {role.toLowerCase()}
        </p>
      </div>

      <RoleSelector role={role} setRole={setRole} />

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex gap-4">
          <div className="flex flex-col gap-2 w-full">
            <label className="text-sm font-medium text-foreground" htmlFor="firstName">First Name</label>
            <input
              id="firstName"
              required
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              className="flex h-10 w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-foreground dark:border-zinc-800"
            />
          </div>
          <div className="flex flex-col gap-2 w-full">
            <label className="text-sm font-medium text-foreground" htmlFor="lastName">Last Name</label>
            <input
              id="lastName"
              required
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              className="flex h-10 w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-foreground dark:border-zinc-800"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-foreground" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            required
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="flex h-10 w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-foreground dark:border-zinc-800"
          />
        </div>
        
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-foreground" htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            required
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="flex h-10 w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-foreground dark:border-zinc-800"
          />
        </div>

        {/* Dynamic field based on role: Only Teachers need the Organization Code */}
        {role === "TEACHER" && (
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground" htmlFor="orgCode">Organization Code</label>
            <input
              id="orgCode"
              type="text"
              required={role === "TEACHER"} // Makes it mandatory only if they are signing up as a teacher
              onChange={(e) => setFormData({ ...formData, orgCode: e.target.value })}
              className="flex h-10 w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-foreground dark:border-zinc-800"
              placeholder="Enter unique code from your organization"
            />
          </div>
        )}

        <button
          type="submit"
          className="mt-2 flex h-10 w-full items-center justify-center rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-zinc-800 dark:hover:bg-zinc-200"
        >
          Sign Up
        </button>
      </form>

      <div className="text-center text-sm text-zinc-500 dark:text-zinc-400">
        Already have an account?{" "}
        <Link href="/auth/sign_in" className="font-medium text-foreground hover:underline">
          Sign in
        </Link>
      </div>
    </div>
  );
}