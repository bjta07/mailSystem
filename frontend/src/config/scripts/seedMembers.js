import { authApi } from "../api/apiAuth.js"

// Si tu authApi usa login con email/password
const login = async (username, password) => {
    const response = await fetch(`http://localhost:4000/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    })

    if (!response.ok) {
        throw new Error("Error en login")
    }

    const data = await response.json()
    return data.token // <- asumo que devuelves { token: "JWT..." }
}

// Función para generar nombres y CI random
const randomName = () => {
    const nombres = ["Ana", "Luis", "María", "Carlos", "Jorge", "Valeria", "Sofía", "Andrés"]
    const apellidos = ["Pérez", "Gutiérrez", "López", "Fernández", "Mamani", "Quispe", "Rojas", "Flores"]

    const nombre = nombres[Math.floor(Math.random() * nombres.length)]
    const apellido = apellidos[Math.floor(Math.random() * apellidos.length)]
    const ci = Math.floor(1000000 + Math.random() * 9000000).toString()

    return { nombre, apellido, ci }
}

const randomColegioId = () => Math.floor(Math.random() * 12) + 1

const seedMembers = async () => {
    try {
        // 1. Login
        const token = await login("jotape", "123456789")

        // 2. Crear afiliados
        for (let i = 0; i < 100; i++) {
            const { nombre, apellido, ci } = randomName()
            const colegio_id = randomColegioId()

            const memberData = {
                ci,
                nombres: nombre,
                apellidos: apellido,
                colegio_id
            }

            console.log(`📌 Inyectando afiliado:`, memberData)

            await fetch(`http://localhost:4000/api/afiliados`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(memberData)
            })
        }

        console.log("✅ Inyección de afiliados completada")
    } catch (error) {
        console.error("❌ Error en seed:", error.message)
    }
}

seedMembers()
