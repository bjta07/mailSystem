'use client'
import { useState, useEffect } from "react"
import { useAuth } from "@/config/contexts/AuthContext"
import { memberApi } from "@/config/api/apiAuth"
import { aportesApi } from "@/config/api/apiAuth"

export default function Reports (){
    const [members, setMembers] = useState([])
    const [aportaciones, setAportaciones] = useState({})
    const [searchFilters, setSearchFilters] = useState({ ci: "", colegio_id: "" })
    const { user: currentUser } = useAuth()
}