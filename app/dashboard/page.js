"use client";
import { useAuth } from "../context/AuthContext"
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
    const { user, logout, loading } = useAuth()
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading]);

  if (loading || !user) return <div>Loading...</div>;

  return (
    <div >
      <h1 >Welcome, {user.email}</h1>
      <p>Role: {user.role}</p>
      <button
        onClick={logout}
      >
        Logout
      </button>
    </div>
  );
}
