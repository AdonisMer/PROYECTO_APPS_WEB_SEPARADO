import { ref } from 'vue';
import pacientesData from '../data/pacientes.json';

export function usePacientes() {
  const pacientes = ref<any[]>([]);

  const cargarPacientes = () => {
    const guardados = JSON.parse(localStorage.getItem('pacientesClinica') || 'null');
    if (guardados && guardados.length > 0) {
      pacientes.value = guardados;
    } else {
      pacientes.value = pacientesData;
      localStorage.setItem('pacientesClinica', JSON.stringify(pacientesData));
    }
  };

  const guardarPacientes = () => {
    localStorage.setItem('pacientesClinica', JSON.stringify(pacientes.value));
  };

  const actualizarPaciente = (correo: string, data: any) => {
    const index = pacientes.value.findIndex(p => p.correo === correo);
    if (index !== -1) {
      pacientes.value[index] = { ...pacientes.value[index], ...data };
      guardarPacientes();
      return true;
    }
    return false;
  };

  const obtenerPaciente = (correo: string) => {
    return pacientes.value.find(p => p.correo === correo);
  };

  return { pacientes, cargarPacientes, guardarPacientes, actualizarPaciente, obtenerPaciente };
}