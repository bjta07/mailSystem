import Link from "next/link"
import { useAuth } from "@/config/contexts/AuthContext"
import styles from '@/styles/Navbar.module.css'

export default function Navbar(){
    const { user, logout } = useAuth()

    // Define el prefijo de rutas según el rol
    const basePath = user?.role === 1 ? "/admin" : "/user"

    return (
        <div className={styles.navContainer}>
            <nav className={styles.nav}>
                <section className={styles.adminLinks}>
                    <p>General</p>
                    <ul className={styles.linkContainer}>
                        <li className={styles.linkItem}>
                            <Link href={`${basePath}`}>Dashboard</Link>
                        </li>
                        <li className={styles.linkItem}>
                            <Link href={`${basePath}/manageUsers`}>Modificar usuarios</Link>
                        </li>
                        <li className={styles.linkItem}>
                            <Link href={`${basePath}/createUser`}>Crear nuevo usuario</Link>
                        </li>
                        <li className={styles.linkItem}>
                            <Link href={`${basePath}/manageMail`}>Correspondencia</Link>
                        </li>
                        <li className={styles.linkItem}>
                            <Link href={`${basePath}/reports`}>Informes</Link>
                        </li>
                    </ul>
                </section>
                <section className={styles.settings}>
                    <p>Administra tu Perfil</p>
                    <ul className={styles.linkContainer}>
                        <li className={styles.linkItem}>
                            <Link href={`${basePath}/profile`}>Profile</Link>
                        </li>
                        <li className={styles.linkItem} onClick={logout}>Log Out</li>
                    </ul>
                </section>
            </nav>
        </div>
    )
}
