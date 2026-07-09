<template>
  <div class="panel-medico">
    <h3>Información de la Consulta</h3>
    <div class="grupo-campo"><label>Paciente:</label><div class="campo">{{ paciente.nombre }}</div></div>
    <div class="grupo-campo"><label>Edad:</label><div class="campo">{{ paciente.edad }} años</div></div>
    <div class="grupo-campo"><label>Tipo de Sangre:</label><div class="campo">{{ paciente.tipoSangre || '--' }}</div></div>
    <div class="grupo-campo"><label>Alergias:</label><div class="campo">{{ paciente.alergias || 'Ninguna' }}</div></div>
    <div class="grupo-campo"><label>Peso:</label><div class="campo">{{ paciente.peso || '--' }} kg</div></div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  paciente: any;
}>();
</script>

<style scoped>
.panel-medico {
  flex: 1 1 300px;
  min-width: 280px;
  max-width: 500px;
  background: white;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
.panel-medico h3 {
  text-align: center;
  margin-bottom: 20px;
  color: var(--color-text-title);
  font-size: 1.3rem;
  font-family: var(--font-2);
}
.grupo-campo {
  margin-bottom: 15px;
}
.grupo-campo label {
  display: block;
  margin-bottom: 5px;
  color: var(--color-text-title);
  font-size: 0.95rem;
  font-family: var(--font-2);
}
.campo {
  width: 100%;
  background: var(--color-fondo-claro);
  border: 2px solid var(--color-quinary);
  border-radius: 10px;
  padding: 10px 14px;
  color: var(--color-text);
  font-size: 0.95rem;
  font-family: var(--font--body);
  font-weight: bold;
  box-sizing: border-box;
}
</style>