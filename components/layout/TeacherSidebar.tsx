"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BookOpen, FileSpreadsheet, BarChart2, Settings, Plus } from "lucide-react";

interface MiniClass {
  id: string;
  class_name: string;
}

interface Props {
  classes: MiniClass[];
  onCreateClass: () => void;
  isCollapsed: boolean; // Recieves identical layout controller status sync flags
}

export default function TeacherSidebar({ classes, onCreateClass, isCollapsed }: Props) {
  const pathname = usePathname();

  const primaryNav = [
    { href: "/dashboard/teacher", icon: LayoutDashboard, label: "Overview Dashboard" },
    { href: "/dashboard/teacher/exams", icon: FileSpreadsheet, label: "Exam Templates" },
    { href: "/dashboard/teacher/analytics", icon: BarChart2, label: "Performance Reports" },
    { href: "/dashboard/teacher/settings", icon: Settings, label: "System Settings" },
  ];

  return (
    <aside 
      className={`h-full border-r border-border flex flex-col overflow-hidden bg-card/60 backdrop-blur-md transition-all duration-300 ease-in-out ${
        isCollapsed ? "w-0 md:w-16 border-r-0 md:border-r" : "w-64"
      }`}
    >
      {/* Create Classroom Action Trigger Header Container */}
      <div className="p-4 border-b border-border min-w-[240px] md:min-w-0">
        {isCollapsed ? (
          <button
            onClick={onCreateClass}
            title="Create Class"
            className="mx-auto flex items-center justify-center h-9 w-9 rounded-lg text-sm font-semibold transition-all bg-primary text-white hover:bg-blue-600 active:scale-95 shadow-sm"
          >
            <Plus size={16} />
          </button>
        ) : (
          <button
            onClick={onCreateClass}
            className="w-full flex items-center justify-center gap-2 h-11 rounded-xl text-sm font-semibold transition-all duration-200 bg-primary text-white hover:bg-blue-600 active:scale-[0.98] shadow-sm hover:shadow-primary/20"
          >
            <Plus size={16} />
            Create Class
          </button>
        )}
      </div>

      {/* Primary Route Blocks */}
      <nav className="p-3 flex flex-col gap-1">
        {primaryNav.map(({ href, icon: Icon, label }) => {
          const active = pathname === href;
          return (
            <Link 
              key={href} 
              href={href}
              title={isCollapsed ? label : undefined}
              className={`flex items-center rounded-xl text-sm font-medium transition-all ${
                isCollapsed ? "justify-center p-2.5 h-10 w-10 mx-auto" : "gap-3 px-3.5 py-2.5"
              } ${
                active 
                  ? "bg-primary/10 text-primary font-bold shadow-xs border-l-2 border-primary pl-2.5" 
                  : "text-muted hover:text-foreground hover:bg-secondary/60"
              }`}
            >
              <Icon size={18} className={active ? "text-primary" : "text-muted shrink-0"} />
              {!isCollapsed && <span className="truncate">{label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Dynamic Classrooms List Tracker */}
      <div className="flex-1 overflow-y-auto p-3 border-t border-border mt-2">
        {!isCollapsed && (
          <div className="flex items-center justify-between mb-3 px-3 min-w-[200px]">
            <p className="text-[11px] font-bold text-muted uppercase tracking-widest">Active Classrooms</p>
            <BookOpen size={12} className="text-muted/60" />
          </div>
        )}
        
        <div className="flex flex-col gap-1">
          {classes.map((cls) => {
            const active = pathname.includes(cls.id);
            return (
              <Link 
                key={cls.id} 
                href={`/dashboard/teacher/class/${cls.id}`}
                title={isCollapsed ? cls.class_name : undefined}
                className={`flex items-center transition-all ${
                  isCollapsed ? "justify-center p-2 h-9 w-9 mx-auto rounded-lg" : "gap-2.5 px-3 py-2 rounded-lg text-sm"
                } ${
                  active
                    ? "bg-secondary text-foreground font-semibold"
                    : "text-muted hover:text-foreground hover:bg-secondary/30"
                }`}
              >
                <div className="h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0" />
                {!isCollapsed && <span className="truncate">{cls.class_name}</span>}
              </Link>
            );
          })}

          {classes.length === 0 && !isCollapsed && (
            <p className="px-3 py-4 text-xs text-muted/70 italic text-center border border-dashed border-border/60 rounded-xl bg-secondary/20">
              No deployed tracks.
            </p>
          )}
        </div>
      </div>
    </aside>
  );
}