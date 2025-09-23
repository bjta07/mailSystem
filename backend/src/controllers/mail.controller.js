import { MailModel } from "../models/mail.model.js"
import { verifyActiveUser } from "../middlewares/auth.middleware.js"

export const MailController = {
    async create(req, res) {
        try {
            const data = req.body
            
            // Verificamos autenticación y obtenemos el uid
            const uid = parseInt(req.uid)
            if (!uid) {
                return res.status(401).json({ ok: false, error: "Usuario no autenticado" })
            }

            // Validamos y convertimos procedencia_id a número
            const procedencia_id = parseInt(data.procedencia_id)
            if (isNaN(procedencia_id)) {
                return res.status(400).json({ ok: false, error: "El ID de procedencia debe ser un número válido" })
            }

            // Preparamos los datos para guardar
            const mailData = {
                ...data,
                procedencia_id,
                recepcionado_por: uid
            }

            // Guardamos en la BD
            const mail = await MailModel.create(mailData)

            return res.status(201).json({ ok: true, data: mail })
        } catch (error) {
            console.error("Error en MailController.create:", error)
            return res.status(500).json({ ok: false, error: "Error al crear correspondencia" })
        }
    },

    async getAll(req, res) {
        try {
            const mails = await MailModel.findAll()
            return res.json({ ok: true, data: mails })
        } catch (error) {
            console.error(error)
            return res.status(500).json({ ok: false, error: "Error fetching correspondence" })
        }
    },

    async getById(req, res) {
        try {
            const mail = await MailModel.findById(req.params.id)
            if (!mail) {
                return res.status(404).json({ ok: false, error: "Correspondence not found" })
            }
            return res.json({ ok: true, data: mail })
        } catch (error) {
            console.error(error)
            return res.status(500).json({ ok: false, error: "Error fetching correspondence" })
        }
    },

    async update(req, res) {
        try {
            const mail = await MailModel.update(req.params.id, req.body)
            if (!mail) {
                return res.status(404).json({ ok: false, error: "Correspondence not found" })
            }
            return res.json({ ok: true, data: mail })
        } catch (error) {
            console.error(error)
            return res.status(500).json({ ok: false, error: "Error updating correspondence" })
        }
    },

    async remove(req, res) {
        try {
            const mail = await MailModel.remove(req.params.id)
            if (!mail) {
                return res.status(404).json({ ok: false, error: "Correspondence not found" })
            }
            return res.json({ ok: true, data: mail })
        } catch (error) {
            console.error(error)
            return res.status(500).json({ ok: false, error: "Error deleting correspondence" })
        }
    }
}
