import Comment from './comentarios.model.js';

export const addComment = async (req, res) => {
    try {
        const { texto, postId } = req.body;
        const uid = req.user.uid;

        const comment = new Comment({
            texto,
            post: postId,
            autor: uid
        });

        await comment.save();
        res.status(201).json({ success: true, message: 'Comentario creado', comment });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const updateComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { uid } = req.user;
        const { texto } = req.body;

        const comment = await Comment.findById(id);
        if (!comment) return res.status(404).json({ message: 'Comentario no encontrado' });

        if (comment.autor.toString() !== uid) {
            return res.status(403).json({ message: 'No puedes editar un comentario ajeno' });
        }

        const updated = await Comment.findByIdAndUpdate(id, { texto }, { new: true });
        res.status(200).json({ success: true, updated });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const deleteComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { uid } = req.user;

        const comment = await Comment.findById(id);
        if (!comment) return res.status(404).json({ message: 'Comentario no encontrado' });

        if (comment.autor.toString() !== uid) {
            return res.status(403).json({ message: 'No puedes eliminar un comentario ajeno' });
        }

        await Comment.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: 'Comentario eliminado' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};