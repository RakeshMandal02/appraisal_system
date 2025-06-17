"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "app/components/ProtectedRoute";

export default function CreateUserPage() {
    const router = useRouter();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        role: "EMPLOYEE",
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        setForm({...form, [e.target.name]:e.target.value});
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        const res = await fetch("/api/register",{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(form),
        });

        if(res.ok) {
            setSuccess("User created successfully");
            setForm({ name: "", email: "", password: "",role: "EMPLOYEE"});
        }
        // else{
        //     const test = await res.text();
        //     setError(text || "Failed to create user")
        // }
    };

    return(
        <ProtectedRoute allowedRoles={["ADMIN"]}>
            <div>
                <h2>Create User</h2>
                <form onSubmit={handleSubmit}>
                <input
                type="text"
                name="name"
                placeholder="Name"
                value={form.name}
                onChange={handleChange}
                required
                />
                <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
                />
                <input
                type="password"
                name="password"
                placeholder="password"
                value={form.password}
                onChange={handleChange}
                required
                />
                <select
                name="role"
                value={form.role}
                onChange={handleChange}
                >
                 <option value="EMPLOYEE">Employee</option>
                 <option value="MANAGER">Manager</option>
                 <option value="REVIEWER">Reviewer</option>
                 <option value="ADMIN">Admin</option>
                </select>

                {error && <p>{error}</p>}
                {success && <p>{success}</p>}

                <button type="submit">
                    Create User
                </button>
                </form>
            </div>
        </ProtectedRoute>
    )
}
