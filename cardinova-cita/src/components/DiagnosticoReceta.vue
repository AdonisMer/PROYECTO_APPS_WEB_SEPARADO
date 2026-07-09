<template>
  <div class="panel-medico">
    <h3>Diagnóstico y Receta</h3>

    <!-- Síntomas -->
    <div class="grupo-campo">
      <label>Síntomas Observados:</label>
      <div class="controles-agregar">
        <select v-model="sintomaTemporal" class="campo">
          <option value="">Seleccione un síntoma...</option>
          <option v-for="s in listaSintomas" :key="s" :value="s">{{ s }}</option>
        </select>
        <button @click="agregarSintoma" class="btn-add">+</button>
      </div>
      <div class="contenedor-etiquetas">
        <div v-for="(s, index) in sintomas" :key="index" class="etiqueta-item">
          <span>{{ s }}</span>
          <button @click="eliminarSintoma(index)" class="btn-eliminar-etiqueta">x</button>
        </div>
      </div>
    </div>

    <!-- Diagnóstico -->
    <div class="grupo-campo">
      <div class="encabezado-campo">
        <label>Diagnóstico:</label>
        <button v-if="!modoEdicion" @click="habilitarEdicion" class="btn-accion-pequeno">Editar</button>
        <button v-else @click="guardarDiagnosticoManual" class="btn-accion-pequeno" style="color: #22c55e;">
          <i class="fa-solid fa-check"></i> Guardar
        </button>
      </div>
      <div ref="cajaDiagnostico" class="campo area" :contenteditable="modoEdicion" @blur="guardarDiagnostico">
        {{ diagnostico }}
      </div>
    </div>

    <!-- Medicamentos -->
    <div class="grupo-campo">
      <label>Medicamentos Recetados:</label>
      <div class="controles-agregar-med">
        <select v-model="medicamentoSeleccionado" class="campo" style="flex: 2;">
          <option value="">Seleccione medicamento...</option>
          <option v-for="opcion in medicamentosOpciones" :key="opcion.valor" :value="opcion.valor">
            {{ opcion.nombre }}
          </option>
        </select>
        <input 
          v-model.number="medicamentoDosisNumero" 
          class="campo" 
          placeholder="Dosis (ej: 50)" 
          style="flex: 1;" 
          type="number" 
          min="0"
        />
        <select v-model="medicamentoFrecuencia" class="campo" style="flex: 1.5;">
          <option value="">Frecuencia</option>
          <option value="cada 8h">cada 8h</option>
          <option value="cada 12h">cada 12h</option>
          <option value="diario">diario</option>
          <option value="semanal">semanal</option>
          <option value="según necesite">según necesite</option>
        </select>
        <button @click="agregarMedicamento" class="btn-add">+</button>
      </div>
      <div class="contenedor-etiquetas">
        <div v-for="(med, index) in medicamentos" :key="index" class="etiqueta-item" @click="buscar(med.nombre)" style="cursor: pointer;">
          <span>{{ med.nombre }} {{ med.dosis }} – {{ med.frecuencia }}</span>
          <button @click.stop="emit('eliminarMedicamento', index)" class="btn-eliminar-etiqueta">x</button>
        </div>
      </div>
    </div>

    <div class="contenedor-acciones-receta">
      <button @click="emit('enviarReceta')" class="btn-accion-receta-compacto">
        <i class="fa-solid fa-paper-plane"></i> Enviar receta
      </button>
      <button @click="emit('exportarPDF')" class="btn-accion-receta-compacto" style="margin-left: 10px;">
        <i class="fa-solid fa-file-pdf"></i> PDF
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, computed } from 'vue';

// ========== PROPS ==========
const props = defineProps<{
  sintomas: string[];
  diagnostico: string;
  medicamentos: { nombre: string; dosis: string; frecuencia: string }[];
  listaSintomas: string[];
  listaMedicamentos: string[];
}>();

// ========== EMITS ==========
const emit = defineEmits<{
  (e: 'update:diagnostico', value: string): void;
  (e: 'agregarSintoma', value: string): void;
  (e: 'eliminarSintoma', index: number): void;
  (e: 'agregarMedicamento', medicamento: { nombre: string; dosis: string; frecuencia: string }): void;
  (e: 'eliminarMedicamento', index: number): void;
  (e: 'buscarFarmacias', medicamento: string): void;
  (e: 'enviarReceta'): void;
  (e: 'exportarPDF'): void;
}>();

// ========== ESTADO LOCAL ==========
const sintomaTemporal = ref('');
const medicamentoSeleccionado = ref('');
const medicamentoDosisNumero = ref<number | null>(null);
const medicamentoFrecuencia = ref('');
const cajaDiagnostico = ref<HTMLElement | null>(null);
const modoEdicion = ref(false);

// ========== COMPUTED ==========
const medicamentosOpciones = computed(() => {
  return props.listaMedicamentos.map((item: string) => {
    const match = item.match(/^(.+?)\s*\(/);
    const nombre = match ? match[1].trim() : item;
    return { nombre, valor: item };
  });
});

const dosisConUnidad = computed(() => {
  return medicamentoDosisNumero.value !== null && medicamentoDosisNumero.value > 0
    ? `${medicamentoDosisNumero.value}mg`
    : '';
});

// ========== FUNCIONES AUXILIARES ==========
const extraerNombre = (valorCompleto: string): string => {
  const match = valorCompleto.match(/^(.+?)\s*\(/);
  return match ? match[1].trim() : valorCompleto;
};

// ========== SÍNTOMAS ==========
const agregarSintoma = () => {
  if (!sintomaTemporal.value) return;
  emit('agregarSintoma', sintomaTemporal.value);
  sintomaTemporal.value = '';
};

const eliminarSintoma = (index: number) => {
  emit('eliminarSintoma', index);
};

// ========== DIAGNÓSTICO ==========
const habilitarEdicion = () => {
  modoEdicion.value = true;
  nextTick(() => cajaDiagnostico.value?.focus());
};

const guardarDiagnosticoManual = () => {
  if (cajaDiagnostico.value) {
    const nuevo = cajaDiagnostico.value.innerText.trim();
    emit('update:diagnostico', nuevo);
    modoEdicion.value = false;
  }
};

const guardarDiagnostico = (e: Event) => {
  modoEdicion.value = false;
  const nuevo = (e.target as HTMLElement).innerText.trim();
  emit('update:diagnostico', nuevo);
};

// ========== MEDICAMENTOS ==========
const agregarMedicamento = () => {
  if (!medicamentoSeleccionado.value || !medicamentoDosisNumero.value || !medicamentoFrecuencia.value) {
    alert('Completa todos los campos del medicamento.');
    return;
  }
  const nombreLimpio = extraerNombre(medicamentoSeleccionado.value);
  emit('agregarMedicamento', {
    nombre: nombreLimpio,
    dosis: dosisConUnidad.value,  // <-- Usamos el computed que agrega "mg"
    frecuencia: medicamentoFrecuencia.value
  });
  // Limpiar campos
  medicamentoSeleccionado.value = '';
  medicamentoDosisNumero.value = null;
  medicamentoFrecuencia.value = '';
};

const buscar = (nombre: string) => {
  emit('buscarFarmacias', nombre);
};
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
.area {
  min-height: 70px;
  line-height: 1.6;
}
.encabezado-campo {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}
.btn-accion-pequeno {
  background: none;
  border: none;
  color: var(--color-accent);
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: bold;
  padding: 2px 8px;
  border-radius: 5px;
  transition: 0.3s;
}
.btn-accion-pequeno:hover {
  background: var(--color-primary);
}
.controles-agregar {
  display: flex;
  gap: 10px;
  margin-bottom: 8px;
}
.controles-agregar-med {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
  flex-wrap: wrap;
}
.controles-agregar-med .campo {
  flex: 1;
  min-width: 80px;
}
.btn-add {
  background: var(--color-nav);
  color: white;
  border: none;
  border-radius: 10px;
  padding: 0 15px;
  cursor: pointer;
  transition: 0.3s;
  font-size: 1.2rem;
}
.btn-add:hover {
  background: var(--color-accent);
}
.contenedor-etiquetas {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  min-height: 40px;
  background: var(--color-fondo-claro);
  border: 2px dashed var(--color-quinary);
  border-radius: 10px;
  padding: 8px;
}
.etiqueta-item {
  background: var(--color-nav);
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  transition: transform 0.2s;
}
.etiqueta-item:hover {
  transform: scale(1.03);
}
.btn-eliminar-etiqueta {
  background: none;
  border: none;
  color: #ffb3b3;
  cursor: pointer;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  padding: 0 2px;
}
.btn-eliminar-etiqueta:hover {
  color: white;
}
.contenedor-acciones-receta {
  display: flex;
  justify-content: flex-end;
  margin-top: 15px;
}
.btn-accion-receta-compacto {
  padding: 10px 20px;
  background: var(--color-nav);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: 0.3s;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.btn-accion-receta-compacto:hover {
  background: var(--color-accent);
  transform: scale(1.02);
}
</style>