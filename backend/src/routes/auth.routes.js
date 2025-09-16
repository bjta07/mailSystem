import express from 'express'
const router = express.Router();

// Ruta de prueba para autenticación
router.get('/test', (req, res) => {
    res.json({ message: 'Auth route works ✅' });
});

export default router
