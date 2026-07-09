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