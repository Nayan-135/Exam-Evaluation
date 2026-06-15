"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BookOpen, FileText, TrendingUp, Settings, Plus } from "lucide-react";

interface MiniClass {
  id: string;
  class_name: string;
}

interface Props {
  classes: MiniClass[];
  onJoinClass?: () => void;
}

export default function StudentSidebar({ classes, onJoinClass }: Props) {
  const pathname = usePathname();

  const navItems = [
    { href: "/dashboard/student", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/dashboard/student/exams", icon: FileText, label: "My Exams" },
    { href: "/dashboard/student/results", icon: TrendingUp, label: "Results" },
    { href: "/dashboard/student/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <aside className="w-64 shrink-0 border-r border-border flex flex-col overflow-hidden bg-card/60 backdrop-blur-md">
      {/* Join button */}
      <div className="p-4 border-b border-border">
        <button
          onClick={onJoinClass}
          className="w-full flex items-center justify-center gap-2 h-11 rounded-xl text-sm font-semibold transition-all bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-white shadow-xs active:scale-[0.98]"
        >
          <Plus size={16} />
          Join Classroom
        </button>
      </div>

      {/* Primary Navigation */}
      <nav className="p-3 flex flex-col gap-1">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active
                  ? "bg-primary/10 text-primary font-bold border-l-2 border-primary pl-3"
                  : "text-muted hover:text-foreground hover:bg-secondary/60"
              }`}
            >
              <Icon size={18} className={active ? "text-primary" : "text-muted"} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Enrolled Classes Dynamic Content Index */}
      <div className="flex-1 overflow-y-auto p-3 border-t border-border mt-2">
        <div className="flex items-center justify-between mb-3 px-3">
          <p className="text-[11px] font-bold text-muted uppercase tracking-widest">Joined Classes</p>
          <BookOpen size={12} className="text-muted/60" />
        </div>
        <div className="flex flex-col gap-1">
          {classes?.map((cls) => {
            const active = pathname.includes(cls.id);
            return (
              <Link key={cls.id} href={`/dashboard/student/class/${cls.id}`}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${
                  active
                    ? "bg-secondary text-foreground font-semibold"
                    : "text-muted hover:text-foreground hover:bg-secondary/30"
                }`}
              >
                <div className="h-1.5 w-1.5 rounded-full bg-green-500 shrink-0" />
                <span className="truncate">{cls.class_name}</span>
              </Link>
            );
          })}
          {(!classes || classes.length === 0) && (
            <p className="px-3 py-4 text-xs text-muted/70 italic text-center border border-dashed border-border/60 rounded-xl bg-secondary/20">
              No classes yet. Join one!
            </p>
          )}
        </div>
      </div>
    </aside>
  );
}