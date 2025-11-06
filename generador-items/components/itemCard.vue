<template>
  <Transition name="modal-fade">
    
    <div 
      v-if="selectedItem" 
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div 
        @click="closeModal" 
        class="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm"
      ></div>
      
      <div class="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col animate-modal-scale-in">
        
        <header class="flex justify-between items-center p-6 border-b border-gray-200">
          <h3 class="text-2xl font-bold text-blue-800">{{ selectedItem.title }}</h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-700 transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </header>
        
        <div class="p-8 overflow-y-auto space-y-6">
          <ItemSection title="CONTEXTO" :content="selectedItem.contexto" />
          <ItemSection title="REACTIVO" :content="selectedItem.reactivo" />
          <ItemSection title="OPCIONES DE RESPUESTA" :content="selectedItem.opciones" />
          <ItemSection title="RESPUESTA CORRECTA" :content="selectedItem.respuestaCorrecta" is-bold />
          <ItemSection title="SUSTENTACIÓN BIBLIOGRÁFICA" :content="selectedItem.sustentacion" />
          
          <div v-if="selectedItem.ajusteMetodologico" class="mt-4">
            <h4 class="label-text text-gray-800">AJUSTE METODOLÓGICO DEL ÍTEM</h4>
            <div class="bg-gray-100 p-4 rounded-md whitespace-pre-wrap font-mono text-sm" v-html="formatHtml(selectedItem.ajusteMetodologico)"></div>
          </div>
        </div>

        <footer class="flex justify-between items-center p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
          <small class="text-gray-500">Creado: {{ selectedItem.createdDate }}</small>
          <div class="flex gap-3">
            
            <button 
              @click="onSave" 
              :disabled="selectedItem.isSaved" 
              class="btn-secondary !bg-green-600 hover:!bg-green-700">
              {{ selectedItem.isSaved ? 'Guardado' : 'Guardar' }}
            </button>
            
            <button 
              @click="onDelete" 
              class="btn-secondary !bg-gray-500 hover:!bg-gray-600">
              Eliminar
            </button>
            
          </div>
        </footer>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed, h, defineComponent } from 'vue';
import { useGeneratorStore } from '../stores/generator';

const store = useGeneratorStore();

// Obtenemos el item seleccionado directamente del store
const selectedItem = computed(() => store.getSelectedItem);

// --- ACCIONES ---
const closeModal = () => {
  store.selectItem(null);
};

const onSave = () => {
  if (selectedItem.value) {
    store.saveItem(selectedItem.value.id);
  }
};

const onDelete = () => {
  if (selectedItem.value) {
    const confirmed = confirm('¿Estás seguro de que deseas eliminar este ítem?');
    if (confirmed) {
      store.deleteItem(selectedItem.value.id);
      closeModal(); // Cierra el modal después de borrar
    }
  }
};

// --- Formateo de HTML (como antes) ---
const formatHtml = (text: string | undefined) => {
  if (!text) return '';
  return text.replace(/\n/g, '<br />');
};

// --- Componente interno para las Secciones (como antes) ---
const ItemSection = defineComponent({
  props: {
    title: String,
    content: String,
    isBold: { type: Boolean, default: false }
  },
  setup(props) {
    return () => (
      props.content ? h('div', [
        h('h4', { class: 'label-text text-gray-800 font-bold mb-2' }, props.title),
        h('div', { 
          class: `prose prose-sm max-w-none ${props.isBold ? 'font-semibold' : ''}`,
          innerHTML: formatHtml(props.content) 
        })
      ]) : null
    );
  }
});
</script>

<style scoped>
/* Estilos para el Label (re-definido aquí para ItemSection) */
.label-text {
  @apply block text-sm font-semibold text-gray-700 mb-1 uppercase tracking-wider;
}

/* --- CAMBIO DE COLOR AQUÍ --- */
/* Estilo base para los botones del Footer (SIN COLOR BASE) */
.btn-secondary {
  @apply py-2 px-4 text-white font-semibold rounded-lg shadow-md
         transition-all duration-200 ease-in-out
         disabled:opacity-50 disabled:cursor-not-allowed;
}
.btn-secondary:hover:not(:disabled) {
  @apply shadow-lg transform -translate-y-0.5;
}

/* Animaciones del Modal */
@keyframes modal-scale-in {
  from { opacity: 0; transform: scale(0.95) translateY(20px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}
.animate-modal-scale-in {
  animation: modal-scale-in 0.3s ease-out forwards;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>