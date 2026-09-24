"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DeleteEventButton from "@/components/DeleteEventButton";
import { supabase } from "@/lib/supabase";

interface AdminEventActionsProps {
  eventId: number;
}

export default function AdminEventActions({
  eventId,
}: AdminEventActionsProps) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAdmin() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (!error && profile?.role === "admin") {
        setIsAdmin(true);
      }

      setLoading(false);
    }

    checkAdmin();
  }, []);

  if (loading || !isAdmin) {
    return null;
  }

  return (
    <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-gray-100 pt-5">
      <Link
        href={`/edit-event/${eventId}`}
        className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:border-gray-300"
      >
        Edit Event
      </Link>

      <DeleteEventButton eventId={eventId} />
    </div>
  );
}