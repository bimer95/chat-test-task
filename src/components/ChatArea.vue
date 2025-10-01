<template>
  <div class="h-full flex flex-col bg-white">
    <div class="bg-white border-b border-gray-200 p-4 flex items-center" v-if="contact">
      <button
        v-if="showBackButton"
        @click="emit('back')"
        class="mr-3 p-2 hover:bg-gray-100 rounded-full lg:hidden"
      >
        <
      </button>
      <div
        class="mr-3 w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-base"
      >
        {{ contact.name.charAt(0).toUpperCase() }}
      </div>
      <div class="flex-1">
        <h2 class="text-lg font-semibold text-gray-900">{{ contact.name }}</h2>
        <p class="text-sm text-gray-500">в сети</p>
      </div>
    </div>
    <div v-else class="bg-white border-b border-gray-200 p-4 flex items-center">
      <h2 class="text-lg font-semibold text-gray-900">Выберите чат</h2>
    </div>

    <div
      ref="messagesContainer"
      class="flex-1 overflow-y-auto p-4 space-y-4"
    >
      <div v-if="!dialog || dialog.messages.length === 0" class="h-full">
        <EmptyState
          title="Нет сообщений"
          description="Здесь будут отображаться ваши сообщения"
          :show-info="false"
        />
      </div>

      <div v-else class="space-y-3">
        <div
          v-for="message in dialog.messages"
          :key="message.id"
          class="flex"
          :class="isOwnMessage(message.from) ? 'justify-end' : 'justify-start'"
        >
          <div
            class="max-w-xs lg:max-w-md px-3 py-2 rounded-2xl"
            :class="isOwnMessage(message.from)
              ? 'bg-blue-500 text-white rounded-br-sm'
              : 'bg-gray-200 text-gray-900 rounded-bl-sm'"
          >
            <p class="text-sm whitespace-pre-wrap break-words">
              {{ message.message }}
            </p>
            <div
              class="text-xs mt-1 opacity-70" :class="isOwnMessage(message.from) ? 'text-right' : 'text-left'"
            >
              {{ formatMessageTime(message.timestamp) }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="p-4 border-t border-gray-200 bg-white">
      <form @submit.prevent="sendMessage" class="flex items-center space-x-3">

        <input
          v-model="messageText"
          type="text"
          placeholder="Введите сообщение"
          class="flex-1 px-4 py-2 bg-gray-50 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          :disabled="!contact"
        />

        <button
          type="submit"
          :disabled="!messageText.trim() || !contact"
          class="w-10 h-10 flex items-center justify-center text-xl font-bold bg-green-500 text-white rounded-full hover:bg-green-600 disabled:opacity-50 transition-colors"
        >
          >
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, watch } from 'vue'
import type { Contact, Dialog } from '../features/chat/types'
import { formatMessageTime } from '../features/chat/utils'
import EmptyState from './EmptyState.vue'

interface Props {
  contact: Contact | null
  dialog: Dialog | null
  showBackButton?: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'send-message': [message: string]
  'back': []
}>()
const messageText = ref('')
const messagesContainer = ref<HTMLElement>()

const isOwnMessage = (from: string) => from === 'Вы'

function sendMessage() {
  if (!messageText.value.trim()) return

  emit('send-message', messageText.value)
  messageText.value = ''
}

function scrollToBottom() {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

watch(() => props.dialog?.messages, scrollToBottom, { deep: true })
watch(() => props.contact?.id, scrollToBottom)
</script>
