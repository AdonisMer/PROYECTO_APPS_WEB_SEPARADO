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