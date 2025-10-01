export const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8181'

export const WS_CONFIG = {
  maxReconnectAttempts: 5,
  reconnectInterval: 3000,
  reconnectBackoffMultiplier: 1.5,
  pingInterval: 30000,
}