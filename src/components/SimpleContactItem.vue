<template>
  <div
    @click="handleClick"
    class="flex items-center px-6 py-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
    :class="{ 'bg-blue-50': isActive }"
  >
    <div
      class="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-lg mr-3 flex-shrink-0"
    >
      {{ contact.name.charAt(0).toUpperCase() }}
    </div>

    <div class="flex-1 min-w-0">
      <div class="flex justify-between items-baseline mb-1">
        <h3 class="text-gray-900 text-sm font-semibold truncate">
          {{ contact.name }}, 29
        </h3>
        <span v-if="contact.lastMessageTime" class="text-gray-500 text-xs flex-shrink-0 ml-2">
          {{ formatMessageTime(contact.lastMessageTime) }}
        </span>
      </div>

      <div class="flex justify-between items-center">
        <p v-if="contact.lastMessage" class="text-gray-600 text-sm flex-1 truncate">
          {{ truncateMessage(contact.lastMessage.message, 35) }}
        </p>
        <p v-else class="text-gray-400 text-sm italic">
          Нет сообщений
        </p>

        <div
          v-if="contact.unreadCount > 0"
          class="flex-shrink-0 ml-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold"
        >
          {{ contact.unreadCount > 9 ? '9' : contact.unreadCount }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Contact } from '../features/chat/types'
import { formatMessageTime, truncateMessage } from '../features/chat/utils'

interface Props {
  contact: Contact
  isActive?: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  select: [contactId: string]
}>()

function handleClick() {
  emit('select', props.contact.id)
}
</script>
