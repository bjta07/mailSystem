'use client'
import { useAuth } from "@/config/contexts/AuthContext"
import MemberTable from "@/app/components/UI/MemberTable"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function MembersPage(){
    const { user, loading, isAuthenticated} = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push('/login')
        }
    }, [loading, isAuthenticated, router])

    if(loading) return <p>Cargando...</p>

    return (
        <div>
            <MemberTable/>
        </div>
    )
}