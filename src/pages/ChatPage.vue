<template>
  <div class="h-screen flex bg-gray-50">
    <div
      class="w-full lg:w-96 xl:w-1/3 flex-shrink-0 transition-all duration-300"
      :class="{ 'hidden': showChatOnMobile && isMobile }"
    >
      <ContactList
        :contacts="chatStore.contacts"
        :active-contact-id="chatStore.activeContactId"
        :is-loading="chatStore.isLoading"
        :error="chatStore.error"
        :ws-state="chatStore.wsState"
        @select-contact="selectContact"
        @retry="retryConnection"
      />
    </div>
    <div
      class="flex-1 transition-all duration-300"
      :class="{
        'hidden': !showChatOnMobile && isMobile,
        'lg:flex': true
      }"
    >
      <div class="flex-1">
        <ChatArea
          v-if="chatStore.activeContact && chatStore.activeDialog"
          :contact="chatStore.activeContact"
          :dialog="chatStore.activeDialog"
          :show-back-button="isMobile"
          @send-message="sendMessage"
          @back="goBackToContacts"
        />
        <EmptyState v-else />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useChatStore } from '../features/chat/useChatStore'
import ContactList from '../components/ContactList.vue'
import ChatArea from '../components/ChatArea.vue'
import EmptyState from '../components/EmptyState.vue'

const chatStore = useChatStore()

const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1024)
const showChatOnMobile = ref(false)

const isMobile = computed(() => windowWidth.value < 1024)

function selectContact(contactId: string) {
  chatStore.selectContact(contactId)

  showChatOnMobile.value = true
}

function goBackToContacts() {
  showChatOnMobile.value = false
}

function sendMessage(message: string) {
  chatStore.addLocalMessage(message)
}

function retryConnection() {
  chatStore.initializeWebSocket()
}

function handleResize() {
  windowWidth.value = window.innerWidth
  if (!isMobile.value) {
    showChatOnMobile.value = false
  }
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && isMobile.value && showChatOnMobile.value) {
    goBackToContacts()
  }
}

onMounted(async () => {
  await chatStore.initializeWebSocket()

  window.addEventListener('resize', handleResize)
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  chatStore.disconnectWebSocket()

  window.removeEventListener('resize', handleResize)
  window.removeEventListener('keydown', handleKeydown)
})
</script>
