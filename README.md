# Ahora Somos 3 - API de Servicios y Reservas

Sistema Backend de Turnos y Reservas. API REST construida con **Node.js + Express**, persistencia en **MongoDB Atlas** con Mongoose y arquitectura en capas.

> **API completa** — CRUD de servicios y reservas, relaciones con populate, filtros, paginación, ordenamiento, validaciones con Zod, vistas con Handlebars y comunicación en tiempo real con Socket.io.

## Requisitos

- Node.js v18 o superior
- npm
- MongoDB Atlas (opcional — funciona sin él con algunas limitaciones)

## Instalación

```bash
git clone https://github.com/francolobo1709/ahorasomos3-back.git
cd ahorasomos3-back
npm install
```

## Variables de entorno

Copia el archivo `.env.example` como `.env` y completa los valores:

```bash
cp .env.example .env
```

| Variable    | Descripción                      | Requerida | Ejemplo                 |
|-------------|----------------------------------|-----------|-------------------------|
| `PORT`      | Puerto del servidor              | ✅        | `8080`                  |
| `NODE_ENV`  | Entorno de ejecución             | ✅        | `development`           |
| `MONGO_URI` | URI de conexión a MongoDB Atlas  | ⚠️        | `mongodb+srv://...`     |

> Si `MONGO_URI` no está configurada, los endpoints de mensajes (`/api/messages`) retornarán `503`.

## Ejecución

```bash
npm start      # Producción
npm run dev    # Desarrollo con watch (recomendado)
```

**Salida esperada con MongoDB conectado:**
```
✅ MongoDB conectado correctamente.
🚀 Servidor corriendo en modo: development
📡 Escuchando en http://localhost:8080
```

**Salida esperada sin MongoDB:**
```
⚠️  MongoDB no disponible. /api/messages retornará 503.
🚀 Servidor corriendo en modo: development
📡 Escuchando en http://localhost:8080
```

---

## Arquitectura en capas

El proyecto implementa una arquitectura modular y desacoplada donde cada capa tiene una responsabilidad única.

### Estructura del proyecto

```
src/
├── config/
│   ├── env.config.js           Variables de entorno
│   ├── mongodb.js              Configuración de MongoDB
│   └── socket.js               Configuración de Socket.io
├── database/
│   └── connection.js           Conexión centralizada a MongoDB
├── models/
│   ├── Service.model.js        Schema de servicios
│   ├── Booking.model.js        Schema de reservas (ref: Service)
│   └── message.model.js        Schema de mensajes (ref: Booking)
├── controllers/
│   ├── services.controller.js
│   ├── bookings.controller.js
│   ├── messages.controller.js
│   └── views.controller.js
├── services/
│   ├── services.service.js     Lógica de negocio de servicios
│   ├── bookings.service.js     Lógica de negocio de reservas
│   └── message.service.js      Lógica de negocio de mensajes
├── repositories/
│   ├── services.repository.js  Acceso a datos de servicios
│   ├── bookings.repository.js  Acceso a datos de reservas
│   ├── message.repository.js   Acceso a datos de mensajes
│   └── repository.utils.js     Utilidades compartidas
├── dao/
│   ├── services.dao.js         DAO para servicios
│   ├── bookings.dao.js         DAO para reservas
│   └── message.dao.js          DAO para mensajes
├── routes/
│   ├── services.router.js
│   ├── bookings.router.js
│   ├── messages.router.js
│   └── views.router.js
├── validators/
│   ├── service.validators.js   Schemas de validación (Zod)
│   └── booking.validators.js
├── middlewares/
│   ├── errorHandler.js         Manejador centralizado de errores
│   ├── validate.js             Middleware de validación (Zod)
│   ├── parseId.js              Validación de IDs en params
│   └── requireMongo.js         Guard: 503 si MongoDB no disponible
├── errors/
│   └── AppError.js             Clases de error tipadas
├── views/
│   ├── layouts/
│   │   └── main.handlebars
│   ├── services.handlebars
│   └── availability.handlebars
├── public/
│   ├── css/styles.css
│   └── js/socket.js
├── app.js                      Configuración de Express
└── server.js                   Punto de entrada
```

### Flujo de una petición

```
HTTP Request
    ↓
Router (define el endpoint)
    ↓
Middlewares (validación con Zod, parseId, etc.)
    ↓
Controller (lee req, llama al service, responde con res)
    ↓
Service (reglas de negocio — sin conocer req/res)
    ↓
Repository (acceso a datos — sin lógica de negocio)
    ↓
DAO (accede directamente a MongoDB vía Mongoose)
    ↓
HTTP Response
```

### Responsabilidades por capa

| Capa           | Responsabilidad                                                          |
|----------------|--------------------------------------------------------------------------|
| **Router**     | Define endpoints y aplica middlewares. Sin lógica de negocio.            |
| **Controller** | Lee `req`, llama al service, responde con `res`. Sin lógica de negocio. |
| **Service**    | Concentra la lógica de negocio. No conoce `req`, `res` ni BD.           |
| **Repository** | Ofrece métodos de acceso a datos tipados. Valida y lanza errores.       |
| **DAO**        | Única capa que accede directamente a MongoDB vía Mongoose.               |

---

## Endpoints

### Services — `/api/services`

| Método   | Ruta                  | Descripción                                  |
|----------|----------------------|----------------------------------------------|
| `GET`    | `/api/services`      | Listar servicios (con filtros y paginación) |
| `GET`    | `/api/services/:sid` | Obtener servicio por ID                     |
| `POST`   | `/api/services`      | Crear un servicio                           |
| `PUT`    | `/api/services/:sid` | Actualizar un servicio                      |
| `DELETE` | `/api/services/:sid` | Eliminar un servicio                        |

#### Filtros, paginación y ordenamiento — `GET /api/services`

| Query param | Tipo    | Default      | Ejemplo               |
|-------------|---------|-------------- |-----------------------|
| `category`  | string  | —            | `?category=limpieza`  |
| `available` | boolean | —            | `?available=true`     |
| `page`      | number  | `1`          | `?page=2`             |
| `limit`     | number  | `10` (máx 100)| `?limit=5`           |
| `sortBy`    | string  | `createdAt`  | `?sortBy=price`       |
| `order`     | string  | `asc`        | `?order=desc`         |

**Respuesta:**
```json
{
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Limpieza del hogar",
      "description": "Limpieza completa",
      "duration": 120,
      "price": 5000,
      "category": "limpieza",
      "available": true,
      "createdAt": "2026-07-15T10:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 12,
    "page": 1,
    "limit": 5,
    "totalPages": 3,
    "hasPrevPage": false,
    "hasNextPage": true
  }
}
```

#### Body `POST /api/services` (todos los campos requeridos)

```json
{
  "name": "Limpieza del hogar",
  "description": "Limpieza completa y profunda",
  "duration": 120,
  "price": 5000,
  "category": "limpieza",
  "available": true
}
```

---

### Bookings — `/api/bookings`

| Método   | Ruta                                | Descripción                        |
|----------|-------------------------------------|------------------------------------|
| `GET`    | `/api/bookings`                     | Listar todas las reservas          |
| `GET`    | `/api/bookings/:bid`                | Obtener reserva por ID             |
| `POST`   | `/api/bookings`                     | Crear una reserva                  |
| `PUT`    | `/api/bookings/:bid`                | Actualizar una reserva             |
| `DELETE` | `/api/bookings/:bid`                | Eliminar una reserva               |
| `POST`   | `/api/bookings/:bid/services/:sid`  | Agregar servicio a la reserva      |

#### Body `POST /api/bookings`

```json
{
  "clientName": "Juan Pérez",
  "clientEmail": "juan@example.com",
  "date": "2026-07-20T14:00:00"
}
```

#### Body `POST /api/bookings/:bid/services/:sid`

```json
{
  "quantity": 2
}
```

> - `quantity` es opcional (default: `1`)
> - Si el servicio ya existe en la reserva, se incrementa su cantidad en lugar de duplicarlo

---

### Messages — `/api/messages`

*Requiere `MONGO_URI` configurado. Retorna `503` si MongoDB no está disponible.*

| Método   | Ruta                         | Descripción                       |
|----------|------------------------------|-----------------------------------|
| `GET`    | `/api/messages`              | Listar todos los mensajes         |
| `GET`    | `/api/messages/:mid`         | Obtener mensaje por ID            |
| `GET`    | `/api/messages/booking/:bid` | Mensajes de una reserva específica|
| `POST`   | `/api/messages`              | Crear un mensaje                  |
| `DELETE` | `/api/messages/:mid`         | Eliminar un mensaje               |

---

## Validaciones con Zod

Las validaciones se aplican como middlewares en las rutas antes de llegar al controller. Los datos inválidos retornan `400`.

### Ejemplo de respuesta de error:

```json
{
  "error": "Datos inválidos.",
  "details": "price: debe ser mayor a 0 | available: debe ser true o false"
}
```

---

## Características principales

✅ **CRUD completo** de servicios y reservas  
✅ **Filtros avanzados** en servicios (categoría, disponibilidad)  
✅ **Paginación y ordenamiento** configurables  
✅ **Validación robusta** con Zod  
✅ **Relaciones con populate** entre servicios, reservas y mensajes  
✅ **Manejo centralizado de errores**  
✅ **Socket.io** para comunicación en tiempo real  
✅ **Vistas con Handlebars** para interfaz web  
✅ **Arquitectura en capas** desacoplada y escalable  

---

## Licencia

MIT
