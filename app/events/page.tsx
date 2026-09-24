import { supabase } from "@/lib/supabase";
import Link from "next/link";
import AdminEventActions from "@/components/AdminEventActions";

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const { data: events, error } = await supabase
    .from("events")
    .select("*")
    .order("date", { ascending: true });

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-16">
        <div className="mx-auto max-w-2xl rounded-2xl border border-red-100 bg-red-50 p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
            <svg
              className="h-6 w-6"
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
          </div>

          <h1 className="text-xl font-bold text-red-800">
            Unable to Load Events
          </h1>

          <p className="mt-2 text-sm text-red-600">
            {error.message}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-14 sm:py-16">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              Discover
            </p>

            <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl md:text-5xl">
              Find Your Next Event
            </h1>

            <p className="mt-4 text-lg leading-8 text-gray-600">
              Explore conferences, workshops, meetups, festivals, and
              other experiences happening around you.
            </p>
          </div>

          {/* Stats */}
          <div className="mt-10 flex flex-wrap gap-4">
            <div className="rounded-2xl border border-blue-100 bg-blue-50/80 px-6 py-5">
              <p className="text-3xl font-bold tracking-tight text-blue-700">
                {events.length}
              </p>

              <p className="mt-1 text-sm font-medium text-blue-600">
                Available Events
              </p>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-gray-50 px-6 py-5">
              <p className="text-3xl font-bold tracking-tight text-gray-900">
                {new Set(
                  events.map((event) => event.category)
                ).size}
              </p>

              <p className="mt-1 text-sm font-medium text-gray-500">
                Categories
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="mx-auto max-w-7xl px-6 py-12 sm:py-16">
        {events.length === 0 ? (
          <div className="rounded-2xl border border-gray-100 bg-white px-6 py-20 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-3xl">
              📅
            </div>

            <h2 className="mt-6 text-2xl font-bold text-gray-900">
              No events available
            </h2>

            <p className="mx-auto mt-3 max-w-sm text-gray-500">
              Check back later for upcoming events. New experiences
              are added regularly.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <article
                key={event.id}
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

                  {/* Category Badge */}
                  <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-blue-700 shadow-sm backdrop-blur-sm">
                    {event.category}
                  </span>
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col p-6">
                  <h2 className="line-clamp-2 text-xl font-bold tracking-tight text-gray-900">
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

                      <span className="line-clamp-1">
                        {event.location}
                      </span>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="mt-auto border-t border-gray-100 pt-5">
                    <div className="flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                          Organizer
                        </p>

                        <p className="mt-0.5 truncate text-sm font-semibold text-gray-900">
                          {event.organizer}
                        </p>
                      </div>

                      <Link
                        href={`/events/${event.id}`}
                        className="shrink-0 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition-all hover:bg-blue-700 hover:shadow-md"
                      >
                        View Details
                      </Link>
                    </div>

                    {/* Admin Actions */}
                    <AdminEventActions eventId={event.id} />
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

