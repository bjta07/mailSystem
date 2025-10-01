'use client'
import { useEffect, useState, useMemo } from "react"
import { aportesApi, memberApi } from "@/config/api/apiAuth"
import { useAuth } from "@/config/contexts/AuthContext"
import styles from '@/styles/Aportes.module.css'
import Icon from "@/app/components/UI/Icons"

export default function Aportes() {
  const [members, setMembers] = useState([])
  const [aportaciones, setAportaciones] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchFilters, setSearchFilters] = useState({ ci: "", colegio_id: "" })
  const [selectedYear, setSelectedYear] = useState(null)
  const [availableYears, setAvailableYears] = useState([])
  const { user: currentUser } = useAuth()

  const meses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ]

  const colegios = {
    "1": "Colegio departamental de Santa Cruz",
    "2": "Colegio departamental de La Paz",
    "3": "Colegio departamental de Cochabamba",
    "4": "Colegio departamental de Oruro",
    "5": "Colegio departamental de Potosí",
    "6": "Colegio departamental de Tarija",
    "7": "Colegio departamental de Sucre",
    "8": "Colegio departamental de Pando",
    "9": "Colegio regional de El Alto",
    "10": "Colegio regional de Tupiza",
    "11": "Colegio regional de Camiri",
    "12": "Colegio regional de Catavi"
  }

  const [editedAportes, setEditedAportes] = useState({})

  const filteredAndSortedMembers = useMemo(() => {
    if (!Array.isArray(members)) return []
    let filtered = members.filter(member => member.ci)
    if (searchFilters.ci.trim() !== "") {
      filtered = filtered.filter(member => member.ci === searchFilters.ci)
    }
    if (searchFilters.colegio_id.trim() !== "") {
      filtered = filtered.filter(member => String(member.colegio_id) === searchFilters.colegio_id)
    }
    return filtered.sort((a, b) => a.apellidos.localeCompare(b.apellidos))
  }, [members, searchFilters])

  const handleSearchChange = (field, value) => {
    setSearchFilters(prev => ({ ...prev, [field]: value }))
  }

  const clearSearch = () => {
    setSearchFilters({ ci: "", colegio_id: "" })
    setSelectedYear(null)
  }

  // Cargar miembros
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await memberApi.getAllMembers()
        if (response && Array.isArray(response.data)) {
          setMembers(response.data)
        } else {
          throw new Error("Formato de respuesta inválido")
        }
      } catch (error) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }
    if (currentUser) fetchMembers()
  }, [currentUser])

  // Cargar años disponibles
  useEffect(() => {
    const fetchYears = async () => {
      try {
        const response = await aportesApi.getYearsAndAportes()
        if (response?.data?.years) {
          setAvailableYears(response.data.years)
        }
      } catch (err) {
        console.error("Error al obtener años disponibles:", err)
      }
    }
    fetchYears()
  }, [])

  // Cargar aportes filtrados por año y miembro
  useEffect(() => {
  const fetchAportesForYear = async () => {
    if (!selectedYear) {
      setAportaciones({});
      return;
    }

    try {
      // **ESTA LÍNEA ES CRÍTICA:** Accede a .data.aportes.data
      const response = await aportesApi.getYearsAndAportes(selectedYear);
      const allAportesForSelectedYear = response?.data?.aportes?.data || [];

      // 2. Procesar y agrupar los aportes por ID de miembro
      const aportesPorMiembro = {};
      
      // Inicializar todos los miembros con un array vacío de aportes
      for (const member of members) {
        aportesPorMiembro[member.id] = [];
      }

      // Asignar los aportes a sus respectivos miembros
      for (const aporte of allAportesForSelectedYear) {
        if (aportesPorMiembro[aporte.afiliado_id]) {
          aportesPorMiembro[aporte.afiliado_id].push(aporte);
        }
      }
      console.log("Aportes recibidos del API:", allAportesForSelectedYear);
console.log("Miembros cargados:", members.map(m => m.id));

      setAportaciones(aportesPorMiembro);
    } catch (error) {
      console.error("Error al obtener aportes por año:", error);
    }
  };

  if (members.length > 0) fetchAportesForYear();
}, [members, selectedYear]);

  const handleEditAporte = (aporteId, memberId, mes, value) => {
    setEditedAportes(prev => ({
      ...prev,
      [aporteId]: { memberId, mes, monto: value === "" ? "" : parseFloat(value) }
    }))
  }

  const handleSaveChanges = async () => {
    try {
      for (const [aporteId, data] of Object.entries(editedAportes)) {
        if (data.monto !== "" && !isNaN(data.monto)) {
          await aportesApi.updateAporte(aporteId, { monto: data.monto })
        }
      }
      alert("Cambios guardados correctamente ✅")
      setEditedAportes({})
    } catch (err) {
      console.error("Error al guardar cambios:", err)
      alert("Hubo un error al guardar los cambios ❌")
    }
  }

  if (loading) return <p>Cargando aportes...</p>
  if (error) return <p>Error: {error}</p>

  return (
    <div className={styles.container}>
      <h2>Aportes</h2>

      <div className={styles.searchContainer}>
        <div className={styles.searchGroup}>
          <label className={styles.searchLabel}>
            CI:
            <input
              id="ci"
              className={styles.searchInput}
              name="ci"
              type="text"
              placeholder="Carnet de Identidad"
              value={searchFilters.ci}
              onChange={(e) => handleSearchChange("ci", e.target.value)}
            />
          </label>

          <label className={styles.searchLabel}>
            Colegio:
            <select
              className={styles.select}
              id="colegio_id"
              value={searchFilters.colegio_id}
              onChange={(e) => handleSearchChange("colegio_id", e.target.value)}
            >
              <option value="">Seleccione...</option>
              {Object.entries(colegios).map(([id, nombre]) => (
                <option key={id} value={id}>{nombre}</option>
              ))}
            </select>
          </label>

          <label className={styles.searchLabel}>
            Año:
            <select
              className={styles.select}
              value={selectedYear || ""}
              onChange={(e) => setSelectedYear(e.target.value ? parseInt(e.target.value) : null)}
            >
              <option value="">Todos</option>
              {availableYears.map(anio => (
              <option key={anio} value={anio}>{anio}</option>
              ))}
            </select>
          </label>
        </div>

        <button className={styles.clearButton} onClick={clearSearch}>
          <Icon name="erase" fill /> Limpiar filtros
        </button>
      </div>

      <div className={styles.gridArea}>
        {searchFilters.colegio_id && (
          <div className={styles.titleRow}>
            <h1>Aportes del colegio: {colegios[searchFilters.colegio_id]}</h1>
          </div>
        )}
        {currentUser?.role === 1 && (
          <button onClick={handleSaveChanges} className={styles.saveButton}>
            <Icon name="save" fill /> Guardar cambios
          </button>
        )}
      </div>

      {/* Tabla de aportes (igual que antes) */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead className={styles.tableHeader}>
            <tr>
              <th className={styles.sticky}>Nombre</th>
              <th className={styles.stickySecond}>Apellido</th>
              <th className={styles.stickyThird}>CI</th>
              {meses.map(mes => <th key={mes}>{mes}</th>)}
              <th>TOTAL</th>
            </tr>
          </thead>
          <tbody className={styles.tableBody}>
            {filteredAndSortedMembers.length > 0 ? (
              filteredAndSortedMembers.map(member => {
                const aportes = aportaciones[member.id] || []
                const aportesPorMes = {}
                aportes.forEach(aporte => {
                  aportesPorMes[aporte.mes] = { id: aporte.id, monto: parseFloat(aporte.monto) }
                })
                const total = Object.values(aportesPorMes).reduce((acc, val) => acc + val.monto, 0)

                return (
                  <tr key={member.id} className={styles.tableRow}>
                    <td className={styles.tableContent}>{member.nombres}</td>
                    <td className={styles.tableContent}>{member.apellidos}</td>
                    <td className={styles.tableContent}>{member.ci}</td>
                    {meses.map((_, idx) => {
                      const aporte = aportesPorMes[idx + 1]
                      if (aporte) {
                        return (
                          <td key={idx} className={styles.tableContent}>
                            {currentUser?.role === 1 ? (
                              <input
                                id={aporte.id}
                                type="number"
                                className={styles.inputValue}
                                value={editedAportes[aporte.id]?.monto ?? aporte.monto.toFixed(2)}
                                onChange={(e) => handleEditAporte(aporte.id, member.id, idx + 1, e.target.value)}
                              />
                            ) : (
                              aporte.monto.toFixed(2)
                            )}
                          </td>
                        )
                      } else {
                        return <td key={idx}>-</td>
                      }
                    })}
                    <td className={styles.totalCell}>{total.toFixed(2)}</td>
                  </tr>
                )
              })
            ) : (
              <tr>
                <td colSpan={16}>
                  {searchFilters.ci || searchFilters.colegio_id
                    ? "No se encontraron resultados con los filtros aplicados"
                    : "No hay aportes para mostrar"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
