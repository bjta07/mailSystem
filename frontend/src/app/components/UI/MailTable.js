'use client'
import { useEffect, useState, useMemo } from 'react'
import { mailApi } from '@/config/api/apiAuth'
import { useAuth } from '@/config/contexts/AuthContext'
import styles from '@/styles/MailTable.module.css'
import MailModal from './MailModal'
import Icon from './Icons'

export default function MailTable() {
    const [correspondences, setCorrespondences] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [selectedMail, setSelectedMail] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [searchFilters, setSearchFilters] = useState({
        hojaRuta: '',
        fechaCarta: ''
    })
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
            await mailApi.updateMail(mailId, { estado: newStatus })
            
            // Actualizar el estado en la lista
            setCorrespondences(correspondences.map(mail => 
                mail.id === mailId ? { ...mail, estado: newStatus, estado_id: newStatus } : mail
            ))
        } catch (err) {
            setError('Error al actualizar el estado: ' + err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleSearchChange = (field, value) => {
        setSearchFilters(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const clearSearch = () => {
        setSearchFilters({
            hojaRuta: '',
            fechaCarta: ''
        })
    }

    // Filtrar y ordenar correspondencias
    const filteredAndSortedCorrespondences = useMemo(() => {
        if (!Array.isArray(correspondences)) return []

        let filtered = correspondences
            // Filtrar los estados finalizados (estado_id = 4)
            .filter(mail => mail.estado_id !== 4)

        // Aplicar filtros de búsqueda
        if (searchFilters.hojaRuta.trim() !== '') {
            const searchNumber = searchFilters.hojaRuta.trim()
            filtered = filtered.filter(mail => {
                if (!mail.hoja_ruta) return false
                // Extraer solo el número de la hoja de ruta (ej: de "HR-2024-001" extraer "001")
                const hojaRutaParts = mail.hoja_ruta.split('-')
                const numero = hojaRutaParts[hojaRutaParts.length - 1] || ''
                return numero.includes(searchNumber)
            })
        }

        if (searchFilters.fechaCarta.trim() !== '') {
            filtered = filtered.filter(mail => {
                if (!mail.fecha_carta) return false
                const fechaCarta = new Date(mail.fecha_carta).toISOString().split('T')[0]
                return fechaCarta === searchFilters.fechaCarta
            })
        }

        // Ordenar por fecha de recepción (más recientes primero)
        return filtered.sort((a, b) => {
            const fechaA = new Date(a.fecha_recepcion)
            const fechaB = new Date(b.fecha_recepcion)
            return fechaB - fechaA // Orden descendente (más reciente primero)
        })
    }, [correspondences, searchFilters])

    const handleDelete = async (mailId) => {
    try {
        setLoading(true)
        await mailApi.deleteMail(mailId)
        
        // Eliminar la correspondencia de la lista
        setCorrespondences(correspondences.filter(mail => mail.id !== mailId))
        
        setIsModalOpen(false)
        setSelectedMail(null)
    } catch (err) {
        setError('Error al eliminar la correspondencia: ' + err.message)
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

    useEffect(() => {
  console.log("🔎 currentUser en MailTable:", currentUser)
}, [currentUser])

    if (loading) {
        return (
        <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <p>Cargando correspondencias...</p>
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
            {/* Barra de búsqueda */}
            <div className={styles.searchContainer}>
                <div className={styles.searchGroup}>
                    <label className={styles.searchLabel}>
                        Buscar por N° Hoja de Ruta:
                        <input 
                            type="text" 
                            placeholder="Ej: 001, 025, 150..."
                            value={searchFilters.hojaRuta}
                            onChange={(e) => handleSearchChange('hojaRuta', e.target.value)}
                            className={styles.searchInput}
                        />
                    </label>
                    
                    <label className={styles.searchLabel}>
                        Buscar por Fecha de Carta:
                        <input 
                            type="date" 
                            value={searchFilters.fechaCarta}
                            onChange={(e) => handleSearchChange('fechaCarta', e.target.value)}
                            className={styles.searchInput}
                        />
                    </label>
                    
                    <button 
                        onClick={clearSearch}
                        className={styles.clearButton}
                    >
                        <Icon name="erase" fill/>
                        Limpiar Filtros
                    </button>
                </div>
                
                <div className={styles.resultsInfo}>
                    Mostrando {filteredAndSortedCorrespondences.length} de {correspondences.filter(mail => mail.estado_id !== 4).length} correspondencias
                </div>
            </div>

            <table className={styles.table}>
                <thead className={styles.tableHeader}>
                    <tr>
                        <th>Hoja de Ruta</th>
                        <th>CITE</th>
                        <th>Referencia</th>
                        <th>Fecha Recepción ↓</th>
                        <th>Recepcionado por</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody className={styles.tableBody}>
                    {filteredAndSortedCorrespondences.length > 0 ? (
                        filteredAndSortedCorrespondences.map(mail => (
                            <tr key={mail.id} className={styles.tableRow}>
                                <td>{mail.hoja_ruta}</td>
                                <td>{mail.cite || '-'}</td>
                                <td>{mail.referencia}</td>
                                <td>{new Date(mail.fecha_recepcion).toLocaleDateString('es-ES')}</td>
                                <td>{mail.recepcionado_por_nombre}</td>
                                <td className={styles.centered}>
                                    <span id='estado' className={`${styles.statusBadge} ${styles[`status${mail.estado_id}`]}`}>
                                        {mail.estado}</span>
                                </td>
                                <td className={styles.centered}>
                                    {(currentUser.role === 1 || mail.recepcionado_por_id === currentUser?.uid)&& (
                                        <button 
                                            onClick={() => handleEditClick(mail)}
                                            className={styles.editButton}
                                        >
                                            <Icon name="edit" fill/>
                                            Editar
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" className={styles.noData}>
                                {searchFilters.hojaRuta || searchFilters.fechaCarta ? 
                                    'No se encontraron resultados con los filtros aplicados' : 
                                    'No hay correspondencia para mostrar'
                                }
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
                    userRole={currentUser?.role} // Pasamos el rol del usuario actual
                    onDelete={handleDelete} // También necesitamos pasar la función de eliminación
                />
            )}
        </div>
    )
}