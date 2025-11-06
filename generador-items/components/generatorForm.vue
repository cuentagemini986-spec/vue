<template>
  <form class="bg-white rounded-2xl shadow-xl p-8 md:p-12 w-full" @submit.prevent="onSubmit">
    
    <h1 class="text-4xl font-extrabold text-gray-800 mb-8 text-center animate-fade-in-down">
      ✨ Generador de Ítems
    </h1>

    <section class="mb-6 border border-gray-200 rounded-lg shadow-sm">
      <div class="flex justify-between items-center cursor-pointer p-5" @click="toggleSection('normaInfo')">
        <h3 class="text-xl font-bold text-indigo-700">1. Datos de la Norma</h3>
        <span :class="{'rotate-180': expandedSections.normaInfo}" class="text-indigo-500 transition-transform duration-300">▼</span>
      </div>
      <div v-show="expandedSections.normaInfo" class="p-5 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label for="normaCodigo" class="label-text">Código de la Norma:</label>
          <input id="normaCodigo" v-model="form.normaCodigo" type="text" class="input-field-fancy" placeholder="Ej: 280101001" />
        </div>
        <div>
          <label for="versionNorma" class="label-text">Versión (opcional):</label>
          <input id="versionNorma" v-model="form.versionNorma" type="text" class="input-field-fancy" placeholder="Ej: 1" />
        </div>
        <div class="md:col-span-2">
          <label for="normaNombre" class="label-text">Nombre de la Norma:</label>
          <input id="normaNombre" v-model="form.normaNombre" type="text" class="input-field-fancy" placeholder="Nombre completo de la norma" />
        </div>
        <div class="md:col-span-2">
          <label for="conocimientoEsencial" class="label-text">Conocimiento Esencial:</label>
          <input id="conocimientoEsencial" v-model="form.conocimientoEsencial" type="text" class="input-field-fancy" placeholder="Escriba el conocimiento" />
        </div>
        <div class="md:col-span-2">
          <label for="actividadClave" class="label-text">Actividad Clave:</label>
          <input id="actividadClave" v-model="form.actividadClave" type="text" class="input-field-fancy" placeholder="Escriba la actividad clave" />
        </div>
        <div class="md:col-span-2">
          <label for="criterioDesempeno" class="label-text">Criterio de Desempeño:</label>
          <input id="criterioDesempeno" v-model="form.criterioDesempeno" type="text" class="input-field-fancy" placeholder="Escriba el criterio" />
        </div>
      </div>
    </section>

    <section class="mb-6 border border-gray-200 rounded-lg shadow-sm">
      <div class="flex justify-between items-center cursor-pointer p-5" @click="toggleSection('itemChars')">
        <h3 class="text-xl font-bold text-emerald-700">2. Estructura del Ítem</h3>
        <span :class="{'rotate-180': expandedSections.itemChars}" class="text-emerald-500 transition-transform duration-300">▼</span>
      </div>
      <div v-show="expandedSections.itemChars" class="p-5 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label for="categoria" class="label-text">Categoría:</label>
          <select id="categoria" v-model="form.categoria" class="input-field-fancy">
            <option disabled value="">Seleccione...</option>
            <option v-for="cat in categorias" :key="cat" :value="cat">{{ cat }}</option>
          </select>
        </div>
        <div>
          <label for="formato" class="label-text">Formato:</label>
          <select id="formato" v-model="form.formato" class="input-field-fancy" :disabled="!form.categoria">
            <option disabled value="">Seleccione...</option>
            <option v-for="f in formatosDisponibles" :key="f" :value="f">{{ f }}</option>
          </select>
        </div>
        <div>
          <label for="generar" class="label-text">Cantidad:</label>
          <select id="generar" v-model="form.generar" class="input-field-fancy">
            <option v-for="op in generarOpciones" :key="op" :value="op">{{ op }}</option>
          </select>
        </div>
        <div>
          <label for="limite" class="label-text">Extensión:</label>
          <select id="limite" v-model="form.limite" class="input-field-fancy">
            <option v-for="lim in limites" :key="lim" :value="lim">{{ lim }}</option>
          </select>
        </div>
      </div>
    </section>
    
    <section class="mb-8 border border-gray-200 rounded-lg shadow-sm">
       <div class="flex justify-between items-center cursor-pointer p-5" @click="toggleSection('additionalGuides')">
        <h3 class="text-xl font-bold text-orange-700">3. Guías Adicionales (Opcional)</h3>
        <span :class="{'rotate-180': expandedSections.additionalGuides}" class="text-orange-500 transition-transform duration-300">▼</span>
      </div>
      <div v-show="expandedSections.additionalGuides" class="p-5 border-t border-gray-200 grid grid-cols-1 gap-6">
        <div>
          <label for="contexto" class="label-text">Guía para el Contexto:</label>
          <textarea id="contexto" v-model="form.contexto" class="input-field-fancy" rows="3" placeholder="Describe el contexto..."></textarea>
        </div>
        <div>
          <label for="reactivo" class="label-text">Guía para el Reactivo:</label>
          <textarea id="reactivo" v-model="form.reactivo" class="input-field-fancy" rows="3" placeholder="Escribe el reactivo..."></textarea>
        </div>
      </div>
    </section>
    
    <div class="mt-10 text-center animate-fade-in-up">
      <button type="submit" class="btn-primary-fancy w-full md:w-2/3 lg:w-1/2" :disabled="isLoading">
        <span v-if="isLoading" class="flex items-center justify-center">
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Generando...
        </span>
        <span v-else>Generar Ítems</span>
      </button>
    </div>

  </form>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useGeneratorStore } from '../stores/generator';
import type { GeneratorForm } from '../types';

// Importar el store
const store = useGeneratorStore();
const isLoading = computed(() => store.getIsLoading);

// Estado del formulario
const form = ref<GeneratorForm>({
  normaCodigo: '',
  versionNorma: '',
  normaNombre: '',
  conocimientoEsencial: '',
  actividadClave: '',
  criterioDesempeno: '',
  categoria: '',
  contexto: '',
  reactivo: '',
  generar: '1',
  formato: '',
  limite: 'Normal',
});

// Estado para controlar la expansión de las secciones
const expandedSections = ref({
  normaInfo: true,
  itemChars: true,
  additionalGuides: false 
});

const toggleSection = (section: keyof typeof expandedSections.value) => {
  expandedSections.value[section] = !expandedSections.value[section];
};

// Lógica de selects
const categorias = ['Reconocimiento', 'Comprension', 'Aplicación', 'Analisis'];
const generarOpciones = ['1', '2', '3'];
const limites = ['Breve', 'Normal', 'Extenso'];

const formatosPorCategoria: { [key: string]: string[] } = {
  'Reconocimiento': ['Selección múltiple con única respuesta', 'Localización o identificación', 'Jerarquización'],
  'Comprension': ['Selección múltiple con única respuesta', 'Condición si entonces', 'Ordenamiento con única respuesta', 'Aparejamiento'],
  'Aplicación': ['Selección múltiple con única respuesta'],
  'Analisis': ['Selección múltiple con única respuesta', 'Verdadero falso múltiple', 'Análisis de relaciones', 'Análisis de postulados']
};

const formatosDisponibles = computed(() => {
  if (!form.value.categoria) {
    return []; 
  }
  return formatosPorCategoria[form.value.categoria] || [];
});

watch(() => form.value.categoria, (newCategoria) => {
  form.value.formato = ''; 
  if (typeof newCategoria === 'string' && newCategoria !== '') {
    const formatos = formatosPorCategoria[newCategoria];
    if (Array.isArray(formatos) && formatos.length === 1) {
      const formatoUnico = formatos[0];
      if (typeof formatoUnico === 'string') {
        form.value.formato = formatoUnico;
      }
    }
  }
});

// Lógica de Envío
const onSubmit = async () => {
  const formatoSeleccionado = form.value.formato || 'Selección múltiple con única respuesta';
  const categoriaSeleccionada = (form.value.categoria || 'RECONOCIMIENTO').toUpperCase();
  const promptTemplate = getPromptTemplate(formatoSeleccionado, categoriaSeleccionada);

  const promptConDatos = promptTemplate
    .replace(/\[TITULO DE LA NSCL\]/g, form.value.normaNombre || 'la norma seleccionada')
    .replace(/\[INSERTAR CONOCIMIENTO ESENCIAL\]/g, form.value.conocimientoEsencial || 'el conocimiento seleccionado')
    .replace(/\[INSERTAR CRITERIO DE DESEMPEÑO\]/g, form.value.criterioDesempeno || 'el criterio seleccionado')
    .replace(/\[INSERTAR ACTIVIDAD CLAVE\]/g, form.value.actividadClave || 'la actividad seleccionada');
    
  const cantidadItems = parseInt(form.value.generar, 10) || 1;
  const textoCantidad = cantidadItems === 1 ? '1 ítem' : `${cantidadItems} ítems`;
  const textoSeparador = cantidadItems > 1 ? 'Cada ítem debe estar separado del siguiente por "---###---".' : '';

  const promptFinal = `
${promptConDatos}
---
**INSTRUCCIONES FINALES DE CUMPLIMIENTO OBLIGATORIO:**
1.  **Generación Múltiple:** Genera ${textoCantidad}. ${textoSeparador}
2.  **Guías Adicionales (Opcional):**
    ${form.value.contexto ? `- Guía para el Contexto: "${form.value.contexto}"` : ''}
    ${form.value.reactivo ? `- Guía para el Reactivo: "${form.value.reactivo}"` : ''}
3.  **Estructura de la Respuesta:** Para cada ítem, DEBES usar los encabezados en mayúsculas y en este orden exacto: CONTEXTO, REACTIVO, OPCIONES DE RESPUESTA, RESPUESTA CORRECTA, SUSTENTACIÓN BIBLIOGRÁFICA, AJUSTE METODOLÓGICO DEL ÍTEM.
4.  **SECCIÓN CRÍTICA - AJUSTE METODOLÓGICO:**
    NO OMITAS la sección final "AJUSTE METODOLÓGICO DEL ÍTEM".
    Esta sección DEBE presentar el ítem final, formateado y listo para copiar y pegar, conteniendo ÚNICAMENTE el CONTEXTO, el REACTIVO y las OPCIONES DE RESPUESTA (A, B, C, D).
`;

  const codigoItem = `NSCL_${form.value.normaCodigo || 'XXXX'}_C${form.value.conocimientoEsencial.charAt(0).toUpperCase() || 'Y'}_CD${form.value.criterioDesempeno.charAt(0).toUpperCase() || 'Z'}`;

  await store.generateItems({
    prompt: promptFinal,
    formato: formatoSeleccionado, 
    codigoItem: codigoItem
  });
};

function getPromptTemplate(formato: string, categoria: string): string {
  const templates: { [key: string]: string } = {
    'Selección múltiple con única respuesta': `
Requiero tu apoyo para elaborar un ítem de forma afirmativa.
Este ítem debe ser según las categorías de pensamiento de Bloom en el nivel de [${categoria}].
Definición del formato de Selección Múltiple con única respuesta:
...
Parámetros del ítem:
...
`
  };
  return templates[formato] || templates['Selección múltiple con única respuesta'] || '';
}
</script>

<style scoped>
/* Animaciones */
@keyframes fade-in-down {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-down { animation: fade-in-down 0.8s ease-out forwards; }
.animate-fade-in-up { animation: fade-in-up 0.8s ease-out forwards; }

/* Estilos de campo */
.label-text {
  @apply block text-sm font-semibold text-gray-700 mb-1;
}

.input-field-fancy {
  @apply w-full p-3 bg-slate-50 border border-gray-300 rounded-lg shadow-sm
         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
         transition-all duration-200 text-gray-800 placeholder-gray-400;
}
.input-field-fancy {
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
}

/* --- CAMBIO DE COLOR --- */
/* Estilo del botón principal (AHORA VERDE) */
.btn-primary-fancy {
  @apply py-3 px-8 bg-gradient-to-r from-green-600 to-emerald-700 text-white font-bold
         rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all
         duration-300 ease-in-out cursor-pointer text-lg;
}
/* Estado deshabilitado (GRIS) */
.btn-primary-fancy:disabled {
  @apply bg-gray-400 from-gray-400 to-gray-500 cursor-not-allowed transform-none shadow-md opacity-70;
}
</style>