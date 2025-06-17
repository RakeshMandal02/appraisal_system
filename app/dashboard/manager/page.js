"use client";
import ProtectedRoute from "../../components/ProtectedRoute";

export default function ManagerDashboard() {
    return(
        <ProtectedRoute allowedRoles={["MANAGER"]}>
          <div>
            <h1>Manager Dashboard</h1>
            <p>Only accessible by Managers</p>
          </div>
        </ProtectedRoute>
    )
}
