import bcrypt from 'bcryptjs'
import User from './usuarios.model.js';

// 1. Crear Usuario
export const createField = async (req, res) => {
    try {
        const { password, ...data } = req.body;
        const encryptedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            ...data,
            password: encryptedPassword
        });

        await user.save();

        res.status(201).json({
            success: true,
            message: 'Usuario creado exitosamente',
            user: {
                nombre: user.nombre,
                username: user.username,
                email: user.email,
                rol: user.rol
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error al crear el usuario',
            error: error.message
        });
    }
}

// 2. Obtener Usuarios sin cotraseña
export const getFields = async (req, res) => {
    try {
        const users = await User.find().select();
        res.status(200).json({
            success: true,
            users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

// 3. Editar Perfil 
export const updateProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const { oldPassword, newPassword, ...data } = req.body;
        const authenticatedUser = req.user; 

        // Validar que el usuario solo se edite a el
        if (authenticatedUser.uid !== id) {
            return res.status(403).json({
                success: false,
                message: 'No tienes permiso para editar un perfil ajeno'
            });
        }

        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

        // logica de cambio de contraseña
        if (newPassword) {
            if (!oldPassword) {
                return res.status(400).json({ message: 'Debes ingresar la contraseña anterior para validar el cambio' });
            }

            const validOld = await bcrypt.compare(oldPassword, user.password);
            if (!validOld) {
                return res.status(400).json({ message: 'La contraseña anterior es incorrecta' });
            }
            
            data.password = await bcrypt.hash(newPassword, 10);
        }

        // actualizar con nuevos datos
        const updatedUser = await User.findByIdAndUpdate(id, data, { new: true }).select('-password');

        res.status(200).json({
            success: true,
            message: 'Perfil actualizado exitosamente',
            user: updatedUser
        });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// 4. Crear Admin Inicial
export const initAdmin = async () => {
    try {
        const adminExists = await User.findOne({ rol: 'ADMIN_ROLE' });

        if (!adminExists) {
            const encryptedPassword = await bcrypt.hash('Admin123', 10);
            const defaultAdmin = new User({
                nombre: 'Admin Inicial',
                username: 'admin', 
                email: 'admin@kinal.edu.gt',
                password: encryptedPassword,
                rol: 'ADMIN_ROLE'
            });
            await defaultAdmin.save();
            console.log("Admin por defecto creado");
        }
    } catch (error) {
        console.error("Error en initAdmin:", error.message);
    }
}