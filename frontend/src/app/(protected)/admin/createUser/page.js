'use client'
import { useState } from "react"
import { authApi } from "@/config/api/apiAuth"
import styles from '@/styles/CreateUser.module.css'

export default function CreateUser(){
    const [role, setRole] = useState(2) 
    const [formData, setFormData] = useState({
        name: "",
        username: "",
        email: "",
        password: "",
        phone: "",
        ci: ""
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
            const userData = {...formData, role}
            const response = await authApi.register(userData)

            if (response.ok) {
                setMessage("Usuario creado con exito")
                setFormData({
                    name: "",
                    username: "",
                    email: "",
                    password: "",
                    phone: "",
                    ci: ""
                })
                setRole(2)
            } else {
                const errorData = await response.json()
                console.log(`Error data ${errorData|| "no se pudo crear el usuario"}`)
            }
        } catch (error) {
            setMessage("Error en la conexion con el servidor")
        }finally{
            setLoading(false)
        }
    }

    return(
        <div className={styles.container}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <h2>Crear Usuario</h2>
                
                <div className={styles.div}>
                    <input className={styles.input} type="text" placeholder="Nombre" id="name" value={formData.name} onChange={handleChange} required/>
                    <input className={styles.input} type="text" placeholder="Usuario" id="username" value={formData.username} onChange={handleChange} required/>
                </div>

                <div className={styles.div}>
                    <input className={styles.input} type="email" placeholder="Correo" id="email" value={formData.email} onChange={handleChange} required/>
                    <input className={styles.input} type="password" placeholder="Contraseña" id="password" value={formData.password} onChange={handleChange} required/>
                </div>

                <div className={styles.div}>
                    <input className={styles.input} type="text" placeholder="Teléfono" id="phone" value={formData.phone} onChange={handleChange} required/>
                    <input className={styles.input} type="text" placeholder="Carnet de Identidad" id="ci" value={formData.ci} onChange={handleChange} required/>
                </div>

                <div className={styles.divRole}>
                    <label className={styles.label}>Rol</label>
                    <div className={styles.switch}>
                        <span className={role === 2 ? styles.active : ""}>User</span>
                        <label className={styles.toggle}>
                            <input 
                                type="checkbox" 
                                checked={role === 1}
                                onChange={() => setRole(role === 2 ? 1 : 2)}
                            />
                            <span className={styles.slider}></span>
                        </label>
                        <span className={role === 1 ? styles.active : ""}>Admin</span>
                    </div>
                </div>

                <button type='submit' className={styles.button} disabled={loading}>{loading ? "Creando..." : "Crear usuario"}</button>
                {message && <p>{message}</p>}
            </form>
        </div>
    )
}
