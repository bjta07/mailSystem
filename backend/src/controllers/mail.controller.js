import { MailModel } from "../models/mail.model.js"

export const MailController = {
    async create(req, res) {
        try {
            const mail = await MailModel.create(req.body)
            return res.status(201).json({ ok: true, data: mail })
        } catch (error) {
            console.error(error)
            return res.status(500).json({ ok: false, error: "Error creating correspondence" })
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
