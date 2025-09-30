import { useState, useEffect } from "react";
import styles from '@/styles/MemberModal.module.css'
import Icon from "./Icons";

export default function MemberModal({
    member,
    isOpen,
    onClose,
    onSave,
    onDelete,
    userRole
}){
    const initialFormState = {
        nombres:"",
        apellidos:"",
        ci:"",
        colegio_id:"",
    }

    const [formData, setFormData] = useState(initialFormState)

    useEffect(() => {
    if (member) {
        setFormData({
            nombres: member.nombres ?? "",
            apellidos: member.apellidos ?? "",
            ci: member.ci ?? "",
            colegio_id: member.colegio_id ? String(member.colegio_id) : "",
        })
    } else {
        setFormData(initialFormState)
    }
}, [member])

    if (!isOpen) return null

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log("Antes de guardar: ",formData)

        const dataToSave = {
            ...member,
            ...formData,
            nombres: formData.nombres,
            apellidos: formData.apellidos,
            ci: formData.ci,
            colegio_id: formData.colegio_id
            ? parseInt(formData.colegio_id, 10)
            : null,
        }
        console.log('data a guardar: ', dataToSave)
        if(dataToSave) onSave(dataToSave)
    }
    const handleDelete = () => {
        if (confirm("Seguro que quiere eliminar a este afiliado?")) {
            onDelete && onDelete(member.id)
        }
    }

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <h2>Afiliado: {formData.ci}</h2>
            
            <form onSubmit={handleSubmit} className={styles.form}>
                <label className={styles.label}>Nombres: 
                <input
                    type="text"
                    name="nombres"
                    value={formData.nombres}
                    onChange={handleChange}
                    className={styles.input} 
                /></label>
                <label className={styles.label}>Apellidos
                    <input
                        type="text"
                        name="apellidos"
                        value={formData.apellidos}
                        onChange={handleChange}
                        className={styles.input} 
                    />
                </label>
                <label className={styles.label}>CI
                    <input
                        type="text"
                        name="ci"
                        value={formData.ci}
                        onChange={handleChange}
                        className={styles.input} 
                    />
                </label>
                <div>
                    <label className={styles.label}>Colegio: 
                        <select
                                id="colegio_id"
                                name="colegio_id"
                                value={formData.colegio_id}
                                onChange={handleChange}
                                className={styles.select}
                            >
                                <option value="">Seleccione...</option>
                                <optgroup label="Colegios Departamentales">
                                    <option value="1">Colegio departamental de Santa Cruz</option>
                                    <option value="2">Colegio departamental de La Paz</option>
                                    <option value="3">Colegio departamental de Cochabamba</option>
                                    <option value="4">Colegio departamental de Oruro</option>
                                    <option value="5">Colegio departamental de Potosí</option>
                                    <option value="6">Colegio departamental de Tarija</option>
                                    <option value="7">Colegio departamental de Sucre</option>
                                    <option value="8">Colegio departamental de Pando</option>
                                </optgroup>
                                <optgroup label="Colegios Regionales">
                                    <option value="9">Colegio regional de El Alto</option>
                                    <option value="10">Colegio regional de Tupiza</option>
                                    <option value="11">Colegio regional de Camiri</option>
                                    <option value="12">Colegio regional de Catavi</option>
                                </optgroup>
                            </select>
                    </label>
                    <div className={styles.actions}>
                        <button type="submit" className={styles.saveBtn}><Icon name="save" fill/> Guardar</button>
                        {userRole === 1 && (
                            <button type="button" onClick={handleDelete} className={styles.deleteBtn}>
                                <Icon name="delete" fill/>
                                Eliminar
                            </button>
                        )}
                        <button type="button" className={styles.cancelBtn} onClick={onClose}>
                            <Icon name="cancel" fill/>
                            Cancelar
                        </button>
                    </div>
                </div>
            </form>
            </div>
        </div>
    )
}