import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { UserModel } from './src/models/User.model.js';

dotenv.config();

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Conectado a MongoDB para seeding');

        // Evitar duplicados
        await UserModel.deleteMany({ email: 'maria@test.com' });

        const worker = new UserModel({
            nombre: 'María',
            apellido: 'López',
            email: 'maria@test.com',
            telefono: '5491100000001',
            password: 'hashedpassword',
            rol: 'prestador',
            location: {
                address: 'Villa Crespo, CABA',
                latitude: -34.5986,
                longitude: -58.4411
            },
            services: ['limpieza', 'planchado'],
            availability: {
                lunes: ['morning', 'midday'],
                martes: ['afternoon'],
                miercoles: ['morning', 'afternoon'],
                jueves: ['midday'],
                viernes: ['morning', 'midday', 'afternoon']
            },
            rating: 4.9,
            reviewsCount: 45,
            photo: "https://images.pexels.com/photos/3768910/pexels-photo-3768910.jpeg"
        });

        await worker.save();
        console.log('✅ Trabajador de prueba insertado correctamente');

        mongoose.connection.close();
    } catch (err) {
        console.error('❌ Error:', err);
        mongoose.connection.close();
    }
};

seed();
