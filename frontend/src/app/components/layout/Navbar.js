import Link from "next/link"
import Icons from "@/app/components/UI/Icons"
import { useAuth } from "@/config/contexts/AuthContext"
import styles from '@/styles/Navbar.module.css'

export default function Navbar({ collapsed }) {
  const { user, logout } = useAuth()

  if (!user) return null 

  const basePath = user.role === 1 ? "/admin" : "/users"

  const adminLinks = [
    { href: `/admin`, label: "Dashboard", icon: "dashboard" },
    { href: `/admin/manageUsers`, label: "Modificar usuarios", icon:"user" },
    { href: `/admin/createUser`, label: "Crear nuevo usuario", icon: "addUser" },
    { href: `/users/correspondencia`, label: "Crear correspondencia", icon: "addDocument" },
    { href: `/users/seguimiento`, label: "Seguimiento",icon: "searchDocument" },
    { href: `/users/registrar`, label: "Registrar Afiliado", icon:"addUser"},
    { href: `/users/listaAfiliados`, label: "Afiliados", icon:"users"},
    { href: `/admin/aportes`, label: "Aportes", icon:"editCash"},
    { href: `/admin/reports`, label: "Informes", icon: "report" }
  ]

  const userLinks = [
    { href: `/users`, label: "Dashboard", icon: "dashboard" },
    { href: `/users/correspondencia`, label: "Crear correspondencia", icon: "addDocument" },
    { href: `/users/seguimiento`, label: "Seguimiento", icon: "searchDocument" },
    { href: `/users/registrar`, label: "Registrar Afiliado", icon:"addUser"},
    { href: `/users/listaAfiliados`, label: "Afiliados", icon:"users"},
    { href: `/users/informes`, label: "Informes", icon: "report"}
  ]

  const links = user.role === 1 ? adminLinks : userLinks

  return (
    <div className={`${styles.navContainer} ${collapsed ? styles.collapsed : ""}`}>
      <nav className={styles.nav}>
        <section className={styles.adminLinks}>
          {!collapsed && <p>{user.role === 1 ? "General (Admin)" : "General (Usuario)"}</p>}
          <ul className={styles.linkContainer}>
            {links.map(link => (
              <li key={link.href} className={styles.linkItem}>
                <Icons name={link.icon} fill/>
                {!collapsed && <Link href={link.href}>{link.label}</Link>}
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.settings}>
          {!collapsed && <p>Administra tu Perfil</p>}
          <ul className={styles.linkContainer}>
            <li className={styles.linkItem}>
              <Icons name="profile" fill/>
              {!collapsed && <Link href={`${basePath}/profile`}>Profile</Link>}
            </li>
            <li className={styles.linkItem} onClick={logout}>
              <Icons name="logout" fill/>
              {!collapsed && "Log Out"}
            </li>
          </ul>
        </section>
      </nav>
    </div>
  )
}
