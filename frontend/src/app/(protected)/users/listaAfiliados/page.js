'use client'

import { memberApi } from "@/config/api/apiAuth"
import { useEffect, useState } from "react"

export default function ListaAfiliados(){
    const [members, setMembers] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(()=> {
        const fetchData = async () => {
            try{
                const {ok, data} = await memberApi.getAllMembers()
                if(ok) setMembers(data)
            }catch(error){
                console.error('Error cargando afiliados', error)
            }finally{
                setLoading(false)
            }
        }
        fetchData()
    },[])
    if (loading) {
        return <p>Cargando</p>
    }
    return (
        <div>
            <h1>Lista de afiliados</h1>
            {members.map((afiliado) => (
                <div key={afiliado.id}>
                    <p>{afiliado.nombres} {afiliado.apellidos} {afiliado.ci} {afiliado.colegio_id}</p>
                </div>
            ))}
        </div>
    )
}