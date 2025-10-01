<template>
  <div class="h-full flex items-center justify-center bg-gray-50">
    <div class="text-center max-w-md mx-auto p-8">
      <div class="mx-auto mb-6 w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
        <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.959 8.959 0 01-4.906-1.524A11.956 11.956 0 0112 20.5a12.061 12.061 0 01-7.096-2.208A11.936 11.936 0 013 18c-.28 0-.551-.041-.81-.121A8.973 8.973 0 012 16c0-4.418 3.582-8 8-8 4.418 0 8 3.582 8 8z"></path>
        </svg>
      </div>

      <h3 class="text-xl font-semibold text-gray-900 mb-3">
        {{ title || 'Выберите чат' }}
      </h3>

      <p class="text-gray-600 leading-relaxed">
        {{ description || 'Выберите контакт из списка слева, чтобы начать общение' }}
      </p>

      <div v-if="showInfo" class="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p class="text-sm text-blue-800">
          Новые сообщения будут появляться автоматически
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string
  description?: string
  showInfo?: boolean
}

withDefaults(defineProps<Props>(), {
  showInfo: true
})
</script>
