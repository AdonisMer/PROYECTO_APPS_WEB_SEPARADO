<template>
  <div class="selector-paciente">
    <label for="pacienteSelect"><i class="fa-solid fa-user"></i> Seleccione un paciente:</label>
    <select
      id="pacienteSelect"
      :value="modelValue"
      @change="onChange"
      class="campo"
    >
      <option value="">-- Elija un paciente --</option>
      <option v-for="p in pacientes" :key="p.correo" :value="p.correo">
        {{ p.nombre }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  pacientes: any[];
  modelValue: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const onChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  emit('update:modelValue', target.value);
};
</script>

<style scoped>
.selector-paciente {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 15px;
  background: white;
  padding: 15px 25px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.06);
}
.selector-paciente label {
  font-weight: 600;
  font-size: 1.1rem;
  color: var(--color-text-title);
  display: flex;
  align-items: center;
  gap: 10px;
  white-space: nowrap;
}
.selector-paciente select {
  flex: 1;
  padding: 12px 18px;
  border-radius: 10px;
  border: 2px solid var(--color-quinary);
  font-size: 1rem;
  background: var(--color-fondo-claro);
  transition: 0.3s;
}
.selector-paciente select:focus {
  border-color: var(--color-accent);
  outline: none;
  box-shadow: 0 0 0 3px rgba(89, 139, 156, 0.2);
}
</style>