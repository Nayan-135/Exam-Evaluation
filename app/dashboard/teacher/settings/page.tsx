"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Settings, Shield, User, Save } from "lucide-react";

export default function SystemSettingsPage() {
  const [profile, setProfile] = useState({ first_name: "", last_name: "", email: "" });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    async function loadCurrentProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from("users").select("first_name, last_name, email").eq("id", user.id).single();
      if (data) setProfile(data);
    }
    loadCurrentProfile();
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg("");
    
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { error } = await supabase.from("users").update({
        first_name: profile.first_name,
        last_name: profile.last_name,
        updated_at: new Date().toISOString()
      }).eq("id", user.id);

      setMsg(error ? "Profile modification error." : "System configuration successfully synchronized.");
    }
    setSaving(false);
  };

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">System Settings</h1>
        <p className="text-sm text-muted mt-1">Manage infrastructure profiles, identity details, and structural security constraints.</p>
      </div>

      {msg && (
        <div className={`p-3 text-xs font-semibold rounded-lg border ${
          msg.includes("error") ? "bg-red-500/10 text-red-500 border-red-500/20" : "bg-green-500/10 text-green-600 border-green-500/20"
        }`}>{msg}</div>
      )}

      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-2xs">
        <div className="p-4 border-b border-border bg-secondary/30 flex items-center gap-2 font-bold text-sm text-foreground">
          <User size={16} className="text-primary"/> Personal Instructor Profile
        </div>
        
        <form onSubmit={handleUpdate} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-muted uppercase">First Name</label>
              <input type="text" value={profile.first_name} onChange={(e) => setProfile({...profile, first_name: e.target.value})} className="p-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:border-primary transition-all" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-muted uppercase">Last Name</label>
              <input type="text" value={profile.last_name} onChange={(e) => setProfile({...profile, last_name: e.target.value})} className="p-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:border-primary transition-all" />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-muted uppercase">Registered Institutional Email</label>
            <input type="email" disabled value={profile.email} className="p-2.5 rounded-xl border border-border bg-secondary/50 text-sm text-muted cursor-not-allowed font-medium" />
            <p className="text-[11px] text-muted">Email modification routes are managed by enterprise workspace administrators.</p>
          </div>

          <div className="pt-4 border-t border-border flex justify-end">
            <button type="submit" disabled={saving} className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl hover:bg-blue-600 transition-all shadow-xs disabled:opacity-50">
              <Save size={14}/> {saving ? "Saving Changes..." : "Save Configuration"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}