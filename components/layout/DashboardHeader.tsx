"use client";

import {
  Bell,
  LogOut,
} from "lucide-react";

interface Props {
  name: string;
  role: string;
}

export default function DashboardHeader({
  name,
  role,
}: Props) {
  return (
    <header
      className="
      h-16
      border-b
      bg-white
      dark:bg-zinc-950
      flex
      items-center
      justify-between
      px-6
    "
    >
      <div className="flex items-center gap-3">
        <div
          className="
          w-10
          h-10
          rounded-lg
          bg-blue-600
          text-white
          flex
          items-center
          justify-center
          font-bold
        "
        >
          AI
        </div>

        <h1 className="font-bold text-xl">
          AI LMS
        </h1>
      </div>

      <div className="flex items-center gap-6">
        <button>
          <Bell size={20} />
        </button>

        <div>
          <p className="font-medium">
            {name}
          </p>

          <p className="text-xs text-zinc-500">
            {role}
          </p>
        </div>

        <button>
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
}