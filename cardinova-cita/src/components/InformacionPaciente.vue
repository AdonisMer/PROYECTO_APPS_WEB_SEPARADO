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