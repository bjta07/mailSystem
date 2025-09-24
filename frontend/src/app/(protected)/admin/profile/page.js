import Profile from "@/app/components/UI/Profile";
import { ProtectedRoute } from "@/app/components/UI/ProtectedRoute";

export default function SeeProfile(){
    return (
        <ProtectedRoute>
            <Profile/>
        </ProtectedRoute>
    )
}