import { useState, useEffect } from "react"
import styles from '@/styles/UserModal.module.css'
import Icon from "./Icons"

export default function UserModal({ user, isOpen, onClose, onSave, onDelete }) {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    ci: "",
    role: "",
    isActive: false
  })

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        username: user.username || "",
        email: user.email || "",
        phone: user.phone || "",
        ci: user.ci || "",
        role: user.role || "",
        isActive: user.isActive || false
      })
    }
  }, [user])

  if (!isOpen) return null

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>Editar Usuario</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.label}>
            Nombre:
            <input className={styles.input} type="text" name="name" value={formData.name} onChange={handleChange} />
          </label>
          <label className={styles.label}>
            Usuario:
            <input className={styles.input} type="text" name="username" value={formData.username} onChange={handleChange} />
          </label>
          <label className={styles.label}>
            Email:
            <input className={styles.input} type="email" name="email" value={formData.email} onChange={handleChange} />
          </label>
          <label className={styles.label}>
            Teléfono:
            <input className={styles.input} type="text" name="phone" value={formData.phone} onChange={handleChange} />
          </label>
          <label className={styles.label}>
            CI:
            <input className={styles.input} type="text" name="ci" value={formData.ci} onChange={handleChange} />
          </label>
          <label className={styles.label}>
            Rol:
            <select name="role" value={formData.role} onChange={handleChange} className={styles.select}>
              <option value="">Seleccionar...</option>
              <option value="admin">Admin</option>
              <option value="user">Usuario</option>
            </select>
          </label>
          <label className={styles.label && styles.checkbox}>
            <input className={styles.input}
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
            />
            Activo
          </label>
          <div className={styles.actions}>
            <button type="submit" className={styles.saveBtn}><Icon name="save" fill/> Guardar</button>
            <button type="button" className={styles.deleteBtn} onClick={() => onDelete(user.uid)}>
              <Icon name="delete" fill/>
              Eliminar
            </button>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              <Icon name="cancel" fill/>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
