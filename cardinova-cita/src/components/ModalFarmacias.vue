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

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}
.modal-contenido {
  background: white;
  border-radius: 20px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
  padding: 25px;
  box-shadow: 0 15px 30px rgba(0,0,0,0.2);
  animation: modalAparecer 0.3s ease;
}
@keyframes modalAparecer {
  from { transform: translateY(-30px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
.modal-cabecera {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid var(--color-fondo-claro);
  padding-bottom: 15px;
  margin-bottom: 15px;
}
.modal-cabecera h3 {
  color: var(--color-nav);
  font-family: var(--font-2);
  font-size: 1.1rem;
  margin: 0;
}
.btn-cerrar {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #ef4444;
  cursor: pointer;
  transition: 0.3s;
}
.btn-cerrar:hover {
  transform: scale(1.2);
}
.modal-cuerpo {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.tarjeta-farmacia-mini {
  background: var(--color-fondo-claro);
  border-radius: 12px;
  padding: 15px;
  border: 1px solid var(--color-quinary);
}
.tarjeta-farmacia-mini h4 {
  margin: 0 0 5px 0;
  color: var(--color-text-title);
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 8px;
}
.tarjeta-farmacia-mini p {
  margin: 3px 0;
  font-size: 0.9rem;
  color: var(--color-text);
}
</style>