"use client";

import { useEffect, useState } from "react";
import { useAuth } from "app/context/AuthContext";
import ProtectedRoute from "app/components/ProtectedRoute";

export default function ManagerDashboard() {
  const { user, logout, loading } = useAuth();
  const [appraisals, setAppraisals] = useState([]);
  const [feedbacks, setFeedbacks] = useState({});
  const [message, setMessage] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [status, setStatus] = useState("all");
  const [totalPages, setTotalPages] = useState(1);

  const fetchAppraisals = async () => {
    let url = `/api/appraisals?page=${page}&limit=${limit}`;
    if (status !== "all") url += `&status=${status}`;

    try {
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setAppraisals(data.appraisals);
        setTotalPages(data.totalPages);
      } else {
        setMessage("❌ Failed to fetch appraisals.");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setMessage("❌ Something went wrong.");
    }
  };

  useEffect(() => {
    if (user?.role === "MANAGER") {
      fetchAppraisals();
    }
  }, [user, page, status]);

  const handleFeedbackSubmit = async (id) => {
    try {
      const res = await fetch("/api/appraisals/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appraisalId: id,
          feedback: feedbacks[id],
        }),
      });

      if (res.ok) {
        setMessage("✅ Feedback submitted");
        setAppraisals((prev) =>
          prev.map((a) =>
            a.id === id ? { ...a, feedback: feedbacks[id] } : a
          )
        );
      } else {
        setMessage("❌ Failed to submit feedback");
      }
    } catch (err) {
      console.error("Feedback submit error:", err);
      setMessage("❌ Something went wrong");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <ProtectedRoute allowedRoles={["MANAGER"]}>
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4">
          Welcome {user?.name} (Manager)
        </h1>

        {/* Filter Dropdown */}
        <div className="mb-4">
          <label className="mr-2 font-medium">Filter:</label>
          <select
            className="border px-2 py-1 rounded"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1); // Reset to page 1
            }}
          >
            <option value="all">All</option>
            <option value="pending">Pending Feedback</option>
            <option value="reviewed">Feedback Given</option>
          </select>
        </div>

        {appraisals.length === 0 ? (
          <p>No appraisals found.</p>
        ) : (
          appraisals.map((a) => (
            <div
              key={a.id}
              className="border border-gray-300 rounded p-4 mb-6"
            >
              <p><strong>Employee:</strong> {a.employeeName}</p>
              <p><strong>Content:</strong> {a.content}</p>

              {a.feedback ? (
                <p className="mt-2 text-green-600">
                  <strong>Manager Feedback:</strong> {a.feedback}
                </p>
              ) : (
                <div className="mt-2">
                  <textarea
                    className="w-full border p-2 rounded"
                    placeholder="Write feedback..."
                    rows={3}
                    value={feedbacks[a.id] || ""}
                    onChange={(e) =>
                      setFeedbacks({ ...feedbacks, [a.id]: e.target.value })
                    }
                  />
                  <button
                    onClick={() => handleFeedbackSubmit(a.id)}
                    className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Submit Feedback
                  </button>
                </div>
              )}
            </div>
          ))
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex gap-4 justify-center items-center">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
              disabled={page === 1}
            >
              Previous
            </button>
            <span className="text-sm">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
        )}

        {message && <p className="text-sm mt-4 text-center">{message}</p>}

        <button
          onClick={logout}
          className="mt-8 text-sm text-red-500 underline"
        >
          Logout
        </button>
      </div>
    </ProtectedRoute>
  );
}
