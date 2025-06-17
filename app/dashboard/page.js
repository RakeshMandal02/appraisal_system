"use client";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else {
        const roleRouteMap = {
          ADMIN: "/dashboard/admin",
          MANAGER: "/dashboard/manager",
          EMPLOYEE: "/dashboard/employee",
          REVIEWER: "/dashboard/reviewer",
        };
        const redirectTo = roleRouteMap[user.role] || "/login";
        router.push(redirectTo);
      }
    }
  }, [user, loading]);

  if (loading || !user) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Redirecting to your dashboard...</h1>
      <p>Role: {user.role}</p>
      <button
        onClick={logout}
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </div>
  );
}
