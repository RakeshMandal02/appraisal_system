"use client";

import { useAuth } from "app/context/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const { user, loading, setUser } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Redirect authenticated users away from login
  useEffect(() => {
    console.log("useEffect user:", user, "loading:", loading);
    if (!loading && user) {
      const roleRouteMap = {
        ADMIN: "/dashboard/admin",
        MANAGER: "/dashboard/manager",
        EMPLOYEE: "/dashboard/employee",
        REVIEWER: "/dashboard/reviewer",
      };
      console.log("Redirecting to:", roleRouteMap[user.role] || "/dashboard");
      router.push(roleRouteMap[user.role] || "/dashboard");
    }
  }, [user, loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password }),
      credentials: "include"
    });

    if (!res.ok) {
      setError("Invalid credentials");
    } else {
      const data = await res.json();
      setUser(data.user);
      // Removed immediate redirect here to rely on useEffect for redirect
    }
  };

  if (loading) return <div>Loading...</div>;
  if (user) return null; // Prevent showing login form while redirecting

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-4 p-6 border rounded-lg shadow"
      >
        <h1 className="text-2xl font-semibold">Login</h1>
        {error && <p className="text-red-500">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
      </form>
    </div>
  );
}
