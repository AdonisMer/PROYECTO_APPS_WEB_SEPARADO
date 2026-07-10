import { supabase } from '../supabase/client';

// ============================================
// GUARDAR RECETA (INSERT o UPDATE)
// ============================================
export const guardarRecetaSupabase = async (recetaData: {
    paciente: string;
    fecha: string;
    diagnostico: string;
    medicamentos: any[];
}) => {
    try {
        // 1. Buscar si ya existe una receta para este paciente
        const { data: recetaExistente, error: buscarError } = await supabase
            .from('recetas')
            .select('id')
            .eq('paciente', recetaData.paciente)
            .order('created_at', { ascending: false })
            .limit(1);

        if (buscarError) throw buscarError;

        let result;

        if (recetaExistente && recetaExistente.length > 0) {
            // 2a. Si existe, ACTUALIZAR la última receta
            const id = recetaExistente[0].id;
            const { data, error } = await supabase
                .from('recetas')
                .update({
                    fecha: recetaData.fecha,
                    diagnostico: recetaData.diagnostico,
                    medicamentos: recetaData.medicamentos
                })
                .eq('id', id)
                .select();

            if (error) throw error;
            result = data;
            console.log('✅ Receta ACTUALIZADA en Supabase (ID:', id, ')');
        } else {
            // 2b. Si no existe, INSERTAR nueva receta
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
            result = data;
            console.log('✅ Nueva receta INSERTADA en Supabase');
        }

        return { success: true, data: result };
    } catch (error) {
        console.error('❌ Error al guardar receta:', error);
        return { success: false, error };
    }
};

// ============================================
// OBTENER TODAS LAS RECETAS
// ============================================
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

// ============================================
// OBTENER RECETAS DE UN PACIENTE
// ============================================
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