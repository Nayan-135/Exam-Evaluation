"use client";

import Link from "next/link";

interface ClassCardProps {
  id: string;
  className: string;
  description?: string;
  joinCode?: string;
  role: "TEACHER" | "STUDENT";
}

export default function ClassCard({
  id,
  className,
  description,
  joinCode,
  role,
}: ClassCardProps) {
  return (
    <Link
      href={`/dashboard/${role.toLowerCase()}/class/${id}`}
      className="
        block
        bg-white
        dark:bg-zinc-900
        border
        rounded-xl
        p-5
        shadow-sm
        hover:shadow-lg
        transition-all
      "
    >
      <h3 className="text-xl font-semibold">
        {className}
      </h3>

      <p className="text-sm text-zinc-500 mt-2">
        {description}
      </p>

      {role === "TEACHER" && (
        <div className="mt-4">
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs">
            Join Code: {joinCode}
          </span>
        </div>
      )}
    </Link>
  );
}