import { ref } from 'vue';

export function useModal() {
  const modalRef = ref<HTMLElement | null>(null);
  const tituloRef = ref<HTMLElement | null>(null);
  const listaRef = ref<HTMLElement | null>(null);
  const btnCerrarRef = ref<HTMLElement | null>(null);

  const abrirModal = (titulo: string, contenido: string) => {
    if (!modalRef.value || !tituloRef.value || !listaRef.value) return;
    tituloRef.value.innerHTML = titulo;
    listaRef.value.innerHTML = contenido;
    modalRef.value.classList.remove('modal-oculto');
    modalRef.value.classList.add('modal-mostrar');
  };

  const cerrarModal = () => {
    if (!modalRef.value) return;
    modalRef.value.classList.remove('modal-mostrar');
    modalRef.value.classList.add('modal-oculto');
  };

  return { modalRef, tituloRef, listaRef, btnCerrarRef, abrirModal, cerrarModal };
}