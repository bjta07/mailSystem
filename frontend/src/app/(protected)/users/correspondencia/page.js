'use client'
import { useState, useEffect } from "react"
import { mailApi } from "@/config/api/apiAuth"
import styles from "@/styles/Correspondencia.module.css"

export default function Correspondencia() {
    const [formData, setFormData] = useState({
        hoja_ruta: "",
        referencia: "",
        procedencia_id: "1",  // Inicializamos con procedencia externa por defecto
        remitente: "",
        cargo_remitente: "",
        fecha_carta: "",
        cite: ""
    })

    const [isInterna, setIsInterna] = useState(false)
    const [message, setMessage] = useState("")
    const [loading, setLoading] = useState(false)

    // Asegurarnos de que procedencia_id siempre tenga un valor válido
    useEffect(() => {
        if (!isInterna && formData.procedencia_id !== "1") {
            setFormData(prev => ({
                ...prev,
                procedencia_id: "1"
            }));
        }
    }, [isInterna]);

    // Generar automáticamente la hoja de ruta (ejemplo HR-2025-001)
    useEffect(() => {
        const generarHojaRuta = async () => {
            try {
                const response = await mailApi.getAll()
                const año = new Date().getFullYear()
                
                // Filtrar las hojas de ruta del año actual
                const hojasRutaActuales = response.data
                    .map(mail => mail.hoja_ruta)
                    .filter(hr => hr.includes(`HR-${año}`))
                
                // Si no hay hojas de ruta este año, comenzar desde 001
                if (hojasRutaActuales.length === 0) {
                    setFormData(prev => ({
                        ...prev,
                        hoja_ruta: `HR-${año}-001`
                    }))
                    return
                }
                
                // Obtener el último número usado
                const ultimoNumero = Math.max(
                    ...hojasRutaActuales.map(hr => {
                        const num = parseInt(hr.split('-')[2])
                        return isNaN(num) ? 0 : num
                    })
                )
                
                // Generar el siguiente número
                const siguienteNumero = ultimoNumero + 1
                
                setFormData(prev => ({
                    ...prev,
                    hoja_ruta: `HR-${año}-${String(siguienteNumero).padStart(3, '0')}`
                }))
            } catch (error) {
                console.error("Error generando hoja de ruta:", error)
            }
        }
        generarHojaRuta()
    }, [])

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
            // Formatear fecha a yyyy-mm-dd
            const fecha = new Date(formData.fecha_carta)
            const fechaFormateada = fecha.toISOString().split("T")[0]

            // Asegurarnos de que procedencia_id es un string válido
            if (!formData.procedencia_id) {
                setMessage("⚠️ Debe seleccionar una procedencia")
                return
            }

            const mailData = {
                ...formData,
                fecha_carta: fechaFormateada,
                procedencia_id: formData.procedencia_id.toString() // Aseguramos que sea string
            }

            const response = await mailApi.registerMail(mailData)

            if (response.ok) {
                setMessage("✅ Correspondencia creada con éxito")
                setFormData({
                    hoja_ruta: "",
                    referencia: "",
                    procedencia_id: "",
                    remitente: "",
                    cargo_remitente: "",
                    fecha_carta: "",
                    cite: ""
                })
            } else {
                setMessage("❌ No se pudo crear la correspondencia")
            }
        } catch (error) {
            setMessage("⚠️ Error en la conexión con el servidor")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <h2 className={styles.title}>📄 Crear Correspondencia</h2>

                <div className={styles.row}>
                    <input 
                        type="text" 
                        id="hoja_ruta" 
                        value={formData.hoja_ruta}
                        readOnly
                        className={styles.input}
                    />
                    <input 
                        type="text" 
                        id="cite" 
                        value={formData.cite}
                        onChange={handleChange}
                        placeholder="CITE"
                        className={styles.input}
                    />
                </div>

                <div className={styles.row}>
                    <label>Fecha de emisión</label>
                    <input 
                        type="date" 
                        id="fecha_carta"
                        value={formData.fecha_carta}
                        onChange={handleChange}
                        className={styles.input}
                    />
                    <input 
                        type="text" 
                        id="referencia"
                        value={formData.referencia}
                        onChange={handleChange}
                        placeholder="Referencia"
                        className={styles.input}
                    />
                </div>

                <section className={styles.procedencia}>
                    <legend>Procedencia</legend>
                    <label>
                        <input 
                            type="radio" 
                            name="procedencia" 
                            value="externa"
                            checked={!isInterna}
                            onChange={() => {
                                setIsInterna(false);
                                setFormData(prev => ({
                                    ...prev,
                                    procedencia_id: "1"  // ID 1 es para Externa
                                }));
                            }}
                        />
                        Externa
                    </label>
                    <label>
                        <input 
                            type="radio" 
                            name="procedencia" 
                            value="interna"
                            checked={isInterna}
                            onChange={() => setIsInterna(true)}
                        />
                        Interna
                    </label>

                    {isInterna && (
                        <select 
                            id="procedencia_id"
                            value={formData.procedencia_id}
                            onChange={handleChange}
                            className={styles.select}
                            required
                        >
                            <option value="">Seleccione...</option>
                            <optgroup label="Departamentales">
                                <option value="2">Colegio departamental de Santa Cruz</option>
                                <option value="3">Colegio departamental de La Paz</option>
                                <option value="4">Colegio departamental de Cochabamba</option>
                                <option value="5">Colegio departamental de Oruro</option>
                                <option value="6">Colegio departamental de Potosí</option>
                                <option value="7">Colegio departamental de Tarija</option>
                                <option value="8">Colegio departamental de Sucre</option>
                                <option value="9">Colegio departamental de Pando</option>
                            </optgroup>
                            <optgroup label="Regionales">
                                <option value="10">Colegio regional de El Alto</option>
                                <option value="11">Colegio regional de Tupiza</option>
                                <option value="12">Colegio regional de Camiri</option>
                                <option value="13">Colegio regional de Catavi</option>
                            </optgroup>
                        </select>
                    )}
                </section>

                <div className={styles.row}>
                    <input 
                        type="text" 
                        id="remitente"
                        value={formData.remitente}
                        onChange={handleChange}
                        placeholder="Remitente"
                        className={styles.input}
                    />
                    <input 
                        type="text" 
                        id="cargo_remitente"
                        value={formData.cargo_remitente}
                        onChange={handleChange}
                        placeholder="Cargo de Remitente"
                        className={styles.input}
                    />
                </div>

                <button type="submit" className={styles.button} disabled={loading}>
                    {loading ? "Registrando..." : "Registrar"}
                </button>

                {message && <p className={styles.message}>{message}</p>}
            </form>
        </div>
    )
}
