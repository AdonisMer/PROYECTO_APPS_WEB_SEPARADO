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

// ========== GUARDAR CAMBIOS (CON LOGS - PASO 2) ==========
const guardarCambiosPaciente = () => {
  console.log('🔄 guardarCambiosPaciente ejecutado');
  if (!correoSeleccionado.value) {
    console.warn('⚠️ No hay paciente seleccionado');
    return;
  }
  
  const datos = {
    diagnostico: diagnosticoActual.value,
    sintomas: [...sintomasActivos.value],
    medicamentos: medicamentosRecetados.value
      .map(m => `${m.nombre} (${m.dosis} – ${m.frecuencia})`)
      .join(' • ')
  };
  
  console.log('📤 Datos a guardar:', datos);
  actualizarPaciente(correoSeleccionado.value, datos);
};

const guardarEstadoLocal = () => {
  if (!pacienteActual.value) return;
  const cedula = pacienteActual.value.cedula;
  const estado = {
    diagnostico: diagnosticoActual.value,
    sintomas: [...sintomasActivos.value],
    medicamentos: medicamentosRecetados.value
  };
  localStorage.setItem(`estado_paciente_${cedula}`, JSON.stringify(estado));
  console.log('💾 Estado guardado en localStorage para:', pacienteActual.value.nombre);
};

const cargarEstadoLocal = (cedula: string) => {
  const data = localStorage.getItem(`estado_paciente_${cedula}`);
  if (data) {
    try {
      const estado = JSON.parse(data);
      diagnosticoActual.value = estado.diagnostico || '';
      sintomasActivos.value = estado.sintomas || [];
      medicamentosRecetados.value = estado.medicamentos || [];
      console.log('📂 Estado cargado desde localStorage para:', cedula);
      return true;
    } catch (error) {
      console.error('❌ Error al parsear estado local:', error);
      return false;
    }
  }
  return false;
};

// ========== DIAGNÓSTICO ==========
const actualizarDiagnostico = (nuevoDiagnostico: string) => {
  diagnosticoActual.value = nuevoDiagnostico;
  guardarEstadoLocal();
};

// ========== SÍNTOMAS ==========
const agregarSintoma = (sintoma: string) => {
  if (sintomasActivos.value.includes(sintoma)) {
    alert('Este síntoma ya ha sido agregado.');
    return;
  }
  sintomasActivos.value.push(sintoma);
  guardarEstadoLocal();
};

const eliminarSintoma = (index: number) => {
  if (confirm(`¿Eliminar síntoma "${sintomasActivos.value[index]}"?`)) {
    sintomasActivos.value.splice(index, 1);
    guardarEstadoLocal();
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
  guardarEstadoLocal();
};

const eliminarMedicamento = (index: number) => {
  const medicamento = medicamentosRecetados.value[index];
  if (confirm(`¿Eliminar medicamento "${medicamento.nombre}"?`)) {
    medicamentosRecetados.value.splice(index, 1);
    guardarEstadoLocal();
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
const enviarReceta = async () => {
  if (!pacienteActual.value) {
    alert('Selecciona un paciente primero.');
    return;
  }

  const p = pacienteActual.value;

  // Guardar estado local antes de enviar (para que persista al recargar)
  guardarEstadoLocal();

  // Datos para Supabase (coinciden con la tabla)
  const datos = {
    paciente: p.nombre,                    // nombre del paciente
    fecha: new Date().toISOString().split('T')[0], // YYYY-MM-DD
    diagnostico: diagnosticoActual.value || 'Sin diagnóstico',
    medicamentos: medicamentosRecetados.value.map(med => ({
      nombre: `${med.nombre} ${med.dosis}`, // Ej: "Losartán 50mg"
      cantidad: 1
    }))
  };

  console.log('📤 Receta a enviar:', datos);

  const result = await guardarReceta(datos);

  if (result.success) {
    alert('✅ Receta enviada y guardada en la nube.');
  } else {
    console.error('❌ Error al guardar en Supabase:', result.error);
    alert('⚠️ Receta guardada localmente, pero hubo error en la nube.');
  }
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
  
  // Intentar cargar el estado desde localStorage usando la función
  const cargado = cargarEstadoLocal(p.cedula);
  
  if (!cargado) {
    // Si no hay estado guardado, inicializar vacío
    diagnosticoActual.value = '';
    sintomasActivos.value = [];
    medicamentosRecetados.value = [];
    console.log('🆕 No hay estado previo para el paciente, iniciando vacío');
  }
});

// ========== INICIALIZACIÓN ==========
onMounted(async () => {
  listaSintomas.value = sintomasData;
  listaMedicamentos.value = medicamentosData;
  await cargarPacientes();
});
</script>

<style scoped>
/* Los estilos ahora están en cita-componentes.css */
</style>