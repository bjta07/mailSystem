// aportes.controller.js
import { AporteModel } from "../models/aportes.model.js"
import { verifyActiveUser } from "../middlewares/auth.middleware.js"

export const AportesController = {
  // Crear aporte
  async create(req, res) {
    try {
      const uid = parseInt(req.uid) // ID del usuario autenticado
      if (!uid) {
        return res.status(401).json({ ok: false, error: "Usuario no autenticado" })
      }

      const { afiliado_id, anio, mes, monto, fecha_registro } = req.body
      if (!afiliado_id || !anio || !mes || !monto) {
        return res.status(400).json({ ok: false, error: "Faltan datos obligatorios" })
      }

      const aporteData = {
        afiliado_id: parseInt(afiliado_id),
        anio: parseInt(anio),
        mes: parseInt(mes),
        monto: parseFloat(monto),
        fecha_registro
      }

      const aporte = await AporteModel.create(aporteData)
      return res.status(201).json({ ok: true, data: aporte })
    } catch (error) {
      console.error("Error en AportesController.create:", error)
      return res.status(500).json({ ok: false, error: "Error al crear aporte" })
    }
  },

  // Obtener todos los aportes con paginación
  async getAll(req, res) {
    try {
      const page = parseInt(req.query.page) || 1
      const limit = parseInt(req.query.limit) || 10
      const aportes = await AporteModel.findAll({ page, limit })
      return res.json({ ok: true, data: aportes })
    } catch (error) {
      console.error("Error en AportesController.getAll:", error)
      return res.status(500).json({ ok: false, error: "Error al obtener aportes" })
    }
  },

  // Obtener aportes de un afiliado específico
  async getByAfiliado(req, res) {
    try {
      const afiliado_id = parseInt(req.params.afiliado_id)
      if (isNaN(afiliado_id)) {
        return res.status(400).json({ ok: false, error: "ID de afiliado inválido" })
      }
      const page = parseInt(req.query.page) || 1
      const limit = parseInt(req.query.limit) || 10
      const aportes = await AporteModel.findByAfiliado({ afiliado_id, page, limit })
      return res.json({ ok: true, data: aportes })
    } catch (error) {
      console.error("Error en AportesController.getByAfiliado:", error)
      return res.status(500).json({ ok: false, error: "Error al obtener aportes por afiliado" })
    }
  },

  // Obtener aportes por rango de fecha de registro
  async getByFechaRegistro(req, res) {
    try {
      const { fecha_inicio, fecha_fin } = req.query
      if (!fecha_inicio || !fecha_fin) {
        return res.status(400).json({ ok: false, error: "Debe enviar fecha_inicio y fecha_fin" })
      }
      const page = parseInt(req.query.page) || 1
      const limit = parseInt(req.query.limit) || 10
      const aportes = await AporteModel.findByFechaRegistro({ fecha_inicio, fecha_fin, page, limit })
      return res.json({ ok: true, data: aportes })
    } catch (error) {
      console.error("Error en AportesController.getByFechaRegistro:", error)
      return res.status(500).json({ ok: false, error: "Error al filtrar aportes por fecha" })
    }
  },

  // Eliminar aporte por ID
  async remove(req, res) {
    try {
      const id = parseInt(req.params.id)
      if (isNaN(id)) {
        return res.status(400).json({ ok: false, error: "ID inválido" })
      }

      const result = await AporteModel.deleteAporte({ id })
      return res.json({ ok: true, data: result })
    } catch (error) {
      console.error("Error en AportesController.remove:", error)
      return res.status(500).json({ ok: false, error: "Error al eliminar aporte" })
    }
  }
}
