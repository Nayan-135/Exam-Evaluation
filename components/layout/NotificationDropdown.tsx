"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { X, Bell, Check } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  initialNotifications: any[];
  onMutate: () => Promise<void>;
  onClose: () => void;
}

export default function NotificationDropdown({ initialNotifications, onMutate, onClose }: Props) {
  const [list, setList] = useState<any[]>(initialNotifications);
  const router = useRouter();

  // Keep state matching the parent header pipeline if changes take place
  useEffect(() => {
    setList(initialNotifications);
  }, [initialNotifications]);

  const handleNotificationClick = async (n: any) => {
    // 1. Optimistically update local component track state for seamless UI transition
    setList(prev => prev.map(item => item.id === n.id ? { ...item, is_read: true } : item));

    // 2. Clear background database rows synchronously
    if (!n.is_read) {
      await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", n.id);
      
      // Update header totals so indicator dot turns off
      await onMutate();
    }
    
    // 3. Clear open window overlay
    onClose();
    
    // Condition 2 Met: Deep linking execution framework runs on user interaction 
    if (n.link_to) {
      router.push(n.link_to);
    }
  };

  return (
    <>
      {/* Click outside to close backdrop panel overlay */}
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
          {list.length === 0 ? (
            <div className="px-4 py-10 text-center text-xs text-muted/70">
              No notices broadcasted yet.
            </div>
          ) : (
            list.map((n) => (
              <div 
                key={n.id} 
                onClick={() => handleNotificationClick(n)}
                className={`px-4 py-3.5 transition-colors cursor-pointer flex justify-between items-start gap-2 select-none text-left ${
                  n.is_read 
                    ? "opacity-60 bg-transparent hover:bg-secondary/20" 
                    : "bg-primary/5 hover:bg-primary/10"
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