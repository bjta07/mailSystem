import { MemberModel } from "../models/member.model.js";

const registerMember = async (req, res) => {
    try {
        const { ci, nombres, apellidos, colegio_id} = req.body
        if(!ci || !nombres || !apellidos || !colegio_id){
            return res.status(400).json({
                ok: false,
                msg: 'Missing required fields'
            })
        }
        const existingCi = await MemberModel.findByCi(ci)
        if (existingCi){
            return res.status(409).json({
                ok: false,
                msg: 'Ci already exists'
            })
        }

        const newMember = await MemberModel.createMember({
            ci,
            nombres,
            apellidos,
            colegio_id
        })

        return res.status(201).json({
            ok: true,
            msg:{
                member:{
                    id: newMember.id,
                    ci: newMember.ci,
                    nombres: newMember.nombres,
                    apellidos: newMember.apellidos,
                    colegio_id: newMember.colegio_id
                }
            }
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            ok: false,
            msg: 'Server error'
        })
    }
}

const findAllMembers = async (req, res) => {
    try {
        const members = await MemberModel.findAllMembers()
        return res.json({
            ok: true,
            data: members,
            msg: ' Members retrieved successfully'
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            ok: false,
            msg: 'Server error'
        })
    }
}

const findByCi = async (req, res) => {
    try {
        const { ci } = req.params
        const member = await MemberModel.findByCi(ci)
        return res.json({
            ok: true,
            data: member,
            msg: 'Member retrieved successfully'
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            ok: false,
            msg: 'Server error'
        })
    }
}

const findByCity = async (req, res) => {
    try {
        const { colegio_id } = req.params
        const memberCity = await MemberModel.findByCity(colegio_id)
        return res.json({
            ok: true,
            data: memberCity,
            msg: 'Member by city retrieved successfully'
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            ok: false,
            msg: 'server error'
        })
    }
}

const updateMember = async (req, res) => {
    try {
        const { id } = req.params
        const { ci, nombres, apellidos, colegio_id } = req.body

        const member = await MemberModel.findById(id)
        if (!member) return res.status(404).json({
            ok: false,
            msg:'Member not found'
        })

        const updateMember = await MemberModel.updateMember(id,{
            ci, nombres, apellidos, colegio_id
        })

        return res.json({
            ok: true,
            data: updateMember,
            msg: 'Member updated successfully'
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            ok: false,
            msg: 'Server error'
        })
    }
}

const deleteMember = async (req, res) => {
    try {
        const { id } = req.params
        const member = await MemberModel.findById(id)
        if (!member) return res.status(404).json({
            ok: false,
            msg: 'User not found'
        })

        const deleteMember = await MemberModel.deleteMember(id)
        return res.json({
            ok: true,
            data: { id, nombres: deleteMember.nombres},
            msg: 'User deleted successfully'
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            ok: false,
            msg: 'Server error'
        })
    }
}

export const MemberController = {
    registerMember,
    updateMember,
    findAllMembers,
    findByCi,
    findByCity,
    deleteMember
}