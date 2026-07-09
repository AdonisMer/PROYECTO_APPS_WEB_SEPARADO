import farmaciasData from '../data/farmacias.json';

export function useFarmacias() {
  const normalizar = (texto: string) => texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  const buscarFarmacias = (medicamento: string) => {
    const nombrePuro = medicamento.split(" (")[0].trim();
    const nombreBusqueda = normalizar(nombrePuro);

    const disponibles = farmaciasData
      .filter((f: any) =>
        f.medicamentos.some((m: any) => normalizar(m.nombre).includes(nombreBusqueda) && m.disponible === true)
      )
      .map((f: any) => {
        const med = f.medicamentos.find((m: any) => normalizar(m.nombre).includes(nombreBusqueda));
        return { ...f, precio: med ? med.precio : Infinity };
      })
      .sort((a: any, b: any) => {
        if (a.distancia !== b.distancia) return a.distancia - b.distancia;
        return a.precio - b.precio;
      });

    return disponibles;
  };

  return { buscarFarmacias };
}