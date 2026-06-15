"use client";
import Link from "next/link";
import { ClassItem } from "@/types";
import { Users, FileText, ArrowRight } from "lucide-react";

interface ClassCardProps {
  item: ClassItem;
  role: "TEACHER" | "STUDENT";
}

export function ClassCard({ item, role }: ClassCardProps) {
  const href = `/dashboard/${role.toLowerCase()}/class/${item.id}`;

  return (
    <Link href={href} className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg dark:hover:shadow-primary/5">
      {/* Decorative top illumination track */}
      <div className="absolute top-0 left-0 h-[3px] w-0 bg-primary transition-all duration-300 group-hover:w-full" />
      
      <div>
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-lg font-bold text-foreground tracking-tight group-hover:text-primary transition-colors line-clamp-1">
            {item.class_name}
          </h3>
          <span className="inline-flex items-center rounded-lg bg-secondary px-2.5 py-1 text-xs font-semibold text-secondary-foreground font-mono uppercase tracking-wider">
            {item.join_code}
          </span>
        </div>
        
        <p className="mt-2.5 text-sm text-muted line-clamp-2 min-h-[40px] leading-relaxed">
          {item.description || "No description provided for this classroom network node."}
        </p>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-border/50 pt-4 text-xs text-muted">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 font-medium">
            <Users size={14} className="text-muted/70" />
            <span>{item.member_count ?? 0} Students</span>
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <FileText size={14} className="text-muted/70" />
            <span>{item.exam_count ?? 0} Exams</span>
          </span>
        </div>
        
        <span className="text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 flex items-center gap-1 font-semibold">
          Enter <ArrowRight size={14} />
        </span>
      </div>
    </Link>
  );
}