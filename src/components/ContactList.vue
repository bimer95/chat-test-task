<template>
  <div class="h-full flex flex-col bg-white border-r border-gray-200">
    <div class="bg-gray-50 border-b border-gray-200 px-6 py-4">
      <div class="flex items-center justify-between mb-3">
        <div class="flex space-x-6">
          <div class="text-blue-500 font-semibold border-b-2 border-blue-500 pb-1">Сообщения</div>
        </div>
      </div>

      <div class="flex items-center text-sm text-gray-600">
        <div
          class="w-2 h-2 rounded-full mr-2"
          :class="connectionStatusClass"
        ></div>
        <span :class="connectionTextClass">
          {{ connectionStatusText }}
        </span>
      </div>
    </div>

    <div class="flex-1 overflow-y-auto">
      <div v-if="isLoading" class="p-8 text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <p class="mt-2 text-gray-600">Загрузка...</p>
      </div>

      <div v-else-if="error" class="p-4 m-4 bg-red-50 border border-red-200 rounded-lg">
        <p class="text-red-800 text-sm">{{ error }}</p>
        <button
          @click="$emit('retry')"
          class="mt-2 px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
        >
          Повторить
        </button>
      </div>

      <div v-else-if="contacts.length === 0" class="p-8 text-center text-gray-500">
        <svg class="mx-auto h-12 w-12 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.959 8.959 0 01-4.906-1.524A11.956 11.956 0 0112 20.5a12.061 12.061 0 01-7.096-2.208A11.936 11.936 0 013 18c-.28 0-.551-.041-.81-.121A8.973 8.973 0 012 16c0-4.418 3.582-8 8-8 4.418 0 8 3.582 8 8z"></path>
        </svg>
        <p class="text-sm">Пока нет сообщений</p>
        <p class="text-xs mt-1 text-gray-400">Ждем входящие сообщения...</p>
      </div>

      <div v-else>
        <SimpleContactItem
          v-for="contact in contacts"
          :key="contact.id"
          :contact="contact"
          :is-active="contact.id === activeContactId"
          @select="(contactId: string) => $emit('select-contact', contactId)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Contact, WebSocketState } from '../features/chat/types'
import SimpleContactItem from './SimpleContactItem.vue'

interface Props {
  contacts: Contact[]
  activeContactId: string | null
  isLoading: boolean
  error: string | null
  wsState: WebSocketState
}

const props = defineProps<Props>()
defineEmits<{
  'select-contact': [contactId: string]
  'retry': []
}>()

const connectionStatusClass = computed(() => {
  if (props.wsState.isConnected) return 'bg-green-500'
  if (props.wsState.isReconnecting) return 'bg-yellow-500 animate-pulse'
  return 'bg-red-500'
})

const connectionTextClass = computed(() => {
  if (props.wsState.isConnected) return 'text-green-700'
  if (props.wsState.isReconnecting) return 'text-yellow-700'
  return 'text-red-700'
})

const connectionStatusText = computed(() => {
  if (props.wsState.isConnected) return 'Подключено'
  if (props.wsState.isReconnecting) {
    return `Переподключение... (${props.wsState.reconnectAttempts}/5)`
  }
  return 'Отключено'
})
</script>
