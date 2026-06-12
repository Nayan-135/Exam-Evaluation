"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { RoleSelector } from "./RoleSelector";
import { UserRole } from "@/types";
import { supabase } from "@/lib/supabase";

export function SignUpForm() {
  const router = useRouter();

  const [role, setRole] =
    useState<UserRole>("STUDENT");

  const [loading, setLoading] =
    useState(false);

  const [formData, setFormData] =
    useState({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      orgCode: "",
    });

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setLoading(true);

    try {
      if (
        role === "TEACHER" &&
        formData.orgCode !== "niggawhat"
      ) {
        alert("Invalid Teacher Code");
        setLoading(false);
        return;
      }

      const {
        data,
        error,
      } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        alert(error.message);
        setLoading(false);
        return;
      }

      const userId = data.user?.id;

      if (!userId) {
        alert("User creation failed");
        setLoading(false);
        return;
      }

      const { error: insertError } =
        await supabase
          .from("users")
          .insert({
            id: userId,
            first_name:
              formData.firstName,
            last_name:
              formData.lastName,
            email: formData.email,
            role,
          });

      if (insertError) {
        console.error(insertError);
        alert(insertError.message);
        setLoading(false);
        return;
      }

      alert("Account Created");

      if (role === "TEACHER") {
        router.push(
          "/dashboard/teacher"
        );
      } else {
        router.push(
          "/dashboard/student"
        );
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="flex w-full flex-col gap-6">
      <h1 className="text-2xl font-semibold text-center">
        Create Account
      </h1>

      <RoleSelector
        role={role}
        setRole={setRole}
      />

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4"
      >
        <input
          placeholder="First Name"
          required
          onChange={(e) =>
            setFormData({
              ...formData,
              firstName:
                e.target.value,
            })
          }
          className="border p-2 rounded"
        />

        <input
          placeholder="Last Name"
          required
          onChange={(e) =>
            setFormData({
              ...formData,
              lastName:
                e.target.value,
            })
          }
          className="border p-2 rounded"
        />

        <input
          type="email"
          placeholder="Email"
          required
          onChange={(e) =>
            setFormData({
              ...formData,
              email:
                e.target.value,
            })
          }
          className="border p-2 rounded"
        />

        <input
          type="password"
          placeholder="Password"
          required
          onChange={(e) =>
            setFormData({
              ...formData,
              password:
                e.target.value,
            })
          }
          className="border p-2 rounded"
        />

        {role === "TEACHER" && (
          <input
            placeholder="Teacher Code"
            required
            onChange={(e) =>
              setFormData({
                ...formData,
                orgCode:
                  e.target.value,
              })
            }
            className="border p-2 rounded"
          />
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white p-2 rounded"
        >
          {loading
            ? "Creating..."
            : "Sign Up"}
        </button>
      </form>

      <p className="text-center">
        Already have an account?
        <Link
          href="/auth/sign_in"
          className="underline ml-2"
        >
          Sign In
        </Link>
      </p>
    </div>
  );
}