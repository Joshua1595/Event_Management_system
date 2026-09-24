import { supabase } from "@/lib/supabase";
import Link from "next/link";
import RegisterButton from "@/components/RegisterButton";

export default async function EventDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: event, error } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !event) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
        <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-10 text-center shadow-xl shadow-gray-200/50">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-2xl text-red-500">
            !
          </div>

          <h1 className="mt-6 text-2xl font-bold tracking-tight text-gray-900">
            Event Not Found
          </h1>

          <p className="mt-3 text-sm leading-6 text-gray-500">
            The event you are looking for does not exist or may have been
            removed.
          </p>

          <Link
            href="/events"
            className="mt-8 inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition-all hover:bg-blue-700 hover:shadow-xl"
          >
            Back to Events
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="mx-auto max-w-6xl px-6 py-10 sm:py-12">
        {/* Back Link */}
        <Link
          href="/events"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-blue-600"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Events
        </Link>

        {/* Event Card */}
        <div className="mt-6 overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
          {/* Hero Image */}
          <div className="relative h-64 overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 sm:h-72 md:h-80">
            {event.image_url ? (
              <img
                src={event.image_url}
                alt={event.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <span className="text-8xl opacity-80">📅</span>
              </div>
            )}

            {/* Category Badge */}
            <div className="absolute left-5 top-5 sm:left-6 sm:top-6">
              <span className="rounded-full bg-white/95 px-4 py-1.5 text-sm font-semibold text-blue-700 shadow-sm backdrop-blur-sm">
                {event.category}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 sm:p-8 md:p-10">
            {/* Title + Description */}
            <div className="max-w-3xl">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl md:text-5xl">
                {event.title}
              </h1>

              <p className="mt-5 text-base leading-8 text-gray-600 sm:text-lg">
                {event.description}
              </p>
            </div>

            {/* Event Information */}
            <div className="mt-10">
              <h2 className="text-lg font-bold tracking-tight text-gray-900">
                Event Information
              </h2>

              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  { label: "Date", value: event.date, icon: "📅" },
                  { label: "Time", value: event.time, icon: "🕐" },
                  { label: "Location", value: event.location, icon: "📍" },
                  { label: "Organizer", value: event.organizer, icon: "👤" },
                  { label: "Available Seats", value: event.seats, icon: "🎟️" },
                  { label: "Category", value: event.category, icon: "🏷️" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-gray-100 bg-gray-50/80 p-5 transition-colors hover:border-blue-100 hover:bg-blue-50/30"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-base shadow-sm">
                        {item.icon}
                      </span>
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                          {item.label}
                        </p>
                        <p className="mt-0.5 font-semibold text-gray-900">
                          {item.value}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Registration */}
            <div className="mt-10 border-t border-gray-100 pt-8">
              <div className="mb-6">
                <h2 className="text-lg font-bold tracking-tight text-gray-900">
                  Interested in this event?
                </h2>
                <p className="mt-1.5 text-sm text-gray-500">
                  Register now to reserve your place.
                </p>
              </div>

              <RegisterButton eventId={event.id} />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}