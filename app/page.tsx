import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800">
        {/* Subtle decorative elements */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent" />
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-indigo-400/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-28 text-center sm:py-32 lg:py-40">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            Discover Amazing
            <span className="block mt-2 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              Events
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-blue-100 sm:text-xl">
            Find events, connect with people, and register for experiences
            that interest you — all in one place.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/events"
              className="inline-flex items-center justify-center rounded-xl bg-white px-8 py-3.5 text-base font-semibold text-blue-700 shadow-lg shadow-blue-900/20 transition-all hover:bg-blue-50 hover:shadow-xl hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Explore Events
            </Link>

            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-xl border-2 border-white/80 bg-transparent px-8 py-3.5 text-base font-semibold text-white transition-all hover:bg-white/10 hover:border-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-6 py-24 sm:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything You Need
          </h2>
          <p className="mt-4 text-lg leading-8 text-gray-600">
            Evently makes discovering and managing events simple and enjoyable.
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* Feature 1 */}
          <div className="group relative rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-all hover:border-blue-100 hover:shadow-md hover:-translate-y-1">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-3xl transition-colors group-hover:bg-blue-100">
              🔎
            </div>
            <h3 className="mt-6 text-xl font-semibold text-gray-900">
              Discover Events
            </h3>
            <p className="mt-3 text-base leading-7 text-gray-600">
              Browse available events and find something that matches
              your interests with powerful filters and recommendations.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="group relative rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-all hover:border-blue-100 hover:shadow-md hover:-translate-y-1">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-3xl transition-colors group-hover:bg-blue-100">
              🎟️
            </div>
            <h3 className="mt-6 text-xl font-semibold text-gray-900">
              Register Easily
            </h3>
            <p className="mt-3 text-base leading-7 text-gray-600">
              Register for events with your Evently account and keep
              track of all your registrations in one dashboard.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="group relative rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-all hover:border-blue-100 hover:shadow-md hover:-translate-y-1 sm:col-span-2 lg:col-span-1">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-3xl transition-colors group-hover:bg-blue-100">
              📅
            </div>
            <h3 className="mt-6 text-xl font-semibold text-gray-900">
              Manage Events
            </h3>
            <p className="mt-3 text-base leading-7 text-gray-600">
              Create and manage your own events from one simple,
              intuitive platform designed for organizers.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="relative overflow-hidden bg-gray-50">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-50/60 via-transparent to-transparent" />
        
        <div className="relative mx-auto max-w-4xl px-6 py-24 text-center sm:py-28">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Ready to discover your next event?
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-gray-600">
            Join thousands of people already exploring events on Evently.
            Your next experience is just a click away.
          </p>

          <div className="mt-10">
            <Link
              href="/events"
              className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-blue-600/25 transition-all hover:bg-blue-700 hover:shadow-xl hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Browse Events
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}