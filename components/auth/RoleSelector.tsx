"use client";

import { UserRole } from "@/types";

interface RoleSelectorProps {
  role: UserRole;
  setRole: (role: UserRole) => void;
}

export function RoleSelector({ role, setRole }: RoleSelectorProps) {
  return (
    <div className="flex w-full rounded-lg bg-zinc-100 p-1 dark:bg-zinc-900">
      <button
        type="button"
        onClick={() => setRole("STUDENT")}
        className={`flex-1 rounded-md py-2 text-sm font-medium transition-all ${
          role === "STUDENT"
            ? "bg-white text-black shadow-sm dark:bg-zinc-800 dark:text-white"
            : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
        }`}
      >
        Student
      </button>
      <button
        type="button"
        onClick={() => setRole("TEACHER")}
        className={`flex-1 rounded-md py-2 text-sm font-medium transition-all ${
          role === "TEACHER"
            ? "bg-white text-black shadow-sm dark:bg-zinc-800 dark:text-white"
            : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
        }`}
      >
        Teacher
      </button>
    </div>
  );
}