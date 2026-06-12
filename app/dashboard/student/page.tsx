"use client";

import { useState } from "react";

import DashboardHeader from "@/components/layout/DashboardHeader";
import StudentSidebar from "@/components/layout/StudentSidebar";

import JoinClassModal from "@/components/classroom/JoinClassModal";
import ClassCard from "@/components/classroom/ClassCard";

export default function StudentPage() {
  const [showModal, setShowModal] =
    useState(false);

  const classes = [
    {
      id: "1",
      class_name: "AI Fundamentals",
      description:
        "Artificial Intelligence Basics",
    },
    {
      id: "2",
      class_name: "DBMS",
      description:
        "Database Management Systems",
    },
  ];

  return (
    <div className="h-screen flex flex-col">
      <DashboardHeader
        name="Nayan Ghate"
        role="Student"
      />

      <div className="flex flex-1 overflow-hidden">
        <StudentSidebar
          classes={classes}
        />

        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {/* Stats */}

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-xl shadow-sm">
              <h3 className="text-gray-500">
                Joined Classes
              </h3>

              <p className="text-3xl font-bold mt-2">
                2
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl shadow-sm">
              <h3 className="text-gray-500">
                Upcoming Exams
              </h3>

              <p className="text-3xl font-bold mt-2">
                3
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl shadow-sm">
              <h3 className="text-gray-500">
                Pending Assignments
              </h3>

              <p className="text-3xl font-bold mt-2">
                5
              </p>
            </div>
          </div>

          {/* Join Classroom */}

          <div className="mt-8 flex justify-between items-center">
            <h2 className="text-2xl font-bold">
              My Classes
            </h2>

            <button
              onClick={() =>
                setShowModal(true)
              }
              className="bg-green-600 text-white px-4 py-2 rounded-lg"
            >
              + Join Classroom
            </button>
          </div>

          {/* Classes */}

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
                role="STUDENT"
              />
            ))}
          </div>

          {/* Upcoming Exams */}

          <div className="mt-10 bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-4">
              Upcoming Exams
            </h2>

            <div className="space-y-3">
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold">
                  DBMS Mid Term
                </h3>

                <p className="text-sm text-gray-500">
                  Deadline: 25 June 2026
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-semibold">
                  AI Assignment 1
                </h3>

                <p className="text-sm text-gray-500">
                  Deadline: 28 June 2026
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>

      {showModal && (
        <JoinClassModal
          studentId="student-id"
          onClose={() =>
            setShowModal(false)
          }
        />
      )}
    </div>
  );
}