import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Contact, Dialog, Message, WsPayload } from './types'
import { generateId, createContactFromMessage, sortContactsByLastMessage } from './utils'
import { useWebSocket } from './useWebSocket'

export const useChatStore = defineStore('chat', () => {
  const contacts = ref<Contact[]>([])
  const dialogs = ref<Record<string, Dialog>>({})
  const activeContactId = ref<string | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const { state: wsState, connect, disconnect, onMessage } = useWebSocket()

  const sortedContacts = computed(() => sortContactsByLastMessage(contacts.value))

  const activeContact = computed(() =>
    contacts.value.find((contact: Contact) => contact.id === activeContactId.value)
  )

  const activeDialog = computed(() =>
    activeContactId.value ? dialogs.value[activeContactId.value] : null
  )

  function addMessage(payload: WsPayload) {
    const messageData = payload.message
    const message: Message = {
      id: generateId(),
      from: messageData.from,
      message: messageData.message,
      timestamp: Date.now(),
      isRead: false,
    }

    let contact = contacts.value.find((c: Contact) => c.name === message.from)

    if (!contact) {
      contact = createContactFromMessage(message)
      contacts.value.push(contact)

      dialogs.value[contact.id] = {
        contactId: contact.id,
        messages: [message],
      }
    } else {
      contact.lastMessage = message
      contact.lastMessageTime = message.timestamp

      if (activeContactId.value !== contact.id) {
        contact.unreadCount++
      } else {
        message.isRead = true
      }

      if (dialogs.value[contact.id]) {
        dialogs.value[contact.id]!.messages.push(message)
      }
    }
  }

  function addLocalMessage(text: string) {
    if (!activeContactId.value || !text.trim()) return

    const message: Message = {
      id: generateId(),
      from: 'Вы',
      message: text.trim(),
      timestamp: Date.now(),
      isRead: true,
    }

    if (dialogs.value[activeContactId.value]) {
      dialogs.value[activeContactId.value]!.messages.push(message)
    }

    const contact = contacts.value.find((c: Contact) => c.id === activeContactId.value)
    if (contact) {
      contact.lastMessage = message
      contact.lastMessageTime = message.timestamp
    }
  }

  function selectContact(contactId: string) {
    activeContactId.value = contactId

    const contact = contacts.value.find((c: Contact) => c.id === contactId)
    if (contact) {
      contact.unreadCount = 0

      if (dialogs.value[contactId]) {
        dialogs.value[contactId].messages.forEach((message: Message) => {
          message.isRead = true
        })
      }
    }
  }

  function initializeMockData() {
    // Моковые данные
    const mockContacts: Contact[] = [
      {
        id: '1',
        name: 'Anzhela',
        lastMessage: {
          id: '1',
          from: 'Anzhela',
          message: 'can my smile make your day better?😉',
          timestamp: Date.now() - 3600000,
          isRead: false
        },
        unreadCount: 3,
        lastMessageTime: Date.now() - 3600000,
      },
      {
        id: '2',
        name: 'Marina',
        lastMessage: {
          id: '2',
          from: 'Marina',
          message: "Don't tell me you're afraid :)",
          timestamp: Date.now() - 7200000,
          isRead: true
        },
        unreadCount: 0,
        lastMessageTime: Date.now() - 7200000,
      }
    ]

    contacts.value = mockContacts

    dialogs.value['1'] = {
      contactId: '1',
      messages: [
        {
          id: '1',
          from: 'Anzhela',
          message: "What's your name?",
          timestamp: Date.now() - 4000000,
          isRead: true
        },
        {
          id: '2',
          from: 'Вы',
          message: 'h',
          timestamp: Date.now() - 3900000,
          isRead: true
        },
        {
          id: '3',
          from: 'Anzhela',
          message: 'can my smile make your day better?',
          timestamp: Date.now() - 3600000,
          isRead: true
        }
      ]
    }

    dialogs.value['2'] = {
      contactId: '2',
      messages: [
        {
          id: '4',
          from: 'Marina',
          message: 'Woman who looking only for date - it good or bad?',
          timestamp: Date.now() - 7400000,
          isRead: true
        },
        {
          id: '5',
          from: 'Вы',
          message: 'hu',
          timestamp: Date.now() - 7300000,
          isRead: true
        },
        {
          id: '6',
          from: 'Вы',
          message: 'he',
          timestamp: Date.now() - 7250000,
          isRead: true
        },
        {
          id: '7',
          from: 'Вы',
          message: 'ha',
          timestamp: Date.now() - 7200000,
          isRead: true
        },
        {
          id: '8',
          from: 'Marina',
          message: 'does that mean its good?',
          timestamp: Date.now() - 7150000,
          isRead: true
        },
        {
          id: '9',
          from: 'Marina',
          message: 'would you go out with a woman like me?',
          timestamp: Date.now() - 7100000,
          isRead: true
        },
        {
          id: '10',
          from: 'Marina',
          message: "Don't tell me you're afraid :)",
          timestamp: Date.now() - 7050000,
          isRead: true
        }
      ]
    }
  }

  async function initializeWebSocket() {
    try {
      isLoading.value = true
      error.value = null

      initializeMockData()

      onMessage(addMessage)

      // Подключиться к WebSocket
      await connect()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Ошибка подключения'
      console.error('Ошибка инициализации WebSocket:', err)
    } finally {
      isLoading.value = false
    }
  }

  function disconnectWebSocket() {
    disconnect()
  }

  return {
    contacts: sortedContacts,
    activeContactId,
    activeContact,
    activeDialog,
    isLoading,
    error,
    wsState,

    addMessage,
    addLocalMessage,
    selectContact,
    initializeWebSocket,
    disconnectWebSocket,
  }
})
