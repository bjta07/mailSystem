'use client'
import { useEffect, useState, useMemo } from "react"
import { memberApi } from "@/config/api/apiAuth"
import { useAuth } from "@/config/contexts/AuthContext"
import MemberModal from "./MemberModal"
import AportesViewModal from "./VerAportesModal"
import RegistrarAporteModal from "./AportesModal"
import styles from "@/styles/MemberTable.module.css"
import Icon from "./Icons"

export default function MemberTable(){
    const [members, setMembers] = useState([])
    const [loading, setLoading] = useState(true)
    const [isRegistrarModalOpen, setIsRegistrarModalOpen] = useState(false)
    const [isVerAportesModalOpen, setIsVerAportesModalOpen] = useState(false)

    const [error, setError] = useState(null)
    const [selectedMember, setSelectedMember] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [searchFilters, setSearchFilters] = useState({
        ci:'',
        colegio_id:''
    })
    const { user: currentUser} = useAuth()
    
    const handleEditClick = (member) => {
        setSelectedMember(member)
        setIsModalOpen(true)
    }

    const handleSave = async(updatedMemberData) => {
        try {
            setLoading(true)
            const response = await memberApi.updateMember(selectedMember.id, updatedMemberData)
            setMembers(members.map(member =>
                member.id === selectedMember.id ? { ...member, ...updatedMemberData} : member
            ))
            setIsModalOpen(false)
            setSelectedMember(null)
        } catch (error) {
            setError('Error al actualizar los datos ' + error.message)
        } finally{
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
            ci: '',
            colegio_id: ''
        })
    }

    const filteredAndSortedMembers = useMemo(() => {
        if (!Array.isArray(members)) return []
        let filtered = members.filter(member => member.ci)
        if (searchFilters.ci.trim() !== '') {
                filtered = filtered.filter(member => {
                if (!member.ci) return false
                return member.ci === searchFilters.ci
            })
        }
        if (searchFilters.colegio_id.trim() !== '') {
            filtered = filtered.filter(member => {
                if (!member.colegio_id) return false
                return String(member.colegio_id) === searchFilters.colegio_id
    })
}

        return filtered.sort((a,b) => a.apellidos.localeCompare(b.apellidos))
    }, [members, searchFilters])

    const handleDelete = async (memberId) => {
        try {
            setLoading(true)
            await memberApi.deleteMember(memberId)
            setMembers(members.filter(member => member.id !== memberId))
            setIsModalOpen(false)
            setSelectedMember(null)
        } catch(err){
            setError('Error al eliminar al afiliado: ' + err.message)
        } finally{
            setLoading(false)
        }
    }

    // ✅ MEJORADO: Handlers para manejar el cierre de modales
    const handleCloseVerAportesModal = () => {
        setIsVerAportesModalOpen(false)
        // No limpiar selectedMember inmediatamente
        setTimeout(() => {
            if (!isRegistrarModalOpen && !isModalOpen) {
                setSelectedMember(null)
            }
        }, 100)
    }

    const handleCloseRegistrarModal = () => {
        setIsRegistrarModalOpen(false)
        setTimeout(() => {
            if (!isVerAportesModalOpen && !isModalOpen) {
                setSelectedMember(null)
            }
        }, 100)
    }

    const handleCloseEditModal = () => {
        setIsModalOpen(false)
        setTimeout(() => {
            if (!isVerAportesModalOpen && !isRegistrarModalOpen) {
                setSelectedMember(null)
            }
        }, 100)
    }

    // ✅ MEJORADO: Handlers para abrir modales con validación
    const handleOpenVerAportes = (member) => {
        console.log('📋 Abriendo modal de aportes para:', member)
        console.log('📋 ID del miembro:', member?.id, typeof member?.id)
        
        if (!member || !member.id) {
            console.error('❌ Error: Miembro o ID inválido')
            setError('Error: Datos del afiliado inválidos')
            return
        }
        
        setSelectedMember(member)
        setIsVerAportesModalOpen(true)
    }

    const handleOpenRegistrarAporte = (member) => {
        console.log('📝 Abriendo modal de registro para:', member)
        
        if (!member || !member.id) {
            console.error('❌ Error: Miembro o ID inválido')
            setError('Error: Datos del afiliado inválidos')
            return
        }
        
        setSelectedMember(member)
        setIsRegistrarModalOpen(true)
    }

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const response = await memberApi.getAllMembers()
                if (response && Array.isArray(response.data)) {
                    setMembers(response.data)
                }else{
                    throw new Error('Formato de respuesta invalido')
                }
            } catch (error) {
                console.error('Error al obtener a los afiliados:',error)
                setError(error.message)
            } finally{
                setLoading(false)
            }
        }

        if (currentUser) {
            fetchMembers()
        }
    }, [currentUser])

    useEffect(() => {
        console.log("🔎 currentUser en MemberTable:", currentUser)
    }, [currentUser])

    if (loading) {
        return(
            <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <p>Cargando Afiliados...</p>
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
            <h2>Lista de Afiliados</h2>
            <div className={styles.searchContainer}>
                <div className={styles.searchGroup}>
                    <label className={styles.searchLabel}>Buscar afiliados por Carnet de Identidad: 
                        <input
                            id="ci"
                            name="ci"
                            type="text"
                            placeholder="Carnet de Identidad"
                            value={searchFilters.ci}
                            onChange={(e) => handleSearchChange("ci", e.target.value)}
                            className={styles.searchInput}
                        />
                    </label>

                    <label className={styles.searchLabel}>Buscar afiliados por Colegio: 
                        <select
                                id="colegio_id"
                                value={searchFilters.colegio_id}
                                onChange={(e) => handleSearchChange("colegio_id", e.target.value)}
                                className={styles.searchInput}
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
                    <button onClick={clearSearch} className={styles.clearButton}>Limpiar filtros</button>
                </div>
                <div className={styles.resultsInfo}>
                    Mostrando {filteredAndSortedMembers.length} de {members.length} afiliados
                </div>
            </div>

            <table className={styles.table}>
                <thead className={styles.tableHeader}>
                    <tr>
                        <th>NOMBRE</th>
                        <th>APELLIDO</th>
                        <th>CI</th>
                        <th>Colegio</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody className={styles.tableBody}>
                    {filteredAndSortedMembers.length > 0 ? (
                        filteredAndSortedMembers.map(member => (
                            <tr key={member.id} className={styles.tableRow}>
                                <td>{member.nombres}</td>
                                <td>{member.apellidos}</td>
                                <td>{member.ci}</td>
                                <td>{member.colegio_nombre}</td>
                                <td className={styles.centered}>
                                    {(currentUser.role === 1) && (
                                        <button
                                            onClick={()=> handleEditClick(member)}
                                            className={styles.editButton}
                                        ><Icon name="edit" fill/> Editar</button>
                                    )}
                                    <div className={styles.actionBtn}>
                                        <button onClick={() => handleOpenRegistrarAporte(member)} className={styles.registerBtn}>
                                            <Icon name="register" fill/>Registrar Aporte
                                        </button>
                                        <button onClick={() => handleOpenVerAportes(member)} className={styles.seeBtn}>
                                            <Icon name="see" fill/>Ver aportes
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ): (
                        <tr>
                            <td className={styles.noData}>
                                {searchFilters.ci || searchFilters.colegio_id ?
                                    'No se encontraron resultados con los filtros aplicados' : 
                                    'No hay correspondencia para mostrar'
                                }
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* ✅ MEJORADO: Renderizar modales independientemente */}
            <MemberModal
                member = {selectedMember}
                isOpen = {isModalOpen}
                onClose={handleCloseEditModal}
                onSave={handleSave}
                userRole={currentUser?.role}
                onDelete={handleDelete}
            />
            
            <RegistrarAporteModal
                member={selectedMember}
                isOpen={isRegistrarModalOpen}
                onClose={handleCloseRegistrarModal}
                onSave={(aporte) => console.log("✅ Aporte guardado:", aporte)}
            />
            
            <AportesViewModal
                member={selectedMember}
                isOpen={isVerAportesModalOpen}
                onClose={handleCloseVerAportesModal}
            />
        </div>
    )
}