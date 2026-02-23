'use strict';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { dbConnection } from './db.js';
import { corsOptions } from './cors-configuration.js';
import { helmetConfiguration } from './helmet-configuration.js';
import usuariosRoutes from '../src/fields/Usuarios/usuarios.routes.js';
import roleRoutes from '../src/fields/Roles/role_routes.js';
import authRoutes from '../src/fields/auth/auth_routes.js';
import publicacionesRoutes from '../src/fields/Publicaciones/publicaciones.routes.js'; 
// --- NUEVO IMPORT ---
import comentariosRoutes from '../src/fields/Comentarios/comentarios.routes.js'; 

const BASE_PATH = '/gestoropiniones/v1';

const middlewares = (app) => {
    app.use(express.urlencoded({extended: false, limit: '10mb'}));
    app.use(express.json({ limit: '10mb'}));
    app.use(cors(corsOptions));
    app.use(helmet(helmetConfiguration));
    app.use(morgan('dev'));
}

const routes = (app) => {
    
    app.use(`${BASE_PATH}/Usuarios`, usuariosRoutes);
    app.use(`${BASE_PATH}/Roles`, roleRoutes);
    app.use(`${BASE_PATH}/auth`, authRoutes);
    app.use(`${BASE_PATH}/Publicaciones`, publicacionesRoutes); 
    // --- NUEVA RUTA ---
    app.use(`${BASE_PATH}/Comentarios`, comentariosRoutes); 

    
    app.get(`${BASE_PATH}/Health`, (request, response) => {
        response.status(200).json({
            status: 'Healthy',
            timestamp: new Date().toISOString(),
            service: 'gestoropiniones'
        })
    });

    
    app.use((req, res) => {
        res.status(404).json({
            success: false,
            message: 'Endpoint no encontrado en Admin API'
        })
    });
}

export const initServer = async () => {
    const app = express();
    const PORT = process.env.PORT || 3006;
    app.set('trust proxy', 1);

    try {
        await dbConnection();
        middlewares(app);
        routes(app);
        
        app.listen(PORT, () => {
            console.log(`gestoropiniones Server running on port ${PORT}`);
            console.log(`Health check: http://localhost:${PORT}${BASE_PATH}/Health`);
        });

    } catch (error) {
        console.error(`Error starting Admin Server: ${error.message}`);
        process.exit(1);
    }
}