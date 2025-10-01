export interface Message {
  id: string
  from: string
  message: string
  timestamp: number
  isRead?: boolean
}

export interface Contact {
  id: string
  name: string
  lastMessage?: Message
  unreadCount: number
  lastMessageTime?: number
}

export interface Dialog {
  contactId: string
  messages: Message[]
}

export interface WsPayload {
  message: {
    from: string
    message: string
  }
}

export interface WebSocketState {
  isConnected: boolean
  isReconnecting: boolean
  reconnectAttempts: number
}