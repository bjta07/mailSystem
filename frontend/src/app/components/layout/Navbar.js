import Link from "next/link"
import { useAuth } from "@/config/contexts/AuthContext"
import styles from '@/styles/Navbar.module.css'

export default function Navbar(){
    const { user, logout } = useAuth()

    if (!user) return null // si no hay usuario autenticado, no muestra nada

    const basePath = user.role === 1 ? "/admin" : "/users"

    // enlaces de admin
    const adminLinks = [
        { href: `${basePath}`, label: "Dashboard" },
        { href: `${basePath}/manageUsers`, label: "Modificar usuarios" },
        { href: `${basePath}/createUser`, label: "Crear nuevo usuario" },
        { href: `${basePath}/manageMail`, label: "Correspondencia" },
        { href: `${basePath}/reports`, label: "Informes" }
    ]

    // enlaces de usuario
    const userLinks = [
        { href: `${basePath}`, label: "Dashboard" },
        { href: `${basePath}/correspondencia`, label: "Crear correspondencia" },
        { href: `${basePath}/seguimiento`, label: "Seguimiento" }
    ]

    const links = user.role === 1 ? adminLinks : userLinks

    return (
        <div className={styles.navContainer}>
            <nav className={styles.nav}>
                <section className={styles.adminLinks}>
                    <p>{user.role === 1 ? "General (Admin)" : "General (Usuario)"}</p>
                    <ul className={styles.linkContainer}>
                        {links.map(link => (
                            <li key={link.href} className={styles.linkItem}>
                                <Link href={link.href}>{link.label}</Link>
                            </li>
                        ))}
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
