<template>
  <div class="min-h-screen bg-slate-100 p-4 md:p-8">
    <div class="container mx-auto max-w-screen-2xl">
      
      <div class="grid grid-cols-1 lg:grid-cols-2 lg:gap-8">
        
        <div class="mb-8 lg:mb-0">
          <GeneratorForm />
        </div>
        
        <div class="lg:sticky lg:top-8 lg:self-start">
          <ItemList />
        </div>
        
      </div>
    </div>
  </div>
  
  <ItemCard />
</template>

<script setup lang="ts">
import GeneratorForm from '../components/GeneratorForm.vue';
import ItemList from '../components/ItemList.vue';
import ItemCard from '../components/ItemCard.vue';
</script>

<style>
/* Estilos globales */
body {
  @apply text-gray-900;
}
</style>