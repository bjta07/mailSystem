'use client'
import { useState } from "react"
import styles from '@/styles/CreateUser.module.css'

export default function CreateUser(){
    const [role, setRole] = useState("user")

    return(
        <div className={styles.container}>
            <form method='POST' className={styles.form}>
                <h2>Crear Usuario</h2>
                
                <div className={styles.div}>
                    <input className={styles.input} type="text" placeholder="Nombre" id="name" required/>
                    <input className={styles.input} type="text" placeholder="Usuario" id="username" required/>
                </div>

                <div className={styles.div}>
                    <input className={styles.input} type="email" placeholder="Correo" id="email" required/>
                    <input className={styles.input} type="password" placeholder="Contraseña" id="password" required/>
                </div>

                <div className={styles.div}>
                    <input className={styles.input} type="text" placeholder="Teléfono" id="phone"/>
                    <input className={styles.input} type="text" placeholder="Carnet de Identidad" id="ci" required/>
                </div>

                <div className={styles.divRole}>
                    <label className={styles.label}>Rol</label>
                    <div className={styles.switch}>
                        <span className={role === "user" ? styles.active : ""}>User</span>
                        <label className={styles.toggle}>
                            <input 
                                type="checkbox" 
                                checked={role === "admin"} 
                                onChange={() => setRole(role === "user" ? "admin" : "user")} 
                            />
                            <span className={styles.slider}></span>
                        </label>
                        <span className={role === "admin" ? styles.active : ""}>Admin</span>
                    </div>
                </div>

                <button type='submit' className={styles.button}>Crear usuario</button>
            </form>
        </div>
    )
}
