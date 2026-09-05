import express from 'express';
import cors from 'cors';
import { engine } from 'express-handlebars';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import servicesRouter from './routes/services.router.js';
import bookingsRouter from './routes/bookings.router.js';
import messagesRouter from './routes/messages.router.js';
import usersRouter from './routes/users.router.js';
import viewsRouter from './routes/views.router.js';
import { errorHandler } from './middlewares/errorHandler.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();

// ── CORS ──────────────────────────────────────────────────────────────────────
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

// ── Handlebars ──────────────────────────────────────────────────────────────
app.engine(
    'handlebars',
    engine({
        defaultLayout: 'main',
        layoutsDir: join(__dirname, 'views', 'layouts'),
        helpers: {
            formatDate: (date) => (date ? new Date(date).toLocaleString('es-AR') : '-'),
            eq: (a, b) => a === b,
        },
    })
);
app.set('view engine', 'handlebars');
app.set('views', join(__dirname, 'views'));

// ── Static files ─────────────────────────────────────────────────────────────
app.use(express.static(join(__dirname, '..', 'public')));

// ── Body parser ───────────────────────────────────────────────────────────────
app.use(express.json());

// ── API root ──────────────────────────────────────────────────────────────────
app.get('/', (_req, res) => {
    res.status(200).json({
        status:  'ok',
        app:     'CleanMatch API',
        version: '2.0.0',
        endpoints: {
            services:     '/api/services',
            bookings:     '/api/bookings',
            messages:     '/api/messages',
            views: {
                services:     '/views/services',
                availability: '/views/availability',
            },
        },
    });
});

// ── Routers ───────────────────────────────────────────────────────────────────
app.use('/api/services', servicesRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/messages', messagesRouter);
app.use('/api/users', usersRouter);
app.use('/views', viewsRouter);

// Respuesta estándar para rutas no definidas
app.use((req, res) => {
    res.status(404).json({ error: `Ruta ${req.method} ${req.path} no encontrada.` });
});

// Manejador centralizado de errores (debe ir al final)
app.use(errorHandler);

export { app };
