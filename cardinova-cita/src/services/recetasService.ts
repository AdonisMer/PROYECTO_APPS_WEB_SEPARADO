import { supabase } from '../supabase/client';

export const guardarRecetaSupabase = async (recetaData: {
  paciente: string;
  fecha: string;
  diagnostico: string;
  medicamentos: { nombre: string; cantidad: number }[];
}) => {
  try {
    const { data, error } = await supabase
      .from('recetas')
      .insert([{
        paciente: recetaData.paciente,
        fecha: recetaData.fecha,
        diagnostico: recetaData.diagnostico,
        medicamentos: recetaData.medicamentos
      }])
      .select();

    if (error) throw error;
    console.log('✅ Receta guardada en Supabase:', data);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Error al guardar en Supabase:', error);
    return { success: false, error };
  }
};

export const obtenerRecetasSupabase = async () => {
  try {
    const { data, error } = await supabase
      .from('recetas')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('❌ Error al obtener recetas:', error);
    return { success: false, error, data: [] };
  }
};

export const obtenerRecetasPorPaciente = async (nombre: string) => {
  try {
    const { data, error } = await supabase
      .from('recetas')
      .select('*')
      .eq('paciente', nombre)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('❌ Error al obtener recetas:', error);
    return { success: false, error, data: [] };
  }
};