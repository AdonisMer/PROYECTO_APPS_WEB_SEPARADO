import { ref } from 'vue';
import { obtenerPacientesSupabase, actualizarPacienteSupabase } from '../services/pacientesService';
import pacientesData from '../data/pacientes.json';

export function usePacientes() {
    const pacientes = ref<any[]>([]);
    const cargando = ref(false);

    const cargarPacientes = async () => {
        cargando.value = true;
        try {
            const result = await obtenerPacientesSupabase();
            if (result.success && result.data && result.data.length > 0) {
                pacientes.value = result.data;
                console.log('✅ Pacientes cargados desde Supabase:', pacientes.value.length);
            } else {
                // ⚠️ Fallback: usar JSON local
                console.warn('⚠️ No hay datos en Supabase o error, cargando desde JSON...');
                pacientes.value = pacientesData;
                console.log('📂 Pacientes cargados desde JSON:', pacientes.value.length);
            }
        } catch (error) {
            console.error('❌ Error al cargar pacientes:', error);
            // Fallback a JSON en caso de error
            pacientes.value = pacientesData;
            console.log('📂 Pacientes cargados desde JSON (fallback por error).');
        }
        cargando.value = false;
    };

    // ============================================
    // ACTUALIZAR PACIENTE
    // ============================================
    const actualizarPaciente = async (correo: string, datos: any) => {
        console.log('🔄 actualizarPaciente llamado con:', correo, datos);
        const paciente = pacientes.value.find(p => p.correo === correo);
        if (!paciente) {
            console.warn('⚠️ Paciente no encontrado:', correo);
            return false;
        }

        console.log('📤 Enviando a Supabase:', { cedula: paciente.cedula, ...datos });

        const result = await actualizarPacienteSupabase(paciente.cedula, datos);
        if (result.success) {
            const index = pacientes.value.findIndex(p => p.correo === correo);
            if (index !== -1) {
                pacientes.value[index] = { ...pacientes.value[index], ...datos };
            }
            console.log('✅ Paciente actualizado en Supabase y en caché local');
            return true;
        } else {
            console.error('❌ Error al actualizar paciente:', result.error);
            return false;
        }
    };

    // ============================================
    // OBTENER PACIENTE POR CORREO
    // ============================================
    const obtenerPaciente = (correo: string) => {
        return pacientes.value.find(p => p.correo === correo);
    };

    // ============================================
    // GUARDAR PACIENTES (obsoleto, compatibilidad)
    // ============================================
    const guardarPacientes = () => {
        console.warn('⚠️ guardarPacientes está obsoleto.');
    };

    return {
        pacientes,
        cargando,
        cargarPacientes,
        guardarPacientes,
        actualizarPaciente,
        obtenerPaciente
    };
}