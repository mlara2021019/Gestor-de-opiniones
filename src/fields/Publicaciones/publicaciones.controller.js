import Post from './publicaciones.model.js';
import Comment from '../Comentarios/comentarios.model.js'; // <-- Importamos los comentarios

// 1. Crear Publicación
export const createPost = async (req, res) => {
    try {
        const { titulo, categoria, texto } = req.body;
        const uid = req.user.uid; 

        const post = new Post({
            titulo,
            categoria,
            texto,
            autor: uid
        });

        await post.save();

        res.status(201).json({
            success: true,
            message: 'Publicación creada exitosamente',
            post
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Error al crear la publicación',
            error: error.message 
        });
    }
};

// 2. Obtener todas las publicaciones (AHORA CON COMENTARIOS)
export const getPosts = async (req, res) => {
    try {
        // Buscamos publicaciones y traemos datos del autor
        const posts = await Post.find()
            .populate('autor', 'nombre username')
            .lean(); // .lean() sirve para que nos deje editar el objeto agregando los comentarios

        // Buscamos los comentarios de cada publicación
        const postsWithComments = await Promise.all(posts.map(async (post) => {
            const comentarios = await Comment.find({ post: post._id })
                .populate('autor', 'nombre username'); // Trae quién comentó
            
            return {
                ...post,
                comentarios // Agregamos el array de comentarios a la publicación
            };
        }));
        
        res.status(200).json({
            success: true,
            total: postsWithComments.length,
            posts: postsWithComments
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
};

// 3. Editar Publicación
export const updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { uid } = req.user;
        const data = req.body;

        const post = await Post.findById(id);
        if (!post) return res.status(404).json({ message: 'Publicación no encontrada' });

        if (post.autor.toString() !== uid) {
            return res.status(403).json({ 
                success: false,
                message: 'No tienes permiso para editar esta publicación' 
            });
        }

        const updatedPost = await Post.findByIdAndUpdate(id, data, { new: true });
        
        res.status(200).json({ 
            success: true, 
            message: 'Publicación actualizada',
            updatedPost 
        });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// 4. Eliminar Publicación
export const deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { uid } = req.user;

        const post = await Post.findById(id);
        if (!post) return res.status(404).json({ message: 'Publicación no encontrada' });

        if (post.autor.toString() !== uid) {
            return res.status(403).json({ 
                success: false,
                message: 'No tienes permiso para eliminar esta publicación' 
            });
        }

        await Post.findByIdAndDelete(id);
        
        res.status(200).json({ 
            success: true, 
            message: 'Publicación eliminada correctamente' 
        });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};