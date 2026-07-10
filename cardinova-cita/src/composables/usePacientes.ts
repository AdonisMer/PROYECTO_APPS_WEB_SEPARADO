import { ref } from 'vue';
import { obtenerPacientesSupabase } from '../services/pacientesService';
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
                console.warn('⚠️ No hay pacientes en Supabase, cargando desde JSON...');
                pacientes.value = pacientesData;
            }
        } catch (error) {
            console.error('❌ Error al cargar pacientes:', error);
            pacientes.value = pacientesData;
        }
        cargando.value = false;
    };

    // ============================================
    // ACTUALIZAR PACIENTE (YA NO USA SUPABASE)
    // ============================================
    const actualizarPaciente = async (correo: string, datos: any) => {
        console.warn('⚠️ actualizarPaciente está obsoleto. Los cambios clínicos se guardan en localStorage.');
        // Solo actualizar el array local si existe
        const index = pacientes.value.findIndex(p => p.correo === correo);
        if (index !== -1) {
            pacientes.value[index] = { ...pacientes.value[index], ...datos };
        }
        return true;
    };

    const obtenerPaciente = (correo: string) => {
        return pacientes.value.find(p => p.correo === correo);
    };

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