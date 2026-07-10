# PROYECTO_APPS_WEB_SEPARADO📋 README.md - Cardinova (Módulo de Cita Médica)
markdown
# 🏥 Cardinova - Módulo de Cita Médica

Sistema de gestión de citas médicas y recetas electrónicas desarrollado con **Vue 3**, **TypeScript**, **Vite** y **Supabase**.

---

## 📝 Descripción

Aplicación web para médicos que permite:

- Iniciar sesión con credenciales predefinidas.
- Seleccionar pacientes desde Supabase (tabla `usuarios` + `pacientes`).
- Registrar síntomas, diagnóstico y medicamentos.
- Buscar farmacias cercanas con disponibilidad de medicamentos.
- Enviar recetas a Supabase (tabla `recetas`).
- Exportar recetas a PDF.
- Guardar el estado del paciente en `localStorage` (persistencia al recargar).

---

## 🛠️ Tecnologías

- **Vue 3** - Composition API
- **TypeScript** - Tipado estático
- **Vite** - Bundler
- **Supabase** - Backend (PostgreSQL + API REST)
- **CSS3** - Estilos personalizados

---

## 🗄️ Estructura de la base de datos (Supabase)

### Tabla `usuarios`
Almacena todos los usuarios (médicos y pacientes).

```sql
CREATE TABLE usuarios (
    id_usuario UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    cedula VARCHAR(15) UNIQUE NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL,
    contrasena VARCHAR(255) NOT NULL,
    rol VARCHAR(20) NOT NULL
);
Tabla pacientes
Relacionada con usuarios, guarda datos específicos de pacientes.

sql
CREATE TABLE pacientes (
    id_paciente UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_usuario UUID NOT NULL UNIQUE REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    telefono VARCHAR(15) NOT NULL
);
Tabla recetas
Guarda las recetas médicas enviadas desde la aplicación.

sql
CREATE TABLE recetas (
    id SERIAL PRIMARY KEY,
    paciente VARCHAR(100) NOT NULL,
    fecha DATE NOT NULL,
    diagnostico TEXT NOT NULL,
    medicamentos JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
Tabla doctores (fallback local)
Se usa como respaldo si Supabase no está disponible.

sql
CREATE TABLE doctores (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol VARCHAR(20) DEFAULT 'doctor'
);
📁 Estructura del proyecto
text
src/
├── components/          # Componentes Vue
├── composables/         # Lógica reutilizable (usePacientes, useRecetas, useFarmacias)
├── services/            # Servicios para Supabase
├── supabase/            # Cliente de Supabase
├── data/                # JSON de prueba (fallback)
├── css/                 # Estilos globales
└── main.ts              # Punto de entrada


🔑 Credenciales de prueba
Doctores disponibles (desde doctores.json)
Doctor	Correo	Contraseña
Dr. Carlos Rodríguez	carlos.rodriguez@cardinova.com	doc_carlos123
Dra. María Gómez	maria.gomez@cardinova.com	doc_maria123
Dr. Roberto Jara	dr.jara@hospital.com	Medico2026
Dra. Ana López	dr.ana@hospital.com	Medico2026
Dr. Luis Zambrano	dr.zambrano@hospital.com	Medico2026
Dr. Jorge Andrade	dr.andrade@hospital.com	Medico2026
Dr. Pablo Rios	dr.rios@hospital.com	Medico2026
Dra. Cecilia Paz	dr.paz@hospital.com	Medico2026
Dr. Carlos Rodríguez	dr.rodriguez@hospital.com	Medico2026
Dr. Esteban Ruiz	dr.ruiz@hospital.com	Medico2026


✨ Funcionalidades principales
Funcionalidad	Descripción
Login	Inicio de sesión con credenciales de doctor.
Selector de pacientes	Lista de pacientes desde Supabase (solo rol paciente).
Síntomas	Agregar/eliminar síntomas desde un select predefinido.
Diagnóstico	Editable en línea con botón "Editar" y "Guardar".
Medicamentos	Seleccionar nombre, dosis y frecuencia.
Farmacias	Búsqueda de farmacias con stock, ordenadas por distancia y precio.
Enviar receta	Guarda en Supabase (tabla recetas) y en localStorage.
Exportar PDF	Genera un PDF con todos los datos de la receta.
Persistencia local	El estado del paciente se guarda en localStorage.
Cerrar sesión	Elimina los datos de sesión y redirige al login.
📄 Licencia
Uso académico - ULEAM

👥 Autores
Adonis Joeth Mero Barcia - Desarrollo frontend y módulo de Cita Médica.