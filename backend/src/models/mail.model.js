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
    cite,
    recepcionado_por
}) => {
    const query = {
        text: `
            INSERT INTO correspondencia 
            (hoja_ruta, referencia, procedencia_id, remitente, cargo_remitente, estado_id, fecha_carta, fecha_recepcion, cite, recepcionado_por)
            VALUES ($1, $2, $3, $4, $5, $6, $7, COALESCE($8, CURRENT_TIMESTAMP), $9, $10)
            RETURNING *`,
        values: [
            hoja_ruta, 
            referencia, 
            parseInt(procedencia_id),  // Debe ser un ID válido de la tabla procedencia
            remitente, 
            cargo_remitente, 
            estado_id || 1,            // 1 por defecto
            fecha_carta, 
            fecha_recepcion ?? null, 
            cite, 
            parseInt(recepcionado_por) // Aseguramos que sea número para la foreign key
        ]
    }
    const { rows } = await db.query(query)
    return rows[0]
}

// Obtener todas
const findAll = async () => {
    const query = {
        text: `
            SELECT 
                c.id,
                c.hoja_ruta,
                c.referencia,
                c.remitente,
                c.cargo_remitente,
                c.fecha_carta,
                c.fecha_recepcion,
                c.cite,
                p.nombre AS procedencia,
                e.nombre AS estado,
                u.uid AS recepcionado_por_id,
                u.name AS recepcionado_por_nombre,
                u.username AS recepcionado_por_username
            FROM correspondencia c
            JOIN procedencia p ON c.procedencia_id = p.id
            JOIN estado e ON c.estado_id = e.id
            JOIN users u ON c.recepcionado_por = u.uid
            ORDER BY c.fecha_recepcion DESC
        `
    };
    const { rows } = await db.query(query);
    return rows;
};


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
