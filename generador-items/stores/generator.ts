import { defineStore } from 'pinia';
import type { Item } from '~/types';

export const useGeneratorStore = defineStore('generator', {
  state: () => ({
    generatedItems: [] as Item[],
    isLoading: false,
    error: null as string | null
  }),

  actions: {
    async generateItems(payload: { prompt: string; formato: string; codigoItem: string }) {
      this.isLoading = true;
      this.error = null;

      try {
        const { generateResponse } = useChatService();
        const response = await generateResponse(payload.prompt);

        // Parse the response and create items
        const items = this.parseResponseToItems(response.response, payload.formato, payload.codigoItem);
        
        // Add new items to the beginning of the array
        this.generatedItems.unshift(...items);
      } catch (error) {
        console.error('Error generating items:', error);
        this.error = 'Error al generar los ítems. Por favor, intenta de nuevo.';
      } finally {
        this.isLoading = false;
      }
    },

    parseResponseToItems(response: string, formato: string, codigoItem: string): Item[] {
      const items: Item[] = [];
      
      // Split by separator if multiple items
      const itemTexts = response.split('---###---');
      
      itemTexts.forEach((itemText, index) => {
        const item = this.parseItemText(itemText.trim(), formato, codigoItem, index);
        if (item) {
          items.push(item);
        }
      });

      return items;
    },

    parseItemText(text: string, formato: string, codigoItem: string, index: number): Item | null {
      if (!text) return null;

      const sections = {
        contexto: this.extractSection(text, 'CONTEXTO'),
        reactivo: this.extractSection(text, 'REACTIVO'),
        opciones: this.extractSection(text, 'OPCIONES DE RESPUESTA'),
        respuestaCorrecta: this.extractSection(text, 'RESPUESTA CORRECTA'),
        sustentacion: this.extractSection(text, 'SUSTENTACIÓN BIBLIOGRÁFICA'),
        ajusteMetodologico: this.extractSection(text, 'AJUSTE METODOLÓGICO DEL ÍTEM')
      };

      const id = `${codigoItem}_${Date.now()}_${index}`;
      const title = `${formato} - ${codigoItem}`;

      return {
        id,
        title,
        ...sections,
        createdDate: new Date().toLocaleString('es-ES'),
        isCollapsed: false,
        isEditing: false,
        isSaved: false,
        formato,
        codigoItem
      };
    },

    extractSection(text: string, sectionName: string): string {
      const regex = new RegExp(`${sectionName}[:\\s]*([\\s\\S]*?)(?=(?:CONTEXTO|REACTIVO|OPCIONES DE RESPUESTA|RESPUESTA CORRECTA|SUSTENTACIÓN BIBLIOGRÁFICA|AJUSTE METODOLÓGICO DEL ÍTEM)[:\\s]*|$)`, 'i');
      const match = text.match(regex);
      return match ? match[1].trim() : '';
    },

    updateItem(itemId: string, updatedContent: string) {
      const itemIndex = this.generatedItems.findIndex(item => item.id === itemId);
      if (itemIndex !== -1) {
        const item = this.generatedItems[itemIndex];
        const updatedSections = {
          contexto: this.extractSection(updatedContent, 'CONTEXTO'),
          reactivo: this.extractSection(updatedContent, 'REACTIVO'),
          opciones: this.extractSection(updatedContent, 'OPCIONES DE RESPUESTA'),
          respuestaCorrecta: this.extractSection(updatedContent, 'RESPUESTA CORRECTA'),
          sustentacion: this.extractSection(updatedContent, 'SUSTENTACIÓN BIBLIOGRÁFICA'),
          ajusteMetodologico: this.extractSection(updatedContent, 'AJUSTE METODOLÓGICO DEL ÍTEM')
        };

        this.generatedItems[itemIndex] = {
          ...item,
          ...updatedSections,
          isEditing: false
        };
      }
    },

    deleteItem(itemId: string) {
      this.generatedItems = this.generatedItems.filter(item => item.id !== itemId);
    },

    saveItem(itemId: string) {
      const item = this.generatedItems.find(item => item.id === itemId);
      if (item) {
        item.isSaved = true;
      }
    },

    toggleCollapse(itemId: string) {
      const item = this.generatedItems.find(item => item.id === itemId);
      if (item) {
        item.isCollapsed = !item.isCollapsed;
      }
    },

    toggleEdit(itemId: string) {
      const item = this.generatedItems.find(item => item.id === itemId);
      if (item) {
        item.isEditing = !item.isEditing;
      }
    }
  },

  getters: {
    getItems: (state) => state.generatedItems,
    getIsLoading: (state) => state.isLoading,
    getError: (state) => state.error
  }
});
