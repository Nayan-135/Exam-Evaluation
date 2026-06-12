"use client";

import Link from "next/link";

export default function StudentSidebar({
  classes,
}: any) {
  return (
    <aside className="w-72 border-r bg-white dark:bg-zinc-950 p-4">
      <button
        className="
          w-full
          bg-green-600
          text-white
          py-3
          rounded-lg
          font-medium
        "
      >
        + Join Classroom
      </button>

      <h3 className="mt-8 mb-3 font-semibold">
        Joined Classes
      </h3>

      <div className="space-y-2">
        {classes?.map((cls: any) => (
          <Link
            key={cls.id}
            href={`/dashboard/student/class/${cls.id}`}
            className="
              block
              rounded-lg
              p-3
              hover:bg-zinc-100
              dark:hover:bg-zinc-800
            "
          >
            {cls.class_name}
          </Link>
        ))}
      </div>
    </aside>
  );
}