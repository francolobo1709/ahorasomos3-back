import { UserModel } from '../models/User.model.js';

export const getWorkers = async (req, res, next) => {
    try {
        // Obtenemos todos los usuarios con el rol 'prestador'
        const workers = await UserModel.find({ rol: 'prestador' });
        
        // Mapeamos los datos para adaptarlos al formato que espera el frontend
        const formattedWorkers = workers.map(worker => ({
            id: worker._id,
            name: `${worker.nombre} ${worker.apellido}`,
            role: 'worker',
            rating: worker.rating || 0,
            reviewsCount: worker.reviewsCount || 0,
            location: worker.location || { address: "", latitude: 0, longitude: 0 },
            services: worker.services || [],
            availability: worker.availability || {},
            whatsapp: worker.telefono,
            photo: worker.photo || ""
        }));

        res.json(formattedWorkers);
    } catch (err) {
        next(err);
    }
};
