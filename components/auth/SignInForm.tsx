"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export function SignInForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setLoading(true);

    try {
      const { error } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (error) {
        alert(error.message);
        setLoading(false);
        return;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        alert("User not found");
        setLoading(false);
        return;
      }

      const {
        data: profile,
        error: profileError,
      } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (profileError) {
        alert(profileError.message);
        setLoading(false);
        return;
      }

      if (!profile) {
        alert(
          "Profile not found. Please create account again."
        );
        setLoading(false);
        return;
      }

      if (profile.role === "TEACHER") {
        router.push("/dashboard/teacher");
      } else {
        router.push("/dashboard/student");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="text-center">
        <h1 className="text-2xl font-semibold">
          Welcome Back
        </h1>

        <p className="text-sm text-zinc-500 mt-2">
          Login to your account
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4"
      >
        <div>
          <label>Email</label>

          <input
            type="email"
            required
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="w-full border rounded-md p-2"
          />
        </div>

        <div>
          <label>Password</label>

          <input
            type="password"
            required
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            className="w-full border rounded-md p-2"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white p-2 rounded-md"
        >
          {loading
            ? "Signing In..."
            : "Sign In"}
        </button>
      </form>

      <p className="text-center">
        Don't have an account?
        <Link
          href="/auth/sign_up"
          className="underline ml-2"
        >
          Sign Up
        </Link>
      </p>
    </div>
  );
}