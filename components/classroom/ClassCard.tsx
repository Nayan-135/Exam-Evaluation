"use client";
import Link from "next/link";
import { ClassItem } from "@/types";

interface ClassCardProps {
  item: ClassItem;
  role: "TEACHER" | "STUDENT";
}

export function ClassCard({ item, role }: ClassCardProps) {
  const href = `/dashboard/${role.toLowerCase()}/class/${item.id}`;

  return (
    <Link href={href} className="group relative block rounded-2xl border border-border bg-card p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-md">
      <div className="absolute top-0 left-0 h-1.5 w-0 bg-primary transition-all duration-300 group-hover:w-full rounded-t-2xl" />
      
      <div className="flex flex-col h-full justify-between">
        <div>
          <div className="flex items-start justify-between gap-4">
            <h3 className="font-bold text-lg text-foreground tracking-tight group-hover:text-primary transition-colors line-clamp-1">
              {item.name}
            </h3>
            <span className="inline-flex items-center rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground font-mono">
              {item.join_code}
            </span>
          </div>
          
          <p className="mt-2 text-sm text-muted line-clamp-2 min-h-[40px]">
            {item.description || "No description provided for this classroom."}
          </p>
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-4 text-xs text-muted">
          {role === "TEACHER" ? (
            <>
              <span className="flex items-center gap-1">👥 <b>{item._count?.class_members || 0}</b> Students</span>
              <span className="flex items-center gap-1">📝 <b>{item._count?.exams || 0}</b> Exams</span>
            </>
          ) : (
            <span className="flex items-center gap-1">👨‍🏫 Instructor: {item.teacher_name || "Assigned Teacher"}</span>
          )}
        </div>
      </div>
    </Link>
  );
}