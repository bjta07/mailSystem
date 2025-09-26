import { db } from "../config/db.js";

const createMember = async ({
    ci,
    nombres,
    apellidos,
    colegio_id
}) => {
    const query = {
        text: `
            INSERT INTO afiliados
            (ci, nombres, apellidos, colegio_id)
            VALUES ($1, $2, $3, $4)
            RETURNING *`,
        values:[
            ci,
            nombres,
            apellidos,
            parseInt(colegio_id)
        ]
    }
    const { rows } = await db.query(query)
    return rows [0]
}

const findById = async(id) => {
    const query = {
        text: `
            SELECT id, ci, nombres, apellidos, colegio_id
            FROM afiliados
            WHERE id = $1
        `,
        values: [id]
    }
    const { rows } = await db.query(query)
    return rows[0]
}

const findAllMembers = async () => {
    const query = {
        text: `
            SELECT
            a.id, 
            a.ci, 
            a.nombres, 
            a.apellidos, 
            a.colegio_id,
            c.colegio AS colegio_nombre
            FROM afiliados a
            JOIN colegios c ON a.colegio_id = c.id
            ORDER BY apellidos DESC
        `
    }
    const { rows } = await db.query(query)
    return rows
}

const findByCi = async(ci) => {
    const query = {
        text: `
            SELECT 
            ci, nombres, apellidos, colegio_id
            FROM afiliados
            WHERE ci = $1
        `,
        values: [ci]
    }
    const { rows } = await db.query(query)
    return rows[0]
}

const findByCity = async (colegio_id) => {
    const query = {
        text: `
            SELECT
            ci, nombres, apellidos, colegio_id
            FROM afiliados
            WHERE colegio_id = $1
            ORDER BY apellidos DESC
        `,
        values: [colegio_id]
    }
    const { rows } = await db.query(query)
    return rows
}

const updateMember = async (id,{ ci, nombres, apellidos, colegio_id}) => {
    const query = {
        text: `
            UPDATE afiliados
            SET ci=$2, nombres=$3, apellidos=$4, colegio_id=$5
            WHERE id=$1
            RETURNING id, ci, nombres, apellidos, colegio_id
        `,
        values: [id, ci, nombres, apellidos, colegio_id ? parseInt(colegio_id, 10): null]
    }
    const { rows } = await db.query(query)
    return rows[0]
}

const deleteMember = async (id) => {
    const query = {
        text: `
            DELETE FROM afiliados
            WHERE id = $1
            RETURNING id, ci, nombres, apellidos
        `,
        values: [id]
    }
    const { rows } = await db.query(query)
    return rows [0]
}

export const MemberModel = {
    createMember,
    findAllMembers,
    findById,
    findByCi,
    findByCity,
    updateMember,
    deleteMember
}