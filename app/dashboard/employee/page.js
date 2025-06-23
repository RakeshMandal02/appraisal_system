"use client";
import { useState } from "react";
import { useAuth } from "app/context/AuthContext";
import ProtectedRoute from "../../components/ProtectedRoute";

export default function EmployeeDashboard() {

    const { user, logout } = useAuth();
    const [content, setContent] = useState("");
    const [message, setMessage] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setMessage("");

        try {
            const res = await fetch("/api/appraisals/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content }),
            });

            if (res.ok) {
                setMessage("✅ Appraisal submitted successfully!");
                setContent("");
            } else {
                setMessage("❌ Failed to submit appraisal.");
            }
        } catch (err) {
            console.error("Appraisal form error:", err);
            setMessage("❌ Something went wrong.");
        }
        setSubmitting(false);
    };

    return (
        <ProtectedRoute allowedRoles={["EMPLOYEE"]}>
            <div>
            <h1 className="text-2xl font-semibold mb-4">
          Welcome {user?.name} (Employee)
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            className="w-full p-3 border border-gray-300 rounded"
            placeholder="Write your appraisal..."
            rows={6}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit Appraisal"}
          </button>
          {message && <p className="text-sm mt-2">{message}</p>}
        </form>

        <button
          onClick={logout}
          className="mt-6 text-sm text-red-500 underline"
        >
          Logout
        </button>
            </div>
        </ProtectedRoute>
    )
}
