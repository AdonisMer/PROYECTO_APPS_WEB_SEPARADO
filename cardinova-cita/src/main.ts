import { createApp } from 'vue';
import CitaMedica from './components/CitaMedica.vue';
import LoginDoctor from './components/LoginDoctor.vue';
import './css/main.css';

// =============================================
// Verificar si el doctor ya inició sesión
// =============================================
const sesionActiva = localStorage.getItem("sesionActiva") === "true";

// =============================================
// Montar el componente adecuado
// =============================================
if (sesionActiva) {
  // Si ya hay sesión, mostrar la cita médica
  createApp(CitaMedica).mount('#app');
} else {
  // Si no hay sesión, mostrar el login
  createApp(LoginDoctor).mount('#app');
}