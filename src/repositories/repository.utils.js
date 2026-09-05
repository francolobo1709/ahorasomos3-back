import mongoose from 'mongoose';
import { ValidationError } from '../errors/AppError.js';

export function assertValidId(id) {
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        throw new ValidationError(`El id '${id}' no es un ObjectId válido.`);
    }
}
