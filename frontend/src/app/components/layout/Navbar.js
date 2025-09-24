import Link from "next/link"
import Icons from "@/app/components/UI/Icons"
import { useAuth } from "@/config/contexts/AuthContext"
import styles from '@/styles/Navbar.module.css'

export default function Navbar() {
    const { user, logout } = useAuth()

    if (!user) return null // si no hay usuario autenticado, no muestra nada

    // ojo aquí: mantenemos el basePath correcto
    const basePath = user.role === 1 ? "/admin" : "/users"

    // enlaces de admin
    const adminLinks = [
        { href: `/admin`, label: "Dashboard", icon: "dashboard" },
        { href: `/admin/manageUsers`, label: "Modificar usuarios", icon:"user" },
        { href: `/admin/createUser`, label: "Crear nuevo usuario", icon: "addUser" },
        { href: `/users/correspondencia`, label: "Crear correspondencia", icon: "addDocument" },
        { href: `/users/seguimiento`, label: "Seguimiento",icon: "searchDocument" },
        { href: `/admin/reports`, label: "Informes", icon: "report" }
    ]

    // enlaces de usuario
    const userLinks = [
        { href: `/users`, label: "Dashboard", icon: "dashboard" },
        { href: `/users/correspondencia`, label: "Crear correspondencia", icon: "addDocument" },
        { href: `/users/seguimiento`, label: "Seguimiento", icon: "searchDocument" },
        { href: `/users/informes`, label: "Informes", icon: "report"}
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
                                <Icons name={link.icon} fill/>
                                <Link href={link.href}>{link.label}</Link>
                            </li>
                        ))}
                    </ul>
                </section>

                <section className={styles.settings}>
                    <p>Administra tu Perfil</p>
                    <ul className={styles.linkContainer}>
                        <li className={styles.linkItem}>
                            <Icons name="profile" fill/>
                            <Link href={`${basePath}/profile`}>Profile</Link>
                        </li>
                        <li className={styles.linkItem} onClick={logout}>
                            <Icons name="logout" fill/>
                            Log Out</li>
                    </ul>
                </section>
            </nav>
        </div>
    )
}
