"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "admin" | "customer";
}

export default function ProtectedRoute({
  children,
  requiredRole,
}: ProtectedRouteProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    async function checkAccess() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      // If no specific role is required,
      // any logged-in user can access the page.
      if (!requiredRole) {
        setAuthorized(true);
        setLoading(false);
        return;
      }

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (error || !profile) {
        router.replace("/events");
        return;
      }

      if (profile.role !== requiredRole) {
        router.replace("/events");
        return;
      }

      setAuthorized(true);
      setLoading(false);
    }

    checkAccess();
  }, [router, requiredRole]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-600">
          Checking authorization...
        </p>
      </main>
    );
  }

  if (!authorized) {
    return null;
  }

  return <>{children}</>;
}