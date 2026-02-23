'use strict';

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        nombre: {
            type: String,
            required: [true, 'El nombre es requerido'],
            trim: true,
            maxLength: [100, 'El nombre no puede exceder 100 caracteres'],
        },
        username: {
            type: String,
            required: [true, 'El nombre de usuario es requerido'],
            unique: true,
            trim: true
        },
        email: {
            type: String,
            required: [true, 'El email es requerido'],
            unique: true,
        },
        password: {
            type: String,
            required: [true, 'La contraseña es requerida'],
        },
        rol: {
            type: String,
            enum: ['ADMIN_ROLE', 'USER_ROLE'],
            default: 'USER_ROLE',
        },
    },
    {
        timestamps: true,
    }
);

// Para evitar problemas de referencia en los controladores
const User = mongoose.model('User', userSchema);
export default User;