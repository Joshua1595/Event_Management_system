"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

interface RegisterButtonProps {
  eventId: number;
}

export default function RegisterButton({ eventId }: RegisterButtonProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleRegister() {
    setLoading(true);
    setMessage("");
    setSuccess(false);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setMessage("Please login before registering for an event.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("registrations").insert({
      user_id: user.id,
      event_id: eventId,
    });

    if (error) {
      if (error.code === "23505") {
        setMessage("You are already registered for this event.");
      } else {
        setMessage(error.message);
      }

      setLoading(false);
      return;
    }

    setSuccess(true);
    setMessage("You have successfully registered for this event.");
    setLoading(false);
  }

  return (
    <div>
      <button
        onClick={handleRegister}
        disabled={loading || success}
        className={`relative flex w-full items-center justify-center rounded-xl px-6 py-3.5 text-base font-semibold shadow-lg transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-70 ${
          success
            ? "bg-green-600 text-white shadow-green-600/25 hover:bg-green-600"
            : "bg-blue-600 text-white shadow-blue-600/25 hover:bg-blue-700 hover:shadow-xl hover:-translate-y-0.5 focus-visible:outline-blue-600"
        }`}
      >
        {loading ? (
          <>
            <svg
              className="mr-2 h-5 w-5 animate-spin text-white"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Registering...
          </>
        ) : success ? (
          <>
            <svg
              className="mr-2 h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
            Registered
          </>
        ) : (
          "Register for Event"
        )}
      </button>

      {message && (
        <div
          className={`mt-4 flex items-start gap-3 rounded-xl border px-4 py-3.5 text-sm ${
            success
              ? "border-green-100 bg-green-50 text-green-700"
              : "border-red-100 bg-red-50 text-red-700"
          }`}
        >
          {success ? (
            <svg
              className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ) : (
            <svg
              className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          )}
          <span>{message}</span>
        </div>
      )}
    </div>
  );
}