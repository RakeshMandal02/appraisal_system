"use client"
import ProtectedRoute from "../../components/ProtectedRoute";

export default function ReviewerDashboard() {
    return(
        <ProtectedRoute allowedRoles={["REVIEWER"]}>
         <div>
            <h1>Reviewer Dashboard</h1>
            <p>Only accessible by Reviewers</p>
         </div>
        </ProtectedRoute>
    )
}
