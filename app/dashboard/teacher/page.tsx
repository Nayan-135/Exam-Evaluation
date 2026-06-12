"use client";

import { useState } from "react";

import DashboardHeader from "@/components/layout/DashboardHeader";
import TeacherSidebar from "@/components/layout/TeacherSidebar";

import CreateClassModal from "@/components/classroom/CreateClassModal";
import ClassCard from "@/components/classroom/ClassCard";

export default function TeacherPage() {
  const [showModal, setShowModal] =
    useState(false);

  // Temporary data
  const classes = [
    {
      id: "1",
      class_name: "AI Fundamentals",
      description:
        "Artificial Intelligence Basics",
      join_code: "AI123456",
    },
    {
      id: "2",
      class_name: "DBMS",
      description:
        "Database Management Systems",
      join_code: "DB987654",
    },
  ];

  return (
    <div className="h-screen flex flex-col">
      <DashboardHeader
        name="Neel Zade"
        role="Teacher"
      />

      <div className="flex flex-1 overflow-hidden">
        <TeacherSidebar
          classes={classes}
        />

        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {/* Stats */}

          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-5 shadow-sm">
              <h3 className="text-gray-500">
                Total Classes
              </h3>

              <p className="text-3xl font-bold mt-2">
                2
              </p>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm">
              <h3 className="text-gray-500">
                Students
              </h3>

              <p className="text-3xl font-bold mt-2">
                54
              </p>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm">
              <h3 className="text-gray-500">
                Exams
              </h3>

              <p className="text-3xl font-bold mt-2">
                8
              </p>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm">
              <h3 className="text-gray-500">
                Pending Reviews
              </h3>

              <p className="text-3xl font-bold mt-2">
                12
              </p>
            </div>
          </div>

          {/* Create Classroom */}

          <div className="mt-8 flex justify-between items-center">
            <h2 className="text-2xl font-bold">
              My Classrooms
            </h2>

            <button
              onClick={() =>
                setShowModal(true)
              }
              className="bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              + Create Classroom
            </button>
          </div>

          {/* Class Cards */}

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5 mt-6">
            {classes.map((cls) => (
              <ClassCard
                key={cls.id}
                id={cls.id}
                className={
                  cls.class_name
                }
                description={
                  cls.description
                }
                joinCode={
                  cls.join_code
                }
                role="TEACHER"
              />
            ))}
          </div>
        </main>
      </div>

      {showModal && (
        <CreateClassModal
          teacherId="teacher-id"
          onClose={() =>
            setShowModal(false)
          }
        />
      )}
    </div>
  );
}