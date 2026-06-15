"use client";
import { X } from "lucide-react";

interface Notification {
  id: string;
  title: string;
  message: string;
}

interface Props {
  notifications: Notification[];
  onClose: () => void;
}

export default function NotificationDropdown({ notifications, onClose }: Props) {
  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40" onClick={onClose} />

      {/* Dropdown */}
      <div className="absolute right-0 top-11 z-50 w-80 bg-card border border-border rounded-xl shadow-xl animate-slide-down overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground">Notifications</h3>
          <button onClick={onClose} className="text-muted hover:text-foreground transition-colors">
            <X size={15} />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto divide-y divide-border">
          {notifications.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-muted">
              <p className="text-2xl mb-2">🔔</p>
              No notifications yet
            </div>
          ) : (
            notifications.map((n) => (
              <div key={n.id} className="px-4 py-3.5 hover:bg-secondary transition-colors cursor-pointer">
                <div className="flex gap-3 items-start">
                  <div className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{n.title}</p>
                    <p className="text-xs text-muted mt-0.5 leading-relaxed">{n.message}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}