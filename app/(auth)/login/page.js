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
        const res = await fetch("/api/login",{
         method: "POST",
         body: JSON.stringify(form),
        });

        const data = await res.json();
        if(!res.ok) return setError(data.error);
        setUser(data.user);
        router.push("/dashboard");
    };

    return(
       <form onSubmit={handleSubmit}
      className= "max-w-md mx-automt-20" >
      <h2> Login </h2>
      <input
      className="w-full p-2 mb-2 border"
      placeholder="Email"
      value={form.email}
      onChange={(e)=>setForm({...form,email:e.target.value })}
      />
      <input
      type="password"
      className="w-full p-2 mb-2 border"
      placeholder="password"
      value={form.password}
      onChange={(e)=> setForm({...form, password: e.target.value })}
      />
     <button className="bg-blue-500 text-white px-4 py-2 rounded">Login</button>
     {error && <p className="text-red-500 mt-2">{error}</p>}
      
       </form>
    )
}