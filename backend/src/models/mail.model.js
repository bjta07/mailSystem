import { db } from "../config/db.js";

// Crear correspondencia
const create = async ({
    hoja_ruta,
    referencia,
    procedencia_id,
    remitente,
    cargo_remitente,
    estado_id = 1, // por defecto "Recepcionado"
    fecha_carta,
    fecha_recepcion,
    cite
}) => {
    const query = {
        text: `
            INSERT INTO correspondencia 
            (hoja_ruta, referencia, procedencia_id, remitente, cargo_remitente, estado_id, fecha_carta, fecha_recepcion, cite)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
            RETURNING *`,
        values: [hoja_ruta, referencia, procedencia_id, remitente, cargo_remitente, estado_id, fecha_carta, fecha_recepcion, cite]
    }
    const { rows } = await db.query(query)
    return rows[0]
}

// Obtener todas
const findAll = async () => {
    const query = {
        text: `
            SELECT c.*, p.nombre AS procedencia, e.nombre AS estado
            FROM correspondencia c
            JOIN procedencia p ON c.procedencia_id = p.id
            JOIN estado e ON c.estado_id = e.id
            ORDER BY c.fecha_recepcion DESC`
    }
    const { rows } = await db.query(query)
    return rows
}

// Obtener por id
const findById = async (id) => {
    const query = {
        text: `
            SELECT c.*, p.nombre AS procedencia, e.nombre AS estado
            FROM correspondencia c
            JOIN procedencia p ON c.procedencia_id = p.id
            JOIN estado e ON c.estado_id = e.id
            WHERE c.id = $1`,
        values: [id]
    }
    const { rows } = await db.query(query)
    return rows[0]
}

// Actualizar
const update = async (id, {
    hoja_ruta,
    referencia,
    procedencia_id,
    remitente,
    cargo_remitente,
    estado_id,
    fecha_carta,
    fecha_recepcion,
    cite
}) => {
    const query = {
        text: `
            UPDATE correspondencia
            SET hoja_ruta=$1, referencia=$2, procedencia_id=$3, remitente=$4, 
                cargo_remitente=$5, estado_id=$6, fecha_carta=$7, fecha_recepcion=$8, cite=$9
            WHERE id=$10
            RETURNING *`,
        values: [hoja_ruta, referencia, procedencia_id, remitente, cargo_remitente, estado_id, fecha_carta, fecha_recepcion, cite, id]
    }
    const { rows } = await db.query(query)
    return rows[0]
}

// Eliminar
const remove = async (id) => {
    const query = {
        text: `DELETE FROM correspondencia WHERE id=$1 RETURNING *`,
        values: [id]
    }
    const { rows } = await db.query(query)
    return rows[0]
}

export const MailModel = { create, findAll, findById, update, remove }
