"use client"

import ProtectedRoute from "app/components/ProtectedRoute";

export default function AdminDashboard() {
    return(
        <ProtectedRoute allowedRoles={["ADMIN"]}>
          <div>
            <h1>Admin Dashboard</h1>
            <p>Only accessible by Admins</p>
          </div>
        </ProtectedRoute>
    )
}
