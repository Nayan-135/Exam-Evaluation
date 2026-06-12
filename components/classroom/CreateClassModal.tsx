"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { generateJoinCode } from "@/lib/generateJoinCode";

interface Props {
  teacherId: string;
  onClose: () => void;
}

export default function CreateClassModal({
  teacherId,
  onClose,
}: Props) {
  const [className, setClassName] =
    useState("");

  const [description, setDescription] =
    useState("");

  const handleCreate = async () => {
    const joinCode =
      generateJoinCode();

    const { error } =
      await supabase
        .from("classes")
        .insert({
          class_name: className,
          description: description,
          join_code: joinCode,
          teacher_id: teacherId,
        });

    if (error) {
      alert(error.message);
      return;
    }

    alert(
      `Class Created\nJoin Code: ${joinCode}`
    );

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
      <div className="bg-white rounded-xl p-6 w-[500px]">
        <h2 className="text-xl font-bold mb-4">
          Create Classroom
        </h2>

        <input
          placeholder="Class Name"
          value={className}
          onChange={(e) =>
            setClassName(
              e.target.value
            )
          }
          className="w-full border p-2 rounded mb-3"
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) =>
            setDescription(
              e.target.value
            )
          }
          className="w-full border p-2 rounded mb-4"
        />

        <div className="flex gap-2">
          <button
            onClick={handleCreate}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Create
          </button>

          <button
            onClick={onClose}
            className="border px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}