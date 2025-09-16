import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config()

// Configuracion PostgreSQL
const { Pool } = pg

const connectionString = process.env.DATABASE_URL
export const db = new Pool({
    allowExitOnIdle: true,
    connectionString
})

//Conexion a la base de datos
const connectPostgre = async () => {
    try {
        await db.query('SELECT NOW()')
        console.log('PostgreSQL connected ✔')
    } catch (error) {
        console.error ('❌ error connecting to PostgreSQL', error)
    }
}

const connectDatabase = await connectPostgre()

//Cerrar conexion a la base de datos
process.on('SIGINT', async () => {
  console.log('\n🔄 Closing database connections...')
  await db.end()
  process.exit(0)
})

export default connectPostgre
