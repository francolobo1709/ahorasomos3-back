import mongoose from 'mongoose';

const VALID_ROLES = ['cliente', 'prestador'];

const userSchema = new mongoose.Schema(
    {
        nombre:   { type: String, required: true, trim: true },
        apellido: { type: String, required: true, trim: true },
        email:    { type: String, required: true, trim: true, lowercase: true, unique: true },
        telefono: { type: String, required: true, trim: true },
        password: { type: String, required: true },
        rol:      { type: String, enum: VALID_ROLES, required: true },
        
        // --- Campos para Prestadores ---
        location: {
            address:   { type: String, default: "" },
            latitude:  { type: Number, default: 0 },
            longitude: { type: Number, default: 0 }
        },
        services: [{ type: String }],
        availability: {
            lunes:     [{ type: String }],
            martes:    [{ type: String }],
            miercoles: [{ type: String }],
            jueves:    [{ type: String }],
            viernes:   [{ type: String }],
            sabado:    [{ type: String }],
            domingo:   [{ type: String }]
        },
        rating:       { type: Number, default: 0 },
        reviewsCount: { type: Number, default: 0 },
        photo:        { type: String, default: "" }
    },
    { timestamps: true }
);

export const UserModel = mongoose.model('User', userSchema);