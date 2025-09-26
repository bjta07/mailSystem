'use client'
import { memberApi } from "@/config/api/apiAuth"
import { useState } from "react"
import styles from '@/styles/MemberForm.module.css'

export default function RegistrarAfiliados(){
    const [formData, setFormData] = useState({
        ci: "",
        nombres:"",
        apellidos:"",
        colegio_id: ""
    })

    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState("")

    const handleChange = (e) => {
        const { id, value } = e.target
        setFormData(prev => ({
            ...prev,
            [id]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setMessage("")

        try {
            const memberData = {...formData}
            const response = await memberApi.registerMember(memberData)
            
            if (response.ok) {
                setMessage("Afiliado creado con exito")
                setFormData({
                    ci:"",
                    nombres: "",
                    apellidos: "",
                    colegio_id: ""
                })
            } else{
                const errorData = await response.json()
                console.log(`Error data ${errorData || "No se pudo crear al afiliado"}`)
            }
        } catch (error) {
            setMessage("Error en la conexion del servidor")
        }finally{
            setLoading(false)
        }
        
    }
    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <h2>Registrar nuevo afiliado</h2>
                <div className={styles.div}>
                    <input className={styles.input} type="text" placeholder="Nombres" id="nombres" value={formData.nombres} onChange={handleChange} required/>
                    <input className={styles.input} type="text" placeholder="Apellidos" id="apellidos" value={formData.apellidos} onChange={handleChange} required/>
                    <input className={styles.input} type="text" placeholder="Carnet de identidad" id="ci" value={formData.ci} onChange={handleChange} required/>
                    <div className={styles.colegio}>
                        <label>Colegio:</label>
                        <select
                            id="colegio_id"
                            value={formData.colegio_id}
                            onChange={handleChange}
                            className={styles.select}
                            required
                        >
                            <option value="">Seleccione...</option>
                            <optgroup label="Colegios Departamentales">
                                <option value="1">Colegio departamental de Santa Cruz</option>
                                <option value="2">Colegio departamental de La Paz</option>
                                <option value="3">Colegio departamental de Cochabamba</option>
                                <option value="4">Colegio departamental de Oruro</option>
                                <option value="5">Colegio departamental de Potosí</option>
                                <option value="6">Colegio departamental de Tarija</option>
                                <option value="7">Colegio departamental de Sucre</option>
                                <option value="8">Colegio departamental de Pando</option>
                            </optgroup>
                            <optgroup label="Colegios Regionales">
                                <option value="9">Colegio regional de El Alto</option>
                                <option value="10">Colegio regional de Tupiza</option>
                                <option value="11">Colegio regional de Camiri</option>
                                <option value="12">Colegio regional de Catavi</option>
                            </optgroup>
                        </select>
                    </div>
                    <button type="submit" className={styles.button} disabled={loading}>
                        {loading? "Registrando...": "Registrar"}
                    </button>
                    {message && <p className={styles.messate}>{message}</p>}
                </div>
            </form>
        </div>
    )
}