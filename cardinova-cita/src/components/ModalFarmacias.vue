<template>
  <div v-if="visible" class="modal-overlay" @click.self="emit('cerrar')">
    <div class="modal-contenido">
      <div class="modal-cabecera">
        <h3><i class="fa-solid fa-pills"></i> Disponible en: {{ medicamento }}</h3>
        <button @click="emit('cerrar')" class="btn-cerrar">✕</button>
      </div>
      <div class="modal-cuerpo">
        <div v-for="f in farmacias" :key="f.nombre" class="tarjeta-farmacia-mini">
          <h4><i class="fa-solid fa-house-medical"></i> {{ f.nombre }}</h4>
          <p>{{ f.direccion }} ({{ f.distancia }} km)</p>
          <p style="color:#22c55e; font-weight:bold;">Precio: ${{ f.precio !== Infinity ? f.precio.toFixed(2) : 'Consultar' }}</p>
        </div>
        <p v-if="farmacias.length === 0" style="text-align:center; color:#ef4444;">No hay farmacias con stock disponible.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  visible: boolean;
  medicamento: string;
  farmacias: any[];
}>();

const emit = defineEmits<{
  (e: 'cerrar'): void;
}>();
</script>