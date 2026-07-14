import { createApp } from 'vue';
import { supabase } from './supabase/client';
import CitaMedica from './components/CitaMedica.vue';
import LoginDoctor from './components/LoginDoctor.vue';
// import './css/main.css';

// =============================================
// PROBAR CONEXION A SUPABASE
// =============================================
supabase.from('recetas').select('*').limit(1)
  .then(({ data, error }) => {
    if (error) console.error('❌ Error de conexión:', error);
    else console.log('✅ Conectado a Supabase. Recetas:', data);
  });


const usuario =
JSON.parse(
  localStorage.getItem("usuario") || "null"
);
console.log("USUARIO VUE:", usuario);
createApp(CitaMedica).mount('#app');