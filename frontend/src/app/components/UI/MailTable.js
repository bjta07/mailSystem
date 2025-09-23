'use client'
import { useEffect, useState } from 'react'
import { mailApi } from '@/config/api/apiAuth'
import { useAuth } from '@/config/contexts/AuthContext'
import styles from '@/styles/MailTable.module.css'
import MailModal from './MailModal'

export default function MailTable() {
    const [correspondences, setCorrespondences] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [selectedMail, setSelectedMail] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const { user: currentUser } = useAuth()

    const handleEditClick = (mail) => {
        setSelectedMail(mail)
        setIsModalOpen(true)
    }

    const handleSave = async (updatedMailData) => {
        try {
            setLoading(true)
            const response = await mailApi.updateMail(selectedMail.id, updatedMailData)
            
            // Actualizar la lista de correspondencia
            setCorrespondences(correspondences.map(mail => 
                mail.id === selectedMail.id ? { ...mail, ...updatedMailData } : mail
            ))
            
            setIsModalOpen(false)
            setSelectedMail(null)
        } catch (err) {
            setError('Error al actualizar la correspondencia: ' + err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleStatusChange = async (mailId, newStatus) => {
        try {
            setLoading(true)
            await mailApi.updateStatus(mailId, newStatus)
            
            // Actualizar el estado en la lista
            setCorrespondences(correspondences.map(mail => 
                mail.id === mailId ? { ...mail, estado: newStatus } : mail
            ))
        } catch (err) {
            setError('Error al actualizar el estado: ' + err.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const fetchCorrespondences = async () => {
            try {
                const response = await mailApi.getAll()
                
                if (response && Array.isArray(response.data)) {
                    setCorrespondences(response.data)
                } else {
                    throw new Error('Formato de respuesta inválido')
                }
            } catch (err) {
                console.error('Error al obtener correspondencias:', err)
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        // Solo verificamos que el usuario esté autenticado
        if (currentUser) {
            fetchCorrespondences()
        }
    }, [currentUser])

    if (loading) {
        return (
        <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <p>Cargando usuarios...</p>
        </div>
        )
    }

    if (error) {
        return (
        <div className={styles.errorContainer}>
            <span className={styles.errorTitle}>Error:</span>
            <span>{error}</span>
        </div>
        )
    }

    return (
        <div className={styles.tableContainer}>
            <table className={styles.table}>
                <thead className={styles.tableHeader}>
                    <tr>
                        <th>Hoja de Ruta</th>
                        <th>CITE</th>
                        <th>Referencia</th>
                        <th>Fecha Recepción</th>
                        <th>Recepcionado por</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody className={styles.tableBody}>
                    {Array.isArray(correspondences) && correspondences.length > 0 ? (
                        correspondences.map(mail => (
                            <tr key={mail.id} className={styles.tableRow}>
                                <td>{mail.hoja_ruta}</td>
                                <td>{mail.cite || '-'}</td>
                                <td>{mail.referencia}</td>
                                <td>{new Date(mail.fecha_recepcion).toLocaleDateString('es-ES')}</td>
                                <td>{mail.username}</td>
                                <td className={styles.centered}>
                                    <span className={`${styles.statusBadge} ${styles[`status${mail.estado}`]}`}>
                                        {mail.estado === 1 ? 'Recepcionado' :
                                         mail.estado === 2 ? 'En Proceso' :
                                         mail.estado === 3 ? 'Respondido' :
                                         mail.estado === 4 ? 'Finalizado' : 'Desconocido'}
                                    </span>
                                </td>
                                <td className={styles.centered}>
                                    <button 
                                        onClick={() => handleEditClick(mail)}
                                        className={styles.editButton}
                                    >
                                        Editar
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" className={styles.noData}>
                                No hay correspondencia para mostrar
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            {selectedMail && (
                <MailModal 
                    mail={selectedMail}
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false)
                        setSelectedMail(null)
                    }}
                    onSave={handleSave}
                    onChangeStatus={(newStatus) => handleStatusChange(selectedMail.id, newStatus)}
                />
            )}
        </div>
    )
}
