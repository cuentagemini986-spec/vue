<template>
  <div class="bg-white rounded-2xl shadow-xl p-6">
    <h2 class="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">Resultados Generados</h2>

    <div v-if="isLoading" class="flex justify-center items-center min-h-[150px]">
      <div class="flex flex-col items-center">
        <div class="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <span class="mt-4 text-gray-500 font-medium">Generando...</span>
      </div>
    </div>
    
    <div v-else-if="items.length === 0" class="text-center text-gray-500 min-h-[150px] flex justify-center items-center">
      <p>Los ítems generados aparecerán aquí.</p>
    </div>
    
    <ul v-else class="space-y-3">
      <li v-for="item in items" :key="item.id">
        <button 
          @click="store.selectItem(item.id)"
          class="w-full text-left p-4 rounded-lg bg-slate-50 hover:bg-blue-100 border border-slate-200
                 hover:border-blue-300 shadow-sm transition-all duration-200 group"
        >
          <div class="flex justify-between items-center">
            <span class="font-semibold text-blue-800 group-hover:text-blue-900 truncate">
              {{ item.title }}
            </span>
            <span class="text-xs text-gray-500 group-hover:text-blue-700 ml-4">
              Ver
            </span>
          </div>
          <span class="text-xs text-gray-500">{{ item.createdDate }}</span>
        </button>
      </li>
    </ul>

  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useGeneratorStore } from '../stores/generator';

// Obtener todo el estado reactivo desde el store de Pinia
const store = useGeneratorStore();

const items = computed(() => store.getItems);
const isLoading = computed(() => store.getIsLoading);
const error = computed(() => store.getError);
// ¡No necesitamos ItemCard aquí!
</script>