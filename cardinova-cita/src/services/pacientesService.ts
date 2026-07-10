import { supabase } from '../supabase/client';

// ============================================
// OBTENER TODOS LOS PACIENTES
// ============================================
export const obtenerPacientesSupabase = async () => {
    try {
        const { data, error } = await supabase
            .from('pacientes')
            .select('*')
            .order('nombre');

        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('❌ Error al obtener pacientes:', error);
        return { success: false, error, data: [] };
    }
};

// ============================================
// ACTUALIZAR UN PACIENTE POR CÉDULA
// ============================================
export const actualizarPacienteSupabase = async (cedula: string, datos: any) => {
    try {
        const { data, error } = await supabase
            .from('pacientes')
            .update(datos)
            .eq('cedula', cedula)
            .select();

        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('❌ Error al actualizar paciente:', error);
        return { success: false, error };
    }
};

// ============================================
// CREAR UN NUEVO PACIENTE
// ============================================
export const crearPacienteSupabase = async (paciente: any) => {
    try {
        const { data, error } = await supabase
            .from('pacientes')
            .insert([paciente])
            .select(); // Esto devuelve el registro insertado

        if (error) throw error;
        return { success: true, data: data || [] };
    } catch (error) {
        console.error('❌ Error al crear paciente:', error);
        return { success: false, error, data: [] };
    }
};

// ============================================
// ELIMINAR PACIENTE (opcional, solo si lo usas)
// ============================================
export const eliminarPacienteSupabase = async (cedula: string) => {
    try {
        const { error } = await supabase
            .from('pacientes')
            .delete()
            .eq('cedula', cedula);

        if (error) throw error;
        return { success: true };
    } catch (error) {
        console.error('❌ Error al eliminar paciente:', error);
        return { success: false, error };
    }
};