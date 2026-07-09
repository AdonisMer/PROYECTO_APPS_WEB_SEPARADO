<template>
  <div class="logout-button">
    <button @click="emit('cerrar')" class="btn-logout">
      <i class="fa-solid fa-right-from-bracket"></i> Cerrar Sesión
    </button>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  (e: 'cerrar'): void;
}>();
</script>

<style scoped>
.logout-button {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 15px;
}
.btn-logout {
  background: #ef4444;
  color: white;
  border: none;
  padding: 8px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.95rem;
  transition: 0.3s;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.btn-logout:hover {
  background: #dc2626;
  transform: scale(1.02);
}
</style>