export function useRecetas() {
  const guardarReceta = (datos: any) => {
    const historial = JSON.parse(localStorage.getItem('historialRecetas') || '[]');
    historial.push({
      ...datos,
      fecha: new Date().toLocaleString()
    });
    localStorage.setItem('historialRecetas', JSON.stringify(historial));
  };

  const obtenerRecetas = () => {
    return JSON.parse(localStorage.getItem('historialRecetas') || '[]');
  };

  return { guardarReceta, obtenerRecetas };
}