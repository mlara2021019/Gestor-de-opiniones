import { Schema, model } from 'mongoose';

const commentSchema = Schema({
    texto: { 
        type: String, 
        required: [true, 'El comentario no puede estar vacío'] 
    },
    autor: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    post: { 
        type: Schema.Types.ObjectId, 
        ref: 'Post', 
        required: true 
    }
}, { 
    timestamps: true, 
    versionKey: false 
});

export default model('Comment', commentSchema);