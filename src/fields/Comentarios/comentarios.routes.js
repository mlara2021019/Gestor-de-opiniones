import { Router } from 'express';
import { addComment, updateComment, deleteComment } from './comentarios.controller.js';
import { validateJWT } from '../../../middlewares/validate_jwt.js';

const router = Router();

router.post('/add', validateJWT, addComment);
router.put('/update/:id', validateJWT, updateComment);
router.delete('/delete/:id', validateJWT, deleteComment);

export default router;