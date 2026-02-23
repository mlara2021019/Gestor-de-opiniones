import { Router } from 'express';
import { createField, getFields, updateProfile } from './usuarios.controller.js';
import { validateJWT } from '../../../middlewares/validate_jwt.js';
import { requireRole } from '../../../middlewares/validate_role.js';

const router = Router();

// Crear usuario (Solo Admin)
router.post(
    '/create',
    validateJWT,
    requireRole('ADMIN_ROLE'),
    createField
);

// Obtener todos los usuarios
router.get(
    '/',
    getFields
);

// Actualizar perfil (Cualquier usuario a sí mismo)
router.put(
    '/update/:id', 
    validateJWT, 
    updateProfile
);

export default router;