# 💰 Dashboard de Gastos Personales

Dashboard profesional para gestionar gastos personales con análisis por categoría y período, construido con arquitectura moderna y mejores prácticas.

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)

## 🚀 Características

### Funcionalidades Principales
- ✅ **CRUD completo** de gastos con validación
- 📊 **Visualización de datos** con gráficos interactivos (mensual y por categoría)
- 🔍 **Filtros avanzados** por categoría y rango de fechas
- 📱 **Diseño responsive** con Tailwind CSS
- ⚡ **Actualizaciones en tiempo real** con React Query
- 🎨 **Categorías personalizables** con códigos de color

## 📁 Estructura del Proyecto

```
expense-dashboard/
├── backend/
│   ├── src/
│   │   ├── controllers/      # Controladores de rutas
│   │   ├── services/          # Lógica de negocio
│   │   ├── repositories/      # Acceso a datos
│   │   ├── routes/            # Definición de rutas
│   │   ├── middleware/        # Middleware personalizado
│   │   ├── validators/        # Schemas de validación (Zod)
│   │   ├── db/                # Configuración y migraciones de BD
│   │   ├── types/             # Tipos TypeScript
│   │   └── server.ts          # Entry point
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── components/        # Componentes React
│   │   ├── hooks/             # Custom hooks
│   │   ├── services/          # API client
│   │   ├── types/             # Tipos TypeScript
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   └── vite.config.ts
│
└── docker-compose.yml         # PostgreSQL para desarrollo
```

## 🛠️ Stack Tecnológico

### Backend
- **Runtime:** Node.js
- **Framework:** Express
- **Lenguaje:** TypeScript
- **Base de datos:** PostgreSQL
- **ORM/Query Builder:** pg (node-postgres)
- **Validación:** Zod
- **Variables de entorno:** dotenv

### Frontend
- **Framework:** React 18
- **Lenguaje:** TypeScript
- **Build tool:** Vite
- **Estilos:** Tailwind CSS
- **Gestión de estado:** React Query (TanStack Query)
- **HTTP Client:** Axios
- **Gráficos:** Recharts
- **Utilidades de fecha:** date-fns

## 📋 Requisitos Previos

- Node.js >= 18.x
- PostgreSQL >= 14
- npm o yarn

## 🚀 Instalación y Configuración

### 1. Clonar el repositorio

```bash
git clone <repository-url>
cd expense-dashboard
```


### 2. Crear la Base de Datos
Abre pgAdmin (viene con PostgreSQL) o usa la terminal:

```bash
# En CMD o PowerShell
psql -U postgres

# Dentro de psql:
CREATE DATABASE expense_tracker;
\q
```

### 3. Backend Setup

```bash
cd backend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales

# Ejecutar migraciones
npm run migrate

# Poblar con datos de ejemplo (opcional)
npm run seed

# Iniciar servidor de desarrollo
npm run dev
```

El backend estará disponible en `http://localhost:3001`

### 4. Frontend Setup

```bash
cd frontend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env

# Iniciar servidor de desarrollo
npm run dev
```

El frontend estará disponible en `http://localhost:5173`

## 📊 API Endpoints

### Gastos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/expenses` | Listar gastos (con filtros opcionales) |
| GET | `/api/expenses/:id` | Obtener un gasto |
| POST | `/api/expenses` | Crear gasto |
| PATCH | `/api/expenses/:id` | Actualizar gasto |
| DELETE | `/api/expenses/:id` | Eliminar gasto |
| GET | `/api/expenses/stats/monthly` | Totales por mes |
| GET | `/api/expenses/stats/categories` | Totales por categoría |

### Categorías

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/categories` | Listar categorías |
| GET | `/api/categories/:id` | Obtener una categoría |
| POST | `/api/categories` | Crear categoría |
| PUT | `/api/categories/:id` | Actualizar categoría |
| DELETE | `/api/categories/:id` | Eliminar categoría |
