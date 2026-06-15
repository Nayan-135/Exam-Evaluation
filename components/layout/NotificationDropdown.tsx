"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { X, Bell, Check } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  onClose: () => void;
}

export default function NotificationDropdown({ onClose }: Props) {
  const [notifications, setNotifications] = useState<any[]>([]);
  const router = useRouter();

  const loadNotifications = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10);

    if (data) setNotifications(data);
  };

  const handleNotificationClick = async (n: any) => {
    // 1. Mark as read in background database schema rows
    if (!n.is_read) {
      await supabase.from("notifications").update({ is_read: true }).eq("id", n.id);
    }
    
    // 2. Clear UI modal layer context panels
    onClose();
    
    // 3. Evaluate deep linking parameters to route cleanly if preset
    if (n.link_to) {
      router.push(n.link_to);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute right-0 top-11 z-50 w-80 bg-card border border-border rounded-2xl shadow-xl animate-slide-down overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-border bg-secondary/20">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Bell size={16} className="text-primary" /> Notifications
          </h3>
          <button onClick={onClose} className="text-muted hover:text-foreground transition-colors">
            <X size={15} />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto divide-y divide-border/60">
          {notifications.length === 0 ? (
            <div className="px-4 py-10 text-center text-xs text-muted/70">
              No notices broadcasted yet.
            </div>
          ) : (
            notifications.map((n) => (
              <div 
                key={n.id} 
                onClick={() => handleNotificationClick(n)}
                className={`px-4 py-3.5 transition-colors cursor-pointer flex justify-between items-start gap-2 select-none text-left ${
                  n.is_read ? "opacity-60 bg-transparent hover:bg-secondary/20" : "bg-primary/5 hover:bg-primary/10"
                }`}
              >
                <div className="flex gap-2.5 items-start">
                  <div className={`h-2 w-2 rounded-full mt-1.5 shrink-0 ${n.is_read ? "bg-muted" : "bg-primary"}`} />
                  <div>
                    <p className="text-xs font-bold text-foreground">{n.title}</p>
                    <p className="text-[11px] text-muted mt-0.5 leading-relaxed">{n.message}</p>
                  </div>
                </div>
                {!n.is_read && <Check size={12} className="text-primary shrink-0 mt-1" />}
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}