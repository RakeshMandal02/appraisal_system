"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "app/context/AuthContext";
import "./create-user.css";

export default function CreateUser() {
   const { user, loading } = useAuth();
   const router = useRouter();
   
   const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "EMPLOYEE"
   })

   const [error, setError] = useState("");
   const [success, setSuccess] = useState("");

   if(loading) return <div>Loading...</div>
   if(!user || user.role !== "ADMIN") {
    router.push("/login");
    return null;
   }

   const handleChange = (e) => {
    setFormData((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
    }))
   };

   const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const res = await fetch("/api/users",{
        method: "POST",
        body: JSON.stringify(formData),
    });

    if(res.ok) {
        setSuccess("User created successfully");
        setFormData({ name: "", email:"",password:"",role: "EMPLOYEE"});
    } else {
        const msg = await res.text();
        setError(msg || "Error creating user")
    }
   }

    return(
        <div>
            <h2>Create New User</h2>
            {error && <p>{error}</p>}
            <form onSubmit={handleSubmit}>
                <input
                name ="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                required
                />
                <input 
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                />
                <input 
                name="password"
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                />
                <select 
                name="role"
                value={formData.role}
                onChange={handleChange}
                >
                    <option value="EMPLOYEE">Employee</option>
                    <option value="MANAGER">Manager</option>
                    <option value="ADMIN">Reviewer</option>
                </select>
                <button 
                type="submit">
                    Create User
                </button>
            </form>
        </div>
    )

}