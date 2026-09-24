"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import ProtectedRoute from "@/components/ProtectedRoute";

interface Event {
  id: number;
  title: string;
  description: string;
  category: string;
  date: string;
  time: string;
  location: string;
  organizer: string;
  seats: number;
  image_url?: string | null;
}

interface Registration {
  id: number;
  created_at: string;
  event: Event | null;
}

export default function RegistrationsPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadRegistrations() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("registrations")
        .select(`
          id,
          created_at,
          event:events (
            id,
            title,
            description,
            category,
            date,
            time,
            location,
            organizer,
            seats,
            image_url
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Registration error:", error);
        setError(error.message);
        setLoading(false);
        return;
      }

      setRegistrations(data as unknown as Registration[]);
      setLoading(false);
    }

    loadRegistrations();
  }, []);

  async function handleCancel(registrationId: number) {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this registration?"
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("registrations")
      .delete()
      .eq("id", registrationId);

    if (error) {
      setError(error.message);
      return;
    }

    setRegistrations((current) =>
      current.filter((registration) => registration.id !== registrationId)
    );
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <main className="min-h-screen bg-gray-50">
          <section className="mx-auto max-w-7xl px-6 py-16">
            <div className="flex min-h-[420px] items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
                <p className="text-sm font-medium text-gray-500">
                  Loading your registrations...
                </p>
              </div>
            </div>
          </section>
        </main>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-gray-50">
        {/* Header */}
        <section className="border-b border-gray-100 bg-white">
          <div className="mx-auto max-w-7xl px-6 py-14 sm:py-16">
            <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
              <div className="max-w-2xl">
                <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                  Your Events
                </p>
                <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl md:text-5xl">
                  My Registrations
                </h1>
                <p className="mt-4 text-lg leading-8 text-gray-600">
                  Keep track of the events you have registered for and manage
                  your reservations.
                </p>
              </div>

              <Link
                href="/events"
                className="inline-flex shrink-0 items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition-all hover:bg-blue-700 hover:shadow-xl"
              >
                Browse Events
              </Link>
            </div>

            {/* Count */}
            <div className="mt-10 inline-flex items-center gap-4 rounded-2xl border border-blue-100 bg-blue-50/80 px-6 py-5">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-xl shadow-sm">
                🎟️
              </span>
              <div>
                <p className="text-2xl font-bold tracking-tight text-blue-700">
                  {registrations.length}
                </p>
                <p className="text-sm font-medium text-blue-600">
                  {registrations.length === 1
                    ? "Registered Event"
                    : "Registered Events"}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-12 sm:py-16">
          {/* Error */}
          {error && (
            <div className="mb-8 flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm text-red-700">
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
              <div>
                <p className="font-medium">Something went wrong</p>
                <p className="mt-0.5 text-red-600">{error}</p>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!error && registrations.length === 0 && (
            <div className="rounded-2xl border border-gray-100 bg-white px-6 py-20 text-center shadow-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-3xl">
                🎟️
              </div>
              <h2 className="mt-6 text-2xl font-bold text-gray-900">
                No registrations yet
              </h2>
              <p className="mx-auto mt-3 max-w-md text-gray-500">
                You haven&apos;t registered for any events yet. Explore available
                events and find something interesting.
              </p>
              <Link
                href="/events"
                className="mt-8 inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition-all hover:bg-blue-700"
              >
                Explore Events
              </Link>
            </div>
          )}

          {/* Registration Cards */}
          {registrations.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {registrations.map((registration) => {
                if (!registration.event) {
                  return (
                    <div
                      key={registration.id}
                      className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
                    >
                      <div className="flex h-44 items-center justify-center bg-gray-50">
                        <span className="text-6xl opacity-60">📅</span>
                      </div>
                      <div className="p-6">
                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-500">
                          Unavailable
                        </span>
                        <h2 className="mt-4 text-xl font-bold text-gray-900">
                          Event No Longer Available
                        </h2>
                        <p className="mt-3 text-sm leading-6 text-gray-500">
                          This event is no longer available, but your
                          registration record still exists.
                        </p>
                        <button
                          onClick={() => handleCancel(registration.id)}
                          className="mt-6 w-full rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600"
                        >
                          Remove Registration
                        </button>
                      </div>
                    </div>
                  );
                }

                const event = registration.event;

                return (
                  <article
                    key={registration.id}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-blue-100 hover:shadow-lg"
                  >
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50">
                      {event.image_url ? (
                        <img
                          src={event.image_url}
                          alt={event.title}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <span className="text-6xl opacity-80 transition duration-300 group-hover:scale-110">
                            📅
                          </span>
                        </div>
                      )}

                      <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-blue-700 shadow-sm backdrop-blur-sm">
                        {event.category}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex flex-1 flex-col p-6">
                      <h2 className="text-xl font-bold tracking-tight text-gray-900 line-clamp-2">
                        {event.title}
                      </h2>

                      <p className="mt-3 line-clamp-2 text-sm leading-6 text-gray-500">
                        {event.description}
                      </p>

                      {/* Meta */}
                      <div className="mt-5 space-y-2.5 text-sm text-gray-600">
                        <div className="flex items-center gap-2.5">
                          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-50 text-sm">
                            📅
                          </span>
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-50 text-sm">
                            🕐
                          </span>
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-50 text-sm">
                            📍
                          </span>
                          <span className="line-clamp-1">{event.location}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="mt-auto border-t border-gray-100 pt-5">
                        <div className="flex gap-3">
                          <Link
                            href={`/events/${event.id}`}
                            className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-center text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                          >
                            View Event
                          </Link>
                          <button
                            onClick={() => handleCancel(registration.id)}
                            className="flex-1 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </ProtectedRoute>
  );
}