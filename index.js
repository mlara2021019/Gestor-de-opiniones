import dotenv from 'dotenv';
import { initServer } from './configs/app.js';
import { dbConnection } from './configs/db.js'; 
import { initAdmin } from './src/fields/Usuarios/usuarios.controller.js';

dotenv.config();

process.on('uncaughtException', (err)=> {
    console.error('Uncaught Exception in Admin Server:', err);
    process.exit(1);
})

process.on('unhandledRejection', (err, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', err);
    process.exit(1);
})

console.log('Starting gestoropiniones Server...');


initServer();


dbConnection().then(() => {
    initAdmin(); 
}).catch(err => {
    console.error('Database connection failed', err);
});