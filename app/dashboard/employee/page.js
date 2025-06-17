"use client";
import ProtectedRoute from "../../components/ProtectedRoute";

export default function EmployeeDashboard() {
    return(
        <ProtectedRoute allowedRoles={["EMPLOYEE"]}>
            <div>
                <h1>Employee Dashboard</h1>
                <p>Only accessible by employees</p>
            </div>
        </ProtectedRoute>
    )
}
