"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import ProtectedRoute from "@/components/ProtectedRoute";

interface EventData {
  title: string;
  description: string;
  category: string;
  date: string;
  time: string;
  location: string;
  organizer: string;
  seats: number;
  image_url: string | null;
}

export default function EditEventPage() {
  const params = useParams();
  const router = useRouter();

  const eventId = Number(params.id);

  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [organizer, setOrganizer] = useState("");
  const [seats, setSeats] = useState("");

  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    async function loadEvent() {
      setLoading(true);
      setError("");

      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("id", eventId)
        .maybeSingle();

      if (error) {
        console.error("Load event error:", error);
        setError(error.message);
        setLoading(false);
        return;
      }

      if (!data) {
        console.error("No event found for ID:", eventId);
        setError("Event not found.");
        setLoading(false);
        return;
      }

      setEvent(data);

      setTitle(data.title);
      setDescription(data.description);
      setCategory(data.category);
      setDate(data.date);
      setTime(data.time);
      setLocation(data.location);
      setOrganizer(data.organizer);
      setSeats(String(data.seats));

      if (data.image_url) {
        setImagePreview(data.image_url);
      }

      setLoading(false);
    }

    if (eventId) {
      loadEvent();
    }
  }, [eventId]);

  function handleImageChange(file: File | null) {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB.");
      return;
    }

    setError("");
    setImage(file);

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setSaving(true);
    setError("");

    try {
      let imageUrl = event?.image_url ?? null;

      if (image) {
        const fileExtension = image.name.split(".").pop()?.toLowerCase();
        const fileName = `${crypto.randomUUID()}.${fileExtension}`;

        const { error: uploadError } = await supabase.storage
          .from("event-images")
          .upload(fileName, image, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) {
          console.error("Image upload error:", uploadError);
          setError(uploadError.message);
          setSaving(false);
          return;
        }

        const { data: publicUrlData } = supabase.storage
          .from("event-images")
          .getPublicUrl(fileName);

        imageUrl = publicUrlData.publicUrl;
      }

      const { error: updateError } = await supabase
        .from("events")
        .update({
          title: title.trim(),
          description: description.trim(),
          category: category.trim(),
          date,
          time,
          location: location.trim(),
          organizer: organizer.trim(),
          seats: Number(seats),
          image_url: imageUrl,
        })
        .eq("id", eventId);

      if (updateError) {
        console.error("Update event error:", updateError);
        setError(updateError.message);
        setSaving(false);
        return;
      }

      router.push(`/events/${eventId}`);
      router.refresh();
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("Something went wrong. Please try again.");
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <ProtectedRoute requiredRole="admin">
        <main className="flex min-h-screen items-center justify-center bg-gray-50">
          <div className="flex flex-col items-center gap-4">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
            <p className="text-sm font-medium text-gray-500">
              Loading event...
            </p>
          </div>
        </main>
      </ProtectedRoute>
    );
  }

  if (!event) {
    return (
      <ProtectedRoute requiredRole="admin">
        <main className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
          <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-10 text-center shadow-xl shadow-gray-200/50">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-2xl text-red-500">
              !
            </div>

            <h1 className="mt-6 text-2xl font-bold tracking-tight text-gray-900">
              Event Not Found
            </h1>

            <p className="mt-3 text-sm text-gray-500">
              The event you are trying to edit does not exist.
            </p>

            <p className="mt-2 text-xs text-gray-400">Event ID: {eventId}</p>

            <button
              onClick={() => router.push("/events")}
              className="mt-8 inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition-all hover:bg-blue-700"
            >
              Back to Events
            </button>
          </div>
        </main>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requiredRole="admin">
      <main className="min-h-screen bg-gray-50">
        <section className="mx-auto max-w-4xl px-6 py-10 sm:py-12">
          {/* Header */}
          <div className="mb-10">
            <button
              onClick={() => router.back()}
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
              Back
            </button>

            <p className="mt-8 text-sm font-semibold uppercase tracking-wider text-blue-600">
              Event Management
            </p>

            <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Edit Event
            </h1>

            <p className="mt-3 text-gray-500">
              Update your event information and image.
            </p>
          </div>

          {/* Form Card */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8 md:p-10">
            {error && (
              <div className="mb-8 flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3.5 text-sm text-red-700">
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
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-7">
              {/* Event Image */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Event Image
                </label>

                <div className="overflow-hidden rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/80">
                  {imagePreview ? (
                    <div className="relative">
                      <Image
                        src={imagePreview}
                        alt={title || "Event image"}
                        width={1200}
                        height={600}
                        unoptimized
                        className="h-64 w-full object-cover"
                        onError={() => {
                          setImagePreview("");
                          setError(
                            "The current event image could not be loaded."
                          );
                        }}
                      />

                      <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3">
                        <span className="rounded-lg bg-black/70 px-3 py-2 text-sm text-white backdrop-blur-sm">
                          {image ? image.name : "Current event image"}
                        </span>

                        <label className="cursor-pointer rounded-xl bg-white px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm transition hover:bg-gray-50">
                          Change Image
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) =>
                              handleImageChange(e.target.files?.[0] ?? null)
                            }
                          />
                        </label>
                      </div>
                    </div>
                  ) : (
                    <label className="flex min-h-64 cursor-pointer flex-col items-center justify-center px-6 py-12 text-center transition hover:bg-blue-50/50">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-3xl">
                        🖼️
                      </div>

                      <p className="mt-4 text-base font-semibold text-gray-800">
                        Upload event image
                      </p>

                      <p className="mt-2 text-sm text-gray-500">
                        Click to browse from your computer
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        PNG, JPG, WEBP • Maximum 5MB
                      </p>

                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          handleImageChange(e.target.files?.[0] ?? null)
                        }
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Title */}
              <div>
                <label
                  htmlFor="title"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Event Title
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={5}
                  className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

              {/* Category */}
              <div>
                <label
                  htmlFor="category"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Category
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                >
                  <option value="">Select a category</option>
                  <option value="Technology">Technology</option>
                  <option value="Business">Business</option>
                  <option value="Music">Music</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Networking">Networking</option>
                  <option value="AI & Innovation">AI & Innovation</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Date + Time */}
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="date"
                    className="mb-1.5 block text-sm font-medium text-gray-700"
                  >
                    Date
                  </label>
                  <input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>

                <div>
                  <label
                    htmlFor="time"
                    className="mb-1.5 block text-sm font-medium text-gray-700"
                  >
                    Time
                  </label>
                  <input
                    id="time"
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    required
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label
                  htmlFor="location"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Location
                </label>
                <input
                  id="location"
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

              {/* Organizer + Seats */}
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="organizer"
                    className="mb-1.5 block text-sm font-medium text-gray-700"
                  >
                    Organizer
                  </label>
                  <input
                    id="organizer"
                    type="text"
                    value={organizer}
                    onChange={(e) => setOrganizer(e.target.value)}
                    required
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>

                <div>
                  <label
                    htmlFor="seats"
                    className="mb-1.5 block text-sm font-medium text-gray-700"
                  >
                    Available Seats
                  </label>
                  <input
                    id="seats"
                    type="number"
                    min="1"
                    value={seats}
                    onChange={(e) => setSeats(e.target.value)}
                    required
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col gap-3 border-t border-gray-100 pt-7 sm:flex-row">
                <button
                  type="submit"
                  disabled={saving}
                  className="relative flex flex-1 items-center justify-center rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition-all hover:bg-blue-700 hover:shadow-xl disabled:pointer-events-none disabled:opacity-60"
                >
                  {saving ? (
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
                      Saving Changes...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => router.back()}
                  className="flex-1 rounded-xl border border-gray-200 px-6 py-3.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>
    </ProtectedRoute>
  );
}