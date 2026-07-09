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