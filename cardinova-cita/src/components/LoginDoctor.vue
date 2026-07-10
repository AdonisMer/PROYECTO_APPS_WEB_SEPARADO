<template>
  <div class="login-wrapper">
    <div class="login-card">
      <h2>👨‍⚕️ Cardinova</h2>
      <h3>Acceso Médico</h3>
      <form @submit.prevent="iniciarSesion" class="login-form">
        <div class="grupo-campo">
          <label for="correo">Correo electrónico:</label>
          <input id="correo" type="email" v-model="correo" required placeholder="doctor@cardinova.com" />
        </div>
        <div class="grupo-campo">
          <label for="password">Contraseña:</label>
          <input id="password" type="password" v-model="password" required placeholder="••••••••" />
        </div>
        <button type="submit" class="btn-login">
          <i class="fa-solid fa-arrow-right-to-bracket"></i> Ingresar
        </button>
        <p v-if="error" class="error-mensaje">{{ error }}</p>
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
    window.location.reload();
  } else {
    error.value = '❌ Correo o contraseña incorrectos';
  }
};
</script>

<style scoped>
.login-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: var(--color-fondo-claro, #F1F5F9);
  padding: 20px;
  margin: 0;
}

.login-card {
  background: white;
  padding: 40px 45px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  max-width: 420px;
  width: 100%;
  text-align: center;
}

.login-card h2 {
  font-size: 2rem;
  color: var(--color-nav, #1F4E5F);
  margin-bottom: 5px;
}

.login-card h3 {
  color: var(--color-text, #52616B);
  margin-bottom: 30px;
  font-weight: normal;
  font-size: 1.1rem;
}

.login-form {
  text-align: left;
}

.login-form .grupo-campo {
  margin-bottom: 18px;
}

.login-form .grupo-campo label {
  display: block;
  font-weight: 600;
  color: var(--color-text-title, #2F4858);
  margin-bottom: 5px;
  font-size: 0.95rem;
}

.login-form .grupo-campo input {
  width: 100%;
  padding: 12px 14px;
  border: 2px solid var(--color-quinary, #425851);
  border-radius: 10px;
  font-size: 1rem;
  background: var(--color-fondo-claro, #F1F5F9);
  box-sizing: border-box;
  transition: 0.3s;
}

.login-form .grupo-campo input:focus {
  border-color: var(--color-accent, #598b9c);
  outline: none;
  box-shadow: 0 0 0 3px rgba(89, 139, 156, 0.2);
}

.btn-login {
  width: 100%;
  padding: 14px;
  background: var(--color-nav, #1F4E5F);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: 0.3s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.btn-login:hover {
  background: var(--color-accent, #598b9c);
  transform: scale(1.02);
}

.error-mensaje {
  color: #ef4444;
  text-align: center;
  margin-top: 15px;
  font-weight: bold;
}
</style>