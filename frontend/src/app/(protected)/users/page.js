import { ProtectedRoute } from "@/app/components/UI/ProtectedRoute";
import UserDashboard from "@/app/components/UI/Dashboard";

export default function mainPage(){
  return(
    <ProtectedRoute>
        <UserDashboard/>
    </ProtectedRoute>
  )
}