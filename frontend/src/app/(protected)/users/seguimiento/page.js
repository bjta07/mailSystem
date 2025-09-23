'use client'
import { useAuth } from "@/config/contexts/AuthContext"
import MailTable from "@/app/components/UI/MailTable"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function SeguimientoPage(){
    const { user, loading, isAuthenticated } = useAuth()
    const router = useRouter()

    useEffect(()=>{
        if (!loading && !isAuthenticated) {
            router.push('/login')
        }
    }, [loading, isAuthenticated, router])

    if (loading) return <p>Cargando...</p>

    return(
        <div>
            <h2>Lista de Correspondencia</h2>
            <MailTable />
        </div>
    )
}