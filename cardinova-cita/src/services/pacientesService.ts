import { supabase } from '../supabase/client';

export const obtenerPacientesSupabase = async () => {
    try {
        // 1. Obtener todos los usuarios con rol = 'paciente'
        const { data: usuarios, error } = await supabase
            .from('usuarios')
            .select('cedula, nombre, apellido, correo, rol, id_usuario')  // ← Incluir id_usuario
            .eq('rol', 'paciente');

        if (error) throw error;

        // 2. Obtener teléfonos de la tabla pacientes
        const { data: telefonos, error: errorTelefono } = await supabase
            .from('pacientes')
            .select('id_usuario, telefono');

        if (errorTelefono) console.warn('⚠️ No se pudo obtener teléfonos:', errorTelefono);

        // 3. Mapear teléfonos por id_usuario
        const telefonoMap: Record<string, string> = {};
        if (telefonos) {
            telefonos.forEach((item: any) => {
                telefonoMap[item.id_usuario] = item.telefono || '';
            });
        }

        // 4. FILTRAR Y FORMATEAR pacientes (solo los que tienen cedula y nombre)
        const pacientesFormateados = usuarios
            .filter((u: any) => u.cedula && u.cedula.length > 5 && u.nombre) // ← FILTRO AQUÍ
            .map((usuario: any) => ({
                cedula: usuario.cedula,
                nombre: `${usuario.nombre} ${usuario.apellido}`,
                correo: usuario.correo,
                telefono: telefonoMap[usuario.id_usuario] || '',
                // Datos clínicos locales (se completan desde localStorage)
                edad: null,
                tipo_sangre: null,
                alergias: 'Ninguna',
                peso: null,
                diagnostico: '',
                sintomas: [],
                medicamentos: ''
            }));

        console.log('✅ Pacientes cargados (solo pacientes):', pacientesFormateados.length);
        return { success: true, data: pacientesFormateados };
    } catch (error) {
        console.error('❌ Error al obtener pacientes:', error);
        return { success: false, error, data: [] };
    }
};