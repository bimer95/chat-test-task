import type { Contact, Message } from './types'

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

export function createContactFromMessage(message: Message): Contact {
  return {
    id: generateId(),
    name: message.from,
    lastMessage: message,
    unreadCount: 1,
    lastMessageTime: message.timestamp,
  }
}

export function sortContactsByLastMessage(contacts: Contact[]): Contact[] {
  return [...contacts].sort((a, b) => {
    const timeA = a.lastMessageTime || 0
    const timeB = b.lastMessageTime || 0
    return timeB - timeA
  })
}

export function formatMessageTime(timestamp: number): string {
  const date = new Date(timestamp)
  const now = new Date()
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

  if (diffInDays === 0) {
    return date.toLocaleTimeString('ru-RU', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  } else if (diffInDays === 1) {
    return 'Вчера'
  } else if (diffInDays < 7) {
    return date.toLocaleDateString('ru-RU', { weekday: 'short' })
  } else {
    // Формат как в референсе: MM/DD/YYYY
    return date.toLocaleDateString('en-US', { 
      month: '2-digit',
      day: '2-digit', 
      year: 'numeric'
    })
  }
}

export function truncateMessage(message: string, maxLength: number = 50): string {
  if (message.length <= maxLength) return message
  return message.substring(0, maxLength) + '...'
}