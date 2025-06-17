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
    <div>
      <h1>Redirecting to your dashboard...</h1>
      <p>Role: {user.role}</p>
      <button
        onClick={logout}
        className
      >
        Logout
      </button>
    </div>
  );
}
