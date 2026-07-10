import { guardarRecetaSupabase, obtenerRecetasSupabase, obtenerRecetasPorPaciente } from '../services/recetasService';

export function useRecetas() {
  const guardarReceta = async (datos: {
    paciente: string;
    fecha: string;
    diagnostico: string;
    medicamentos: { nombre: string; cantidad: number }[];
  }) => {
    // Guardar localmente (backup)
    try {
      const historial = JSON.parse(localStorage.getItem('historialRecetas') || '[]');
      historial.push({
        paciente: datos.paciente,
        fecha: datos.fecha,
        diagnostico: datos.diagnostico,
        medicamentos: datos.medicamentos
      });
      localStorage.setItem('historialRecetas', JSON.stringify(historial));
    } catch (error) {
      console.warn('⚠️ Error guardando localmente:', error);
    }

    // Guardar en Supabase
    const result = await guardarRecetaSupabase({
      paciente: datos.paciente,
      fecha: datos.fecha,
      diagnostico: datos.diagnostico,
      medicamentos: datos.medicamentos
    });

    return result;
  };

  // ============================================
    // OBTENER TODAS LAS RECETAS (desde Supabase)
    // ============================================
    const obtenerRecetas = async () => {
        const result = await obtenerRecetasSupabase();
        return result;
    };

    // ============================================
    // OBTENER RECETAS DE UN PACIENTE ESPECÍFICO
    // ============================================
    const obtenerRecetasDePaciente = async (nombre: string) => {
        const result = await obtenerRecetasPorPaciente(nombre);
        return result;
    };

    // ============================================
    // OBTENER RECETAS LOCALES (backup)
    // ============================================
    const obtenerRecetasLocales = () => {
        return JSON.parse(localStorage.getItem('historialRecetas') || '[]');
    };

    // ============================================
    // RETORNAR TODAS LAS FUNCIONES
    // ============================================
    return {
        guardarReceta,
        obtenerRecetas,           // ← Esta es la que necesitas
        obtenerRecetasDePaciente,
        obtenerRecetasLocales
    };
}