import { Schema, model } from 'mongoose';

const postSchema = Schema({
    titulo: { 
        type: String, 
        required: [true, 'El título es obligatorio'] 
    },

    categoria: { 
        type: String, 
        required: [true, 'La categoría es obligatoria'] 
    },
    
    texto: { 
        type: String, 
        required: [true, 'El texto es obligatorio'] 
    },
    
    autor: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', // Nombre que pusiste en export default model('User', ...)
        required: true 
    }

}, 
{ timestamps: true });

export default model('Post', postSchema);