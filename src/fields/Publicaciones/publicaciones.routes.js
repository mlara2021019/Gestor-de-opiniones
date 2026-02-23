import { Router } from 'express';
import { createPost, getPosts, updatePost, deletePost } from './publicaciones.controller.js';
import { validateJWT } from '../../../middlewares/validate_jwt.js';

const router = Router();

// Crear una publicación (Cualquier usuario logueado)
router.post(
    '/create',
    validateJWT,
    createPost
);

// Obtener todas las publicaciones
router.get(
    '/',
    getPosts
);

// Actualizar una publicación (Cualquier usuario solo a su propia publicación)
router.put(
    '/update/:id', 
    validateJWT, 
    updatePost
);

// Eliminar una publicación (Cualquier usuario solo su propia publicación)
router.delete(
    '/delete/:id',
    validateJWT,
    deletePost
);

export default router;