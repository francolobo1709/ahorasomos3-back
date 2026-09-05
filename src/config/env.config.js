import dotenv from 'dotenv';

dotenv.config();

const requiredEnvs = ['PORT', 'NODE_ENV', 'MONGO_URI'];

requiredEnvs.forEach((envVar) => {
    if (!process.env[envVar]) {
        console.error(`❌ Error crítico: Falta la variable de entorno obligatoria '${envVar}'. Revisa tu archivo .env.`);
        process.exit(1);
    }
});

export const config = {
    port:     process.env.PORT,
    env:      process.env.NODE_ENV,
    mongoUri: process.env.MONGO_URI,
};
