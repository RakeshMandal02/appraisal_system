"use client";

import { useAuth } from "app/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({ allowedRoles, children }) {
    const { user,logout, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
          if (!user || !allowedRoles.includes(user.role)) {
            router.push("/login");
          }
        }
      }, [user, loading]);

    if(loading || !user || !allowedRoles.includes(user.role)){
        return <div>Loading...</div>
    }

   return (
    <div>
      <div>
        <h2>Welcome, {user.email}</h2>
        <button
          onClick={logout}
        >
          Logout
        </button>
      </div>
      {children}
    </div>
  );
}
