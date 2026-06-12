"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

interface Props {
  studentId: string;
  onClose: () => void;
}

export default function JoinClassModal({
  studentId,
  onClose,
}: Props) {
  const [code, setCode] =
    useState("");

  const handleJoin = async () => {
    const { data: classroom } =
      await supabase
        .from("classes")
        .select("*")
        .eq("join_code", code)
        .single();

    if (!classroom) {
      alert("Invalid Code");
      return;
    }

    const { error } =
      await supabase
        .from("class_members")
        .insert({
          class_id: classroom.id,
          student_id: studentId,
        });

    if (error) {
      alert(error.message);
      return;
    }

    alert(
      "Successfully Joined Class"
    );

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
      <div className="bg-white rounded-xl p-6 w-[450px]">
        <h2 className="text-xl font-bold mb-4">
          Join Classroom
        </h2>

        <input
          placeholder="Enter Join Code"
          value={code}
          onChange={(e) =>
            setCode(
              e.target.value
            )
          }
          className="w-full border p-2 rounded mb-4"
        />

        <button
          onClick={handleJoin}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Join
        </button>
      </div>
    </div>
  );
}