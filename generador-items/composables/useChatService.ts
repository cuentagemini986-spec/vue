import type { ChatResponse } from '../types';

export const useChatService = () => {
  const config = useRuntimeConfig();
  const apiUrl = `${config.public.apiUrl}/chat/xai`;

  const generateResponse = async (prompt: string): Promise<ChatResponse> => {
    try {
      const response = await $fetch<ChatResponse>(apiUrl, {
        method: 'POST',
        body: { prompt },
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      return response;
    } catch (error) {
      console.error('Error in generateResponse:', error);
      return { response: 'An error occurred. Please try again.' };
    }
  };

  return {
    generateResponse
  };
};
