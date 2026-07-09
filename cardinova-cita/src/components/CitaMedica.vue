<template>
  <div class="cita-container">
    <BotonCerrarSesion @cerrar="cerrarSesion" />
    <PacienteSelector v-model="correoSeleccionado" :pacientes="pacientes" />
    <div v-if="correoSeleccionado" class="paneles-medicos">
      <InformacionPaciente :paciente="pacienteActual" />
      <DiagnosticoReceta
        :sintomas="sintomasActivos"
        :diagnostico="diagnosticoActual"
        :medicamentos="medicamentosRecetados"
        :listaSintomas="listaSintomas"
        :listaMedicamentos="listaMedicamentos"
        @update:diagnostico="actualizarDiagnostico"
        @agregarSintoma="agregarSintoma"
        @eliminarSintoma="eliminarSintoma"
        @agregarMedicamento="agregarMedicamento"
        @eliminarMedicamento="eliminarMedicamento"
        @buscarFarmacias="buscarFarmacias"
        @enviarReceta="enviarReceta"
        @exportarPDF="exportarPDF"
      />
    </div>
    <div v-else class="mensaje-sin-seleccion">
      <i class="fa-solid fa-user-plus"></i>
      <p>Seleccione un paciente para visualizar su información y gestionar su receta médica.</p>
    </div>
    <ModalFarmacias
      :visible="modalVisible"
      :medicamento="medicamentoBuscado"
      :farmacias="farmaciasEncontradas"
      @cerrar="modalVisible = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import BotonCerrarSesion from './BotonCerrarSesion.vue';
import PacienteSelector from './PacienteSelector.vue';
import InformacionPaciente from './InformacionPaciente.vue';
import DiagnosticoReceta from './DiagnosticoReceta.vue';
import ModalFarmacias from './ModalFarmacias.vue';
import { usePacientes } from '../composables/usePacientes';
import { useRecetas } from '../composables/useRecetas';
import { useFarmacias } from '../composables/useFarmacias';
import sintomasData from '../data/sintomas.json';
import medicamentosData from '../data/medicamentos_lista.json';

// ========== COMPOSABLES ==========
const { pacientes, cargarPacientes, actualizarPaciente, obtenerPaciente } = usePacientes();
const { guardarReceta } = useRecetas();
const { buscarFarmacias: buscarFarmaciasService } = useFarmacias();

// ========== ESTADO ==========
const correoSeleccionado = ref('');
const diagnosticoActual = ref('');
const sintomasActivos = ref<string[]>([]);
const medicamentosRecetados = ref<{ nombre: string; dosis: string; frecuencia: string }[]>([]);
const listaSintomas = ref<string[]>([]);
const listaMedicamentos = ref<string[]>([]);
const modalVisible = ref(false);
const medicamentoBuscado = ref('');
const farmaciasEncontradas = ref<any[]>([]);

// ========== COMPUTADOS ==========
const pacienteActual = computed(() => obtenerPaciente(correoSeleccionado.value));

// ========== GUARDAR CAMBIOS ==========
const guardarCambiosPaciente = () => {
  if (!correoSeleccionado.value) return;
  actualizarPaciente(correoSeleccionado.value, {
    diagnostico: diagnosticoActual.value,
    sintomasActivos: [...sintomasActivos.value],
    medicamentos: medicamentosRecetados.value
      .map(m => `${m.nombre} (${m.dosis} – ${m.frecuencia})`)
      .join(' • ')
  });
};

// ========== DIAGNÓSTICO ==========
const actualizarDiagnostico = (nuevoDiagnostico: string) => {
  diagnosticoActual.value = nuevoDiagnostico;
  guardarCambiosPaciente();
};

// ========== SÍNTOMAS ==========
const agregarSintoma = (sintoma: string) => {
  if (sintomasActivos.value.includes(sintoma)) {
    alert('Este síntoma ya ha sido agregado.');
    return;
  }
  sintomasActivos.value.push(sintoma);
  guardarCambiosPaciente();
};

const eliminarSintoma = (index: number) => {
  if (confirm(`¿Eliminar síntoma "${sintomasActivos.value[index]}"?`)) {
    sintomasActivos.value.splice(index, 1);
    guardarCambiosPaciente();
  }
};

// ========== MEDICAMENTOS ==========
const agregarMedicamento = (medicamento: { nombre: string; dosis: string; frecuencia: string }) => {
  const existe = medicamentosRecetados.value.some(
    m => m.nombre === medicamento.nombre && m.dosis === medicamento.dosis
  );
  if (existe) {
    alert('Este medicamento con esta dosis ya está agregado.');
    return;
  }
  medicamentosRecetados.value.push(medicamento);
  guardarCambiosPaciente();
};

const eliminarMedicamento = (index: number) => {
  const medicamento = medicamentosRecetados.value[index];
  if (confirm(`¿Eliminar medicamento "${medicamento.nombre}"?`)) {
    medicamentosRecetados.value.splice(index, 1);
    guardarCambiosPaciente();
    if (modalVisible.value && medicamentoBuscado.value === medicamento.nombre) {
      modalVisible.value = false;
    }
  }
};

// ========== FARMACIAS ==========
const buscarFarmacias = (nombreMedicamento: string) => {
  medicamentoBuscado.value = nombreMedicamento;
  farmaciasEncontradas.value = buscarFarmaciasService(nombreMedicamento);
  modalVisible.value = true;
};

// ========== RECETA ==========
const enviarReceta = () => {
  if (!pacienteActual.value) {
    alert('Selecciona un paciente primero.');
    return;
  }
  guardarReceta({
    paciente: pacienteActual.value.correo,
    nombrePaciente: pacienteActual.value.nombre,
    sintomas: [...sintomasActivos.value],
    diagnostico: diagnosticoActual.value,
    medicamentos: [...medicamentosRecetados.value],
    doctor: localStorage.getItem('nombreUsuario') || 'Doctor'
  });
  alert('✅ Receta enviada y guardada correctamente.');
};

// ========== PDF ==========
const exportarPDF = () => {
  if (!pacienteActual.value) {
    alert('Selecciona un paciente.');
    return;
  }
  const p = pacienteActual.value;
  const contenido = `
    <html>
      <head>
        <title>Receta Médica - Cardinova</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 30px; max-width: 800px; margin: auto; }
          h1 { color: #1F4E5F; border-bottom: 2px solid #1F4E5F; padding-bottom: 10px; }
          .datos { background: #f5f7fa; padding: 15px; border-radius: 8px; }
          .seccion { margin-top: 20px; }
          .seccion h2 { color: #2c3e50; font-size: 18px; }
          ul { padding-left: 20px; }
          li { margin: 5px 0; }
          .footer { margin-top: 40px; font-size: 12px; color: #888; text-align: center; border-top: 1px solid #ddd; padding-top: 10px; }
        </style>
      </head>
      <body>
        <h1>🏥 Cardinova - Receta Médica</h1>
        <div class="datos">
          <p><strong>Paciente:</strong> ${p.nombre}</p>
          <p><strong>Edad:</strong> ${p.edad} años</p>
          <p><strong>Fecha:</strong> ${new Date().toLocaleString()}</p>
        </div>
        <div class="seccion">
          <h2>📋 Síntomas</h2>
          <ul>${sintomasActivos.value.map(s => `<li>${s}</li>`).join('') || '<li>No registrados</li>'}</ul>
        </div>
        <div class="seccion">
          <h2>📝 Diagnóstico</h2>
          <p>${diagnosticoActual.value || 'No especificado'}</p>
        </div>
        <div class="seccion">
          <h2>💊 Medicamentos</h2>
          <ul>${medicamentosRecetados.value.map(m => `<li>${m.nombre} ${m.dosis} – ${m.frecuencia}</li>`).join('') || '<li>No recetados</li>'}</ul>
        </div>
        <div class="footer">
          <p>Cardinova - Sistema de Gestión Médica</p>
          <p>www.cardinova.com</p>
        </div>
      </body>
    </html>
  `;
  const ventana = window.open('', '_blank', 'width=800,height=600');
  if (ventana) {
    ventana.document.write(contenido);
    ventana.document.close();
    ventana.print();
  } else {
    alert('No se pudo abrir la ventana de impresión.');
  }
};

// ========== CERRAR SESIÓN ==========
const cerrarSesion = () => {
  if (confirm('¿Cerrar sesión?')) {
    localStorage.removeItem('sesionActiva');
    localStorage.removeItem('rolUsuario');
    localStorage.removeItem('nombreUsuario');
    window.location.reload();
  }
};

// ========== WATCHERS ==========
watch(correoSeleccionado, (nuevo) => {
  const p = obtenerPaciente(nuevo);
  if (!p) {
    medicamentosRecetados.value = [];
    return;
  }
  
  diagnosticoActual.value = p.diagnostico || '';
  sintomasActivos.value = p.sintomasActivos || [];
  
  // Intentar cargar medicamentos
  try {
    const medicamentosStr = p.medicamentos || '';
    if (typeof medicamentosStr === 'string' && medicamentosStr.trim()) {
      const items = medicamentosStr.split('•').filter(s => s.trim());
      medicamentosRecetados.value = items.map(item => {
        const trimmed = item.trim();
        const match = trimmed.match(/^(.+?)\s*\((.+?)\s*–\s*(.+?)\)$/);
        if (match) {
          return { nombre: match[1].trim(), dosis: match[2].trim(), frecuencia: match[3].trim() };
        }
        return { nombre: trimmed, dosis: '', frecuencia: '' };
      }).filter(m => m.nombre && m.nombre.trim());
    } else {
      medicamentosRecetados.value = [];
    }
  } catch (error) {
    console.error('Error cargando medicamentos:', error);
    medicamentosRecetados.value = [];
  }
});

// ========== INICIALIZACIÓN ==========
onMounted(() => {
  listaSintomas.value = sintomasData;
  listaMedicamentos.value = medicamentosData;
  cargarPacientes();
});
</script>

<style scoped>
.cita-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}
.paneles-medicos {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 25px;
  width: 100%;
  margin-top: 0;
}
.mensaje-sin-seleccion {
  text-align: center;
  padding: 40px 20px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.06);
}
.mensaje-sin-seleccion i {
  font-size: 3rem;
  color: var(--color-accent);
  margin-bottom: 15px;
}
.mensaje-sin-seleccion p {
  font-size: 1.1rem;
  color: var(--color-text);
}
@media (max-width: 991px) {
  .paneles-medicos {
    flex-direction: column;
    align-items: center;
  }
}
@media (max-width: 768px) {
  .cita-container {
    padding: 0 10px;
  }
}
</style>