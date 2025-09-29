'use client'
import { useEffect, useState } from "react"
import { aportesApi } from "@/config/api/apiAuth"
import styles from "@/styles/AporteModal.module.css"

export default function AportesViewModal({ isOpen, onClose, member }) {
  const [aportaciones, setAportaciones] = useState([])

  useEffect(() => {
    if (isOpen && member) {
      const fetchAportes = async () => {
        try {
          const response = await aportesApi.getAportesByAfiliado(member.id, { page: 1, limit: 100 })

          if (response?.data) {
            console.log("Datos de aportaciones recibidos:", response.data) // ¡Verifica el campo 'mes'!
            setAportaciones(response.data || [])
          }
        } catch (error) {
          console.error("Error al obtener aportes:", error)
        }
      }
      fetchAportes()
    }
  }, [isOpen, member])

  if (!isOpen) return null

  // Transformar los aportes en formato: { [anio]: { mes: monto } }
  const aportesPorAnio = {}
  aportaciones.forEach(aporte => {
    if (!aportesPorAnio[aporte.anio]) {
      aportesPorAnio[aporte.anio] = {}
    }
    aportesPorAnio[aporte.anio][aporte.mes] = parseFloat(aporte.monto)
  })

  const meses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ]

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContentLarge}>
        <h2>Aportes de {member.nombres} {member.apellidos} - {member.ci}</h2>
        <button onClick={onClose} className={styles.closeButton}>X</button>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>Año</th>
              {meses.map(mes => (
                <th key={mes}>{mes}</th>
              ))}
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(aportesPorAnio).map(anio => {
              const aportesAnio = aportesPorAnio[anio]
              const totalAnio = Object.values(aportesAnio).reduce((sum, val) => sum + val, 0)

              return (
                <tr key={anio}>
                  <td>{anio}</td>
                  {meses.map((_, idx) => (
                    <td key={idx}>
                      {aportesAnio[idx + 1] ? aportesAnio[idx + 1].toFixed(2) : "-"}
                    </td>
                  ))}
                  <td><strong>{totalAnio.toFixed(2)}</strong></td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
