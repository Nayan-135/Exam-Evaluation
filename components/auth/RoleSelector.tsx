"use client";
import { UserRole } from "@/types";

interface RoleSelectorProps {
  role: UserRole;
  setRole: (role: UserRole) => void;
}

export function RoleSelector({ role, setRole }: RoleSelectorProps) {
  return (
    <div className="flex w-full rounded-xl p-1 gap-1 bg-secondary">
      {(["STUDENT", "TEACHER"] as UserRole[]).map((r) => (
        <button
          key={r}
          type="button"
          onClick={() => setRole(r)}
          className="flex-1 rounded-lg py-2.5 text-sm font-medium transition-all duration-200"
          style={role === r
            ? { background: "var(--card)", color: "var(--foreground)", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid var(--border)" }
            : { color: "var(--muted)" }
          }
        >
          {r === "STUDENT" ? "👤 Student" : "🎓 Teacher"}
        </button>
      ))}
    </div>
  );
}