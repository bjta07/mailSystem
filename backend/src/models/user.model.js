import { db } from "../config/db.js";

const create = async ({
    name,
    username,
    email,
    password,
    phone,
    ci,
    role,
    isActive
}) => {
    const query = {
        text: `INSERT INTO users (name, username, email, password, phone, ci, role, is_active) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING uid, name, username, email, phone, ci, role, is_active as "isActive"`,
        values: [name, username, email, password, phone, ci, role, isActive]
    }
    const { rows } = await db.query(query)
    return rows[0]
}

//Funciones para manejar usuarios

//Obtener por email
const findOneByEmail = async (email) => {
    const query = {
        text: `SELECT uid, name, username, email, password, phone, ci, role, is_active as "isActive" FROM users WHERE email = $1`, 
        values: [email]
    }
    const { rows } = await db.query(query)
    return rows [0]
}

//obtener por usuario
const findOneByUsername = async (username) => {
    const query = {
        text: `SELECT uid, name, username, email, password, phone, ci, role, is_active as "isActive" FROM users WHERE username = $1`, 
        values: [username]
    }
    const { rows } = await db.query(query)
    return rows [0]
}

//obtener por id
const findOneByUid = async (uid) => {
    const query = {
        text: `SELECT uid, name, username, email, password, phone, ci, role, is_active as "isActive" FROM users WHERE uid = $1`, 
        values: [uid]
    }
    const { rows } = await db.query(query)
    return rows [0]
}

//obtener todos los usuarios
const findAll = async () => {
    const query = {
        text: `SELECT uid, name, username, email, password, phone, ci, role, is_active as "isActive" FROM users ORDER BY created_at DESC`, 
    }
    const { rows } = await db.query(query)
    return rows [0]
}

//actualizar rol de usuario
const updateRole = async (uid, role) => {
    const query = {
        text: `
            UPDATE users
            SET role = $2, updated_at = CURRENT_TIMESTAMP
            WHERE uid = $1
            RETURNING uid, name, username, email, password, phone, ci, role, is_active as "isActive", updated_at
        `, 
        values: [uid, role]
    }
    const { rows } = await db.query(query)
    return rows [0]
}

//activar o desactivar usuario
const updateStatus = async (uid) => {
    const query = {
        text: `
            UPDATE users
            SET is_active = NOT is_active, updated_at = CURRENT_TIMESTAMP
            WHERE uid = $1
            RETURNING uid, name, username, email, password, phone, ci, role, is_active as "isActive", updated_at
        `, 
        values: [uid]
    }
    const { rows } = await db.query(query)
    return rows [0]
}

//eliminar usuarios

const deleteUser = async (uid) => {
    const query = {
        text: `
            DELETE FROM users
            WHERE uid = $1
            RETURNING uid, name, username, email
        `, 
        values: [uid]
    }
    const { rows } = await db.query(query)
    return rows [0]
}

//actualizar perfil
const updateProfile = async (uid, { name, email, ci, phone }) => {
    const query = {
        text: `
            UPDATE users
            SET name = $2, email= $3, ci= $4, phone= $5 updated_at = CURRENT_TIMESTAMP
            WHERE uid = $1
            RETURNING uid, name, username, email, password, phone, ci, role, is_active as "isActive", updated_at
        `, 
        values: [uid, name, email, ci, phone]
    }
    const { rows } = await db.query(query)
    return rows [0]
}

//actualizar contraseña
const updatePassword = async (uid, hashedPassword) => {
    const query = {
        text: `
            UPDATE users
            SET password = $2, updated_at = CURRENT_TIMESTAMP
            WHERE uid = $1
            RETURNING uid, name, username, email
        `, 
        values: [uid, hashedPassword ]
    }
    const { rows } = await db.query(query)
    return rows [0]
}

// verificar si ya existe un usuario
const checkUsernameExists = async (username, excludeUid = null) => {
  let query
  if (excludeUid) {
    query = {
      text: `
          SELECT uid FROM users
          WHERE username = $1 AND uid != $2`,
      values: [username, excludeUid],
    }
  } else {
    query = {
      text: `
          SELECT uid FROM users
          WHERE username = $1`,
      values: [username],
    }
  }
  const { rows } = await db.query(query)
  return rows.length > 0
}

// verificar si ya existe un email
const checkEmailExists = async (email, excludeUid = null) => {
  let query
  if (excludeUid) {
    query = {
      text: `
          SELECT uid FROM users
          WHERE email = $1 AND uid != $2`,
      values: [email, excludeUid],
    }
  } else {
    query = {
      text: `
          SELECT uid FROM users
          WHERE email = $1`,
      values: [email],
    }
  }
  const { rows } = await db.query(query)
  return rows.length > 0
}

export const UserModel = {
    create,
    findOneByEmail,
    findOneByUsername,
    findOneByUid,
    findAll,
    updateRole,
    updateStatus,
    deleteUser,
    updateProfile,
    updatePassword,
    checkUsernameExists,
    checkEmailExists
}