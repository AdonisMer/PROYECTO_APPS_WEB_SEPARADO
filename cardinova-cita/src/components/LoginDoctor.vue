<template>
  <div class="login-container">
    <div class="login-card">
      <h2>👨‍⚕️Cardinova</h2>
      <h3>Acceso Médico</h3>
      <form @submit.prevent="iniciarSesion" class="formulario1">
        <fieldset>
          <legend>Iniciar sesión</legend>
          <label for="correo">Correo electrónico:</label>
          <input id="correo" type="email" v-model="correo" required placeholder="doctor@cardinova.com" />
          
          <label for="password">Contraseña:</label>
          <input id="password" type="password" v-model="password" required placeholder="••••••••" />
          
          <button type="submit" class="botones" style="width: 100%; margin-top: 10px;">
            <i class="fa-solid fa-arrow-right-to-bracket"></i> Ingresar
          </button>
          
          <p v-if="error" class="error-mensaje">{{ error }}</p>
        </fieldset>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import doctoresData from '../data/doctores.json';

const correo = ref('');
const password = ref('');
const error = ref('');

const iniciarSesion = () => {
  const doctor = doctoresData.find(
    (d: any) => d.correo === correo.value && d.password === password.value
  );
  
  if (doctor) {
    localStorage.setItem("sesionActiva", "true");
    localStorage.setItem("rolUsuario", doctor.rol);
    localStorage.setItem("nombreUsuario", doctor.nombre);
    window.location.reload(); // Recarga para montar CitaMedica
  } else {
    error.value = '❌ Correo o contraseña incorrectos';
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: var(--color-fondo-claro);
}

.login-card {
  background: white;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  max-width: 400px;
  width: 100%;
}

.login-card h2 {
  font-size: 2rem;
  color: var(--color-nav);
  text-align: center;
  margin-bottom: 5px;
}

.login-card h3 {
  color: var(--color-text);
  text-align: center;
  margin-bottom: 30px;
  font-weight: normal;
}

.error-mensaje {
  color: #ef4444;
  text-align: center;
  margin-top: 10px;
  font-weight: bold;
}

.formulario1 {
  background: none;
  box-shadow: none;
  padding: 0;
  border: none;
  max-width: 100%;
}

.formulario1 fieldset {
  border: none;
  padding: 0;
}

.formulario1 label {
  display: block;
  margin-bottom: 5px;
  font-weight: 600;
}

.formulario1 input {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid var(--color-quinary);
  border-radius: 8px;
  font-size: 1rem;
}

.botones {
  background: var(--color-nav);
  color: white;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: 0.3s;
}

.botones:hover {
  background: var(--color-accent);
  transform: scale(1.02);
}
</style>