'use client'
import { useState } from "react"
import { aportesApi } from "@/config/api/apiAuth"
import styles from "@/styles/RegistrarAporteModal.module.css"

export default function RegistrarAporteModal({ member, isOpen, onClose, onSave }) {
    const [monto, setMonto] = useState("")
    const [mes, setMes] = useState("")

    if (!isOpen || !member) return null

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const aporteData = {
                afiliado_id: member.id,
                anio: new Date().getFullYear(),
                mes: parseInt(mes),
                monto: parseFloat(monto),
            }
            const response = await aportesApi.createAporte(aporteData)
            onSave(response.data)
            onClose()
        } catch (err) {
            console.error("Error al registrar aporte:", err)
            alert("Error al registrar aporte")
        }
    }

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h2>Registrar Aporte</h2>
                <p><b>Afiliado:</b> {member.nombres} {member.apellidos}</p>
                <p><b>CI:</b> {member.ci}</p>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <label>
                        Mes:
                        <select value={mes} onChange={(e) => setMes(e.target.value)} required>
                            <option value="">Seleccione...</option>
                            <option value="1">Enero</option>
                            <option value="2">Febrero</option>
                            <option value="3">Marzo</option>
                            <option value="4">Abril</option>
                            <option value="5">Mayo</option>
                            <option value="6">Junio</option>
                            <option value="7">Julio</option>
                            <option value="8">Agosto</option>
                            <option value="9">Septiembre</option>
                            <option value="10">Octubre</option>
                            <option value="11">Noviembre</option>
                            <option value="12">Diciembre</option>
                        </select>
                    </label>
                    <label>
                        Monto:
                        <input
                            type="number"
                            step="0.01"
                            value={monto}
                            onChange={(e) => setMonto(e.target.value)}
                            required
                        />
                    </label>
                    <div className={styles.modalActions}>
                        <button type="submit" className={styles.saveButton}>Guardar</button>
                        <button type="button" onClick={onClose} className={styles.cancelButton}>Cancelar</button>
                    </div>
                </form>
            </div>
        </div>
    )
}
