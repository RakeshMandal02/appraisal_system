"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // Add loading state
    const router = useRouter();

    useEffect(() => {
        async function loadUser() {
            try {
                const res = await fetch("/api/session");
                if (res.ok) {
                    const data = await res.json();
                    setUser(data.user);
                }
            } catch (err){
                console.error("Session fetch error:", err);
            }finally {
                setLoading(false); // Set Loading to false once done
            }
        }
        loadUser();
    }, []);

    const logout = async () => {
        await fetch("/api/logout", { method: "POST" });
        setUser(null);
        router.push("/login");
    };

    return (
        <AuthContext.Provider value={{ user, setUser, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
