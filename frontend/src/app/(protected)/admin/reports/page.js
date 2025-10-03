'use client'
import { useState, useEffect, useMemo } from "react"
import { useAuth } from "@/config/contexts/AuthContext"
import { memberApi } from "@/config/api/apiAuth"
import { aportesApi } from "@/config/api/apiAuth"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import styles from "@/styles/Reports.module.css"

export default function Reports (){
    const [members, setMembers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const [aportaciones, setAportaciones] = useState({})
    const [searchFilters, setSearchFilters] = useState({ ci: "", colegio_id: "" })
    const [selectedYear, setSelectedYear] = useState("")
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
                return String(member.ci) === String(searchFilters.ci).trim()
            })
        }
        if (searchFilters.colegio_id && searchFilters.colegio_id.trim() !== '') {
            filtered = filtered.filter(member => {
                if (!member.colegio_id) return false
                return String(member.colegio_id) === String(searchFilters.colegio_id)
            })
        }
        return filtered.sort((a,b) => (a.apellidos || "").localeCompare(b.apellidos || ""))
    }, [members, searchFilters])

    // Fetch members
    useEffect(() => {
        const fetchMembers = async () => {
            try{
                const response = await memberApi.getAllMembers()
                if (response && Array.isArray(response.data)) {
                    setMembers(response.data)
                }else{
                    throw new Error('Formato de respuesta invalido')
                }
            } catch(error){
                setError(error.message || String(error))
            } finally{
                setLoading(false)
            }
        }
        if (currentUser) {
            fetchMembers()
        }
    }, [currentUser])

    // Fetch available years
    useEffect(() => {
        const fetchYears = async () => {
            try {
                const response = await aportesApi.getYearsAndAportes()
                if (response?.data?.years) {
                    setAvailableYears(response.data.years)
                }
            } catch (error) {
                console.error("Error al obtener años disponibles", error)
            }
        }
        fetchYears()
    }, [])

    // Fetch aportes for the selected year and members
    useEffect(() => {
        const fetchAportesForYear = async () => {
            if (!selectedYear) {
                setAportaciones({})
                return
            }
            try {
                // Asumimos que aportesApi.getYearsAndAportes(year) devuelve aportes para el año
                const response = await aportesApi.getYearsAndAportes(selectedYear)
                const allAportesForSelectedYear = response?.data?.aportes?.data || []
                const aportesPorMiembro = {}

                for(const member of members){
                    aportesPorMiembro[member.id] = []
                }
                for(const aporte of allAportesForSelectedYear){
                    // Aseguramos que exista el afiliado en el map
                    if (aportesPorMiembro[String(aporte.afiliado_id)]) {
                        aportesPorMiembro[String(aporte.afiliado_id)].push(aporte)
                    }
                }
                setAportaciones(aportesPorMiembro)
            } catch (error) {
                console.error("Error al obtener aportes por año:", error)
            }
        }
        if (members.length > 0) fetchAportesForYear()
    }, [members, selectedYear])

    // Helper: formatea fecha legible
    const formatDateTime = (date = new Date()) => {
        return date.toLocaleString("es-BO", {
            year: "numeric", month: "long", day: "2-digit",
            hour: "2-digit", minute: "2-digit"
        })
    }

    // Genera filas para la tabla del PDF: una fila por miembro con columnas meses + total
    const buildTableRows = (memberList) => {
        const rows = []
        for (const member of memberList) {
            const aporteList = aportaciones[String(member.id)] || []
            // Inicializamos 12 meses en 0
            const mesesVals = Array(12).fill(0)
            let total = 0
            for (const a of aporteList) {
                // Asumimos que aporte.mes es 1..12 y aporte.monto es numérico
                const m = Number(a.mes)
                const monto = Number(a.monto) || 0
                if (!isNaN(m) && m >= 1 && m <= 12) {
                    mesesVals[m-1] += monto
                    total += monto
                } else {
                    // Si el aporte no tiene mes válido, lo sumamos al total (opcional)
                    total += monto
                }
            }
            const row = [
                member.ci || "",
                `${member.apellidos || ""} ${member.nombres || ""}`.trim(),
                ...mesesVals.map(v => v === 0 ? "-" : Number(v).toFixed(2)),
                Number(total).toFixed(2)
            ]
            rows.push(row)
        }
        return rows
    }

    // Generar PDF y abrir en nueva pestaña
const generatePDF = () => {
  if (!selectedYear) {
    alert("Debe seleccionar un año para generar el informe.")
    return
  }

  const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" })

  // Título general
  const title = `Informe de Aportaciones - Año ${selectedYear}`
  const printedBy = currentUser ? `${currentUser.nombre || currentUser.name || currentUser.username || ""}` : "Usuario desconocido"
  const fechaImpresion = formatDateTime(new Date())

  doc.setFontSize(14)
  doc.text(title, 40, 40)
  doc.setFontSize(10)
  doc.text(`Impreso por: ${printedBy}`, 40, 60)
  doc.text(`Fecha: ${fechaImpresion}`, 40, 76)

  // Encabezado de la tabla
  const head = [
    "CI",
    "Apellidos y Nombres",
    ...meses,
    "Total"
  ]

  let y = 100 // posición inicial después del encabezado global

  // Agrupar por colegio
  const groupedByColegio = {}
  filteredAndSortedMembers.forEach(member => {
    const colegioName = colegios[member.colegio_id] || "Colegio desconocido"
    if (!groupedByColegio[colegioName]) groupedByColegio[colegioName] = []
    groupedByColegio[colegioName].push(member)
  })

  // Generar tabla para cada colegio
  for (const colegioName in groupedByColegio) {
    const membersInColegio = groupedByColegio[colegioName]
    const rows = buildTableRows(membersInColegio)

    // Escribir nombre del colegio como título antes de la tabla
    doc.setFontSize(12)
    doc.setFont("helvetica", "bold")
    doc.text(colegioName, 40, y)
    y += 10

    autoTable(doc, {
      head: [head],
      body: rows,
      startY: y,
      styles: {
        fontSize: 8,
        halign: "center",
        valign: "middle",
        cellPadding: 4,
      },
      headStyles: {
        fillColor: [40, 116, 166],
        textColor: 255,
        halign: "center",
      },
      didParseCell: function (data) {
        if (data.section === "body" && data.row.index % 2 === 1) {
          data.cell.styles.fillColor = [245, 245, 245]
        }
      },
      columnStyles: {
        0: { halign: "center", cellWidth: 60 },  // CI
        1: { halign: "left", cellWidth: 120 },   // Nombre
        // Meses y total = auto
      },
      margin: { left: 40, right: 40 },
      showHead: "everyPage",
      didDrawPage: function (data) {
        const pageSize = doc.internal.pageSize
        const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight()
        doc.setFontSize(8)
        doc.text(`Página ${doc.internal.getNumberOfPages()}`, data.settings.margin.left, pageHeight - 10)
      },
    })

    // actualizar posición Y para la siguiente tabla
    y = doc.lastAutoTable.finalY + 30
  }

  // Abrir en nueva pestaña
  const pdfBlob = doc.output("blob")
  const blobUrl = URL.createObjectURL(pdfBlob)
  window.open(blobUrl, "_blank")
}

return (
    <div className={styles.container}>
        <h2 className={styles.title}>Informes de Aportaciones</h2>

        <div className={styles.filters}>
            <label className={styles.label}>
                Año (obligatorio):
                <select
                    value={selectedYear}
                    onChange={e => setSelectedYear(e.target.value)}
                    className={styles.select}
                >
                    <option value="">-- Seleccione año --</option>
                    {availableYears.map(y => (
                        <option key={y} value={y}>{y}</option>
                    ))}
                </select>
            </label>

            <label className={styles.label}>
                Colegio:
                <select
                    value={searchFilters.colegio_id}
                    onChange={e => handleSearchChange('colegio_id', e.target.value)}
                    className={styles.select}
                >
                    <option value="">Todos</option>
                    {Object.entries(colegios).map(([id, name]) => (
                        <option key={id} value={id}>{name}</option>
                    ))}
                </select>
            </label>

            <label className={styles.label}>
                CI afiliado:
                <input
                    type="text"
                    value={searchFilters.ci}
                    onChange={e => handleSearchChange('ci', e.target.value)}
                    placeholder="CI exacto"
                    className={styles.input}
                />
            </label>

            <button onClick={clearSearch} className={styles.buttonSecondary}>
                Limpiar filtros
            </button>

            <button onClick={generatePDF} className={styles.buttonPrimary}>
                Generar PDF
            </button>
        </div>

        <div className={styles.preview}>
            <p className={styles.previewInfo}>
                Vista previa: {filteredAndSortedMembers.length} registros encontrados
            </p>
            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>CI</th>
                            <th>Apellidos y Nombres</th>
                            <th>Colegio</th>
                            <th>Total (año)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAndSortedMembers.map((m, idx) => {
                            const aporteList = aportaciones[String(m.id)] || []
                            const total = aporteList.reduce((acc, a) => acc + (Number(a.monto) || 0), 0)
                            return (
                                <tr key={m.id} className={idx % 2 === 0 ? styles.rowEven : styles.rowOdd}>
                                    <td>{m.ci}</td>
                                    <td>{(m.apellidos || '') + ' ' + (m.nombres || '')}</td>
                                    <td>{colegios[String(m.colegio_id)] || m.colegio_nombre || ''}</td>
                                    <td>{total.toFixed(2)}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
)

}
