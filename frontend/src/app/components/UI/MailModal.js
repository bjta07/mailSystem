import { useState, useEffect } from "react";
import styles from '@/styles/MailModal.module.css';

export default function MailModal({ 
    mail, 
    isOpen, 
    onClose, 
    onSave, 
    onChangeStatus,
    onDelete,     // 👈 nuevo handler para eliminar
    userRole      // 👈 recibimos el rol (ej. 1 = admin, 0 = user)
}) {
    const [isInterna, setIsInterna] = useState(false)
    const initialFormState = {
        hoja_ruta: "",
        referencia: "",
        procedencia_id: "",
        procedencia_nombre: "",
        remitente: "",
        cargo_remitente: "",
        fecha_recepcion: "",
        cite: "",
        estado: 1,
        username: ""
    }
    
    const [formData, setFormData] = useState(initialFormState)

    useEffect(() => {
        if (mail) {
            const isInternaProc = Boolean(mail.procedencia_id && mail.procedencia_id > 1);
            // Asegurarnos de que todos los valores sean strings vacíos o números válidos
            // Para debugging
            console.log('Mail recibido:', mail);
            
            setFormData({
                hoja_ruta: mail.hoja_ruta ?? "",
                referencia: mail.referencia ?? "",
                procedencia_id: mail.procedencia_id ? mail.procedencia_id.toString() : "1",
                // Usar siempre el nombre de procedencia que viene de la BD
                procedencia_nombre: mail.procedencia ?? "Externa",
                remitente: mail.remitente ?? "",
                cargo_remitente: mail.cargo_remitente ?? "",
                fecha_recepcion: mail.fecha_recepcion ?? "",
                cite: mail.cite ?? "",
                estado: typeof mail.estado_id === 'number' ? mail.estado_id : 1,
                username: mail.recepcionado_por_nombre ?? ""
            })

            // si el mail tiene procedencia interna, marcamos el estado
            setIsInterna(isInternaProc)
        } else {
            // Si no hay mail, establecer valores por defecto
            setFormData({
                hoja_ruta: "",
                referencia: "",
                procedencia_id: "1",
                procedencia_nombre: "Externa",
                remitente: "",
                cargo_remitente: "",
                fecha_recepcion: "",
                cite: "",
                estado: 1,
                username: ""
            })
            setIsInterna(false)
        }
    }, [mail])

    // Este useEffect era para UserModal, no para MailModal

    if (!isOpen) return null

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        if (name === 'estado') {
            setFormData({ ...formData, [name]: parseInt(value, 10) })
        } else {
            setFormData({ ...formData, [name]: type === "checkbox" ? checked : value })
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        
        // Para debugging
        console.log('FormData antes de guardar:', formData);
        
        const dataToSave = {
            ...mail,
            ...formData,
            procedencia_id: parseInt(formData.procedencia_id),
            procedencia: formData.procedencia_nombre, // Asegurarnos de enviar el nombre de la procedencia
            hoja_ruta: mail.hoja_ruta,
            estado_id: parseInt(formData.estado, 10),
            fecha_carta: formData.fecha_carta || mail.fecha_carta,
        }
        
        // Para debugging
        console.log('Data a guardar:', dataToSave);
        
        if (formData.estado !== mail.estado) {
            onChangeStatus && onChangeStatus(formData.estado)
        }
        
        onSave(dataToSave)
    }

    const handleDelete = () => {
        if (confirm("¿Seguro que quieres eliminar esta correspondencia?")) {
            onDelete && onDelete(mail.id)
        }
    }

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <h2>Correspondencia: {formData.hoja_ruta}</h2>
                <p className={styles.userInfo}>Registrado por: {formData.username}</p>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <label className={styles.label}>
                        Referencia:
                        <input 
                            className={styles.input} 
                            type="text" 
                            name="referencia" 
                            value={formData.referencia} 
                            onChange={handleChange} 
                        />
                    </label>

                    <label className={styles.label}>
                        Procedencia:
                        {userRole === 1 ? (
                            // 👇 Admin: radios + select
                            <div>
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
                                                procedencia_id: "1", // Externa = 1
                                                procedencia_nombre: "Externa"
                                            }))
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
                                        onChange={() => {
                                            setIsInterna(true);
                                            // No establecemos procedencia_id aquí para que el usuario seleccione del select
                                            setFormData(prev => ({
                                                ...prev,
                                                procedencia_id: ""
                                            }))
                                        }}
                                    />
                                    Interna
                                </label>

                                {isInterna && (
                                    <select
                                        id="procedencia_id"
                                        name="procedencia_id"
                                        value={formData.procedencia_id}
                                        onChange={(e) => {
                                            const selectedOption = e.target.options[e.target.selectedIndex];
                                            setFormData(prev => ({
                                                ...prev,
                                                procedencia_id: e.target.value,
                                                procedencia_nombre: selectedOption.text
                                            }));
                                        }}
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
                            </div>
                        ) : (
                            // 👇 User: solo lectura
                            <input 
                                className={styles.input} 
                                type="text" 
                                name="procedencia_nombre" 
                                value={formData.procedencia_nombre} 
                                readOnly
                            />
                        )}
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
                        <input className={styles.input} type="text" name="fecha_recepcion" value={formData.fecha_recepcion} onChange={handleChange} />
                    </label>
                    <label className={styles.label}>
                        CITE:
                        <input className={styles.input} type="text" name="cite" value={formData.cite} onChange={handleChange} />
                    </label>
                    <label className={styles.label}>
                        Estado:
                        <select id="estado" name="estado" value={formData.estado} onChange={handleChange} className={styles.select}>
                            <option value={1}>Recepcionado</option>
                            <option value={2}>En Proceso</option>
                            <option value={3}>Respondido</option>
                            <option value={4}>Finalizado</option>
                        </select>
                    </label>

                    <div className={styles.actions}>
                        <button type="submit" className={styles.saveBtn}>Guardar</button>
                        {userRole === 1 && (
                            <button type="button" className={styles.deleteBtn} onClick={handleDelete}>
                                Eliminar
                            </button>
                        )}
                        <button type="button" className={styles.cancelBtn} onClick={onClose}>
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
