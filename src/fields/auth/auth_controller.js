import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../Usuarios/usuarios.model.js'

export const login = async (req, res) => {
    try {
        const { credential, password } = req.body

        // Busca por email o username
        const user = await User.findOne({
            $or: [
                { email: credential },
                { username: credential }
            ]
        })

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Credenciales inválidas (Usuario no encontrado)'
            })
        }

        const validPassword = await bcrypt.compare(password, user.password)
        if (!validPassword) {
            return res.status(400).json({
                success: false,
                message: 'Credenciales inválidas (Contraseña incorrecta)'
            })
        }

        // Payload usando 'uid'
        const payload = {
            uid: user._id,
            role: user.rol
        }

        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        )

        return res.json({
            success: true,
            message: `Bienvenido ${user.nombre}`,
            token,
            user: {
                uid: user._id,
                username: user.username,
                rol: user.rol
            }
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error en el servidor',
            error: error.message
        })
    }
}