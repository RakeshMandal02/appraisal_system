"use client";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";

export default function LoginPage() {
    const { setUser } = useAuth();
    const router = useRouter();
    const [form, setForm] = useState({ email: "",password: ""});
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        const res = await fetch("/api/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(form),
          });
          

        const data = await res.json();
        if(!res.ok) return setError(data.error);
        setUser(data.user);
        router.push("/dashboard");
    };

    return(
       <form onSubmit={handleSubmit}>
      <h2> Login </h2>
      <input
      placeholder="Email"
      value={form.email}
      onChange={(e)=>setForm({...form,email:e.target.value })}
      />
      <input
      type="password"
      placeholder="password"
      value={form.password}
      onChange={(e)=> setForm({...form, password: e.target.value })}
      />
     <button >Login</button>
     {error && <p>{error}</p>}
      
       </form>
    )
}