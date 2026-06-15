"use client";
import { useState } from "react";
import { Bell, LogOut, ChevronDown } from "lucide-react";
import NotificationDropdown from "./NotificationDropdown";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

interface Props {
  name: string;
  role: string;
}

export default function DashboardHeader({ name, role }: Props) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);

    try {
      // 1. Explicitly invoke global sign-out to revoke tokens on Supabase auth nodes
      const { error } = await supabase.auth.signOut({ scope: "global" });
      if (error) {
        console.error("Supabase session revocation error:", error.message);
      }

      // 2. Clear local storage explicitly to remove cached auth tokens
      if (typeof window !== "undefined") {
        window.localStorage.removeItem("supabase.auth.token");
        window.localStorage.clear();
      }

      // 3. Clear Next.js server component router caches 
      router.refresh();

      // 4. Force a clean client redirect directly to the login panel
      router.push("/auth/sign_in");
    } catch (err) {
      console.error("An unexpected error occurred during session destruction:", err);
      // Fallback hard refresh to home page if client router encounters blocking conditions
      if (typeof window !== "undefined") {
        window.location.href = "/auth/sign_in";
      }
    } finally {
      setIsLoggingOut(false);
    }
  };

  const initials = name
    ? name
        .split(" ")
        .filter(Boolean)
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <header className="h-16 shrink-0 border-b border-border bg-card flex items-center justify-between px-6 z-40">
      {/* Logo */}
      <div className="flex items-center gap-2.5">
        <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 13L8 3L13 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M5 9.5H11" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
        <span className="font-bold text-lg tracking-tight text-foreground">AI-LMS</span>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative h-9 w-9 rounded-lg flex items-center justify-center text-muted hover:text-foreground hover:bg-secondary transition-colors"
            disabled={isLoggingOut}
          >
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary"></span>
          </button>
          {showNotifications && (
            <NotificationDropdown
              notifications={[
                { id: "1", title: "New Exam Published", message: "DBMS Mid Term is now available." },
                { id: "2", title: "Result Released", message: "AI Assignment 1 marks are out." },
              ]}
              onClose={() => setShowNotifications(false)}
            />
          )}
        </div>

        {/* Divider */}
        <div className="h-6 w-px bg-border mx-1" />

        {/* User info */}
        <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-secondary transition-colors cursor-pointer">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold shrink-0">
            {initials}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-sm font-semibold text-foreground leading-tight">{name}</p>
            <p className="text-xs text-muted leading-tight capitalize">{role.toLowerCase()}</p>
          </div>
          <ChevronDown size={14} className="text-muted hidden sm:block" />
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className={`h-9 w-9 rounded-lg flex items-center justify-center transition-colors ${
            isLoggingOut 
              ? "text-muted/40 cursor-not-allowed bg-secondary" 
              : "text-muted hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
          }`}
          title={isLoggingOut ? "Ending session..." : "Sign out"}
        >
          {isLoggingOut ? (
            <svg className="h-4 w-4 animate-spin text-red-500" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
          ) : (
            <LogOut size={17} />
          )}
        </button>
      </div>
    </header>
  );
}