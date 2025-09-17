import Link from "next/link"

export default function Navbar(){
    return (
        <div>
            <nav>
                <section>
                    <ul>
                        <li>Crear nuevo usuario</li>
                        <li>Modificar usuarios</li>
                        <li>Lista de Correspondencia</li>
                    </ul>
                </section>
                <section>
                    <ul>
                        <li>Profile</li>
                        <li>Log Out</li>
                    </ul>
                </section>
            </nav>
        </div>
    )
}