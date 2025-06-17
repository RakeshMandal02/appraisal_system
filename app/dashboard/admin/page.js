"use client"
import { useRouter} from "next/navigation";
import ProtectedRoute from "app/components/ProtectedRoute";

export default function AdminDashboard() {
  const router = useRouter();

    return(
        <ProtectedRoute allowedRoles={["ADMIN"]}>
          <div>
            <h1>Admin Dashboard</h1>
            <button 
            onClick = {()=> router.push("/dashboard/admin/create-user")}
            >
             Create User
            </button>
          </div>
        </ProtectedRoute>
    )
}
