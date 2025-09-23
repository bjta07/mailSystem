import { useState, useEffect } from "react";
import styles from './MailModal.module.css';

export default function MailModal({ mail, isOpen, onClose, onSave, onChangeStatus }){
    const [formData, setFormData] = useState({
        hoja_ruta: "",
        referencia: "",
        procedencia_id: "",
        remitente: "",
        cargo_remitente: "",
        fecha_carta: "",
        cite: "",
        estado: "",
        username: ""
    })

    useEffect(() => {
        if (mail) {
            setFormData({
                hoja_ruta: mail.hoja_ruta || "",
                referencia: mail.referencia || "",
                procedencia_id: mail.procedencia_id || "",
                remitente: mail.remitente || "",
                cargo_remitente: mail.cargo_remitente || "",
                fecha_carta: mail.fecha_carta || "",
                cite: mail.cite || "",
                estado: mail.estado || "1",
                username: mail.username || ""
            })
        }
    }, [mail])

    if (!isOpen) return null

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData({ ...formData, [name]: type === "checkbox" ? checked : value })    
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        onSave(formData)
    }

    const handleStatusChange = (e) => {
        const newStatus = e.target.value;
        setFormData({ ...formData, estado: newStatus });
        onChangeStatus && onChangeStatus(newStatus);
    }
    
    return (
        <div className={styles.overlay}>
        <div className={styles.modal}>
            <h2>Correspondencia: {formData.hoja_ruta}</h2>
            <p className={styles.userInfo}>Registrado por: {formData.username}</p>
            <form onSubmit={handleSubmit} className={styles.form}>
            <label className={styles.label}>
                Referencia:
                <input className={styles.input} type="text" name="referencia" value={formData.referencia} onChange={handleChange} />
            </label>
            <label className={styles.label}>
                Procedencia:
                <input className={styles.input} type="text" name="procedencia_id" value={formData.procedencia_id} onChange={handleChange} />
            </label>
            <label className={styles.label}>
                Remitente:
                <input className={styles.input} type="text" name="remitente" value={formData.remitente} onChange={handleChange} />
            </label>
            <label className={styles.label}>
                Cargo del Remitente:
                <input className={styles.input} type="text" name="cargo_remitente" value={formData.cargo_remitente} onChange={handleChange} />
            </label>
            <label className={styles.label}>
                Fecha de Carta:
                <input className={styles.input} type="date" name="fecha_carta" value={formData.fecha_carta} onChange={handleChange} />
            </label>
            <label className={styles.label}>
                CITE:
                <input className={styles.input} type="text" name="cite" value={formData.cite} onChange={handleChange} />
            </label>
            <label className={styles.label}>
                Estado:
                <select name="estado" value={formData.estado} onChange={handleChange} className={styles.select}>
                    <option value="1">Recepcionado</option>
                    <option value="2">En Proceso</option>
                    <option value="3">Respondido</option>
                    <option value="4">Finalizado</option>
                </select>
            </label>
            <div className={styles.actions}>
                <button type="submit" className={styles.saveBtn}>Guardar</button>
                <button type="button" className={styles.cancelBtn} onClick={onClose}>
                Cancelar
                </button>
            </div>
            </form>
        </div>
    </div>
    )
}