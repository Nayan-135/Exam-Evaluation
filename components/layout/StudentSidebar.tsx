"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BookOpen, FileText, TrendingUp, Settings, Plus } from "lucide-react";

interface ClassItem {
  id: string;
  class_name: string;
}

interface Props {
  classes: ClassItem[];
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
    <aside className="w-64 shrink-0 border-r border-border flex flex-col overflow-hidden" style={{ background: "var(--sidebar)" }}>

      {/* Join button */}
      <div className="p-4 border-b border-border">
        <button
          onClick={onJoinClass}
          className="w-full flex items-center justify-center gap-2 h-10 rounded-lg text-sm font-semibold transition-colors border-2 border-primary text-primary hover:bg-primary hover:text-white"
        >
          <Plus size={16} />
          Join Classroom
        </button>
      </div>

      {/* Nav */}
      <nav className="p-3 flex flex-col gap-0.5">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
              style={active
                ? { background: "var(--accent, #dbeafe)", color: "var(--primary)" }
                : { color: "var(--muted)" }
              }>
              <Icon size={17} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Classes */}
      <div className="flex-1 overflow-y-auto p-3 border-t border-border">
        <div className="flex items-center justify-between mb-2 px-3">
          <p className="text-xs font-semibold text-muted uppercase tracking-wider">Joined Classes</p>
          <BookOpen size={13} className="text-muted" />
        </div>
        <div className="flex flex-col gap-0.5">
          {classes?.map((cls) => {
            const active = pathname.includes(cls.id);
            return (
              <Link key={cls.id} href={`/dashboard/student/class/${cls.id}`}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors"
                style={active
                  ? { background: "var(--secondary)", color: "var(--foreground)", fontWeight: 500 }
                  : { color: "var(--muted)" }
                }>
                <div className="h-2 w-2 rounded-full bg-green-500 shrink-0" />
                <span className="truncate">{cls.class_name}</span>
              </Link>
            );
          })}
          {(!classes || classes.length === 0) && (
            <p className="px-3 py-3 text-xs text-muted">No classes yet. Join one!</p>
          )}
        </div>
      </div>
    </aside>
  );
}