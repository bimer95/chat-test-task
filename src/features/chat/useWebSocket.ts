import { ref, onUnmounted } from 'vue'
import type { WebSocketState, WsPayload } from './types'
import { WS_URL, WS_CONFIG } from '@/config/env'

export function useWebSocket() {
  const state = ref<WebSocketState>({
    isConnected: false,
    isReconnecting: false,
    reconnectAttempts: 0,
  })

  let ws: WebSocket | null = null
  let reconnectTimer: number | null = null
  let pingTimer: number | null = null

  const messageHandlers = new Set<(payload: WsPayload) => void>()

  function clearTimers() {
    if (reconnectTimer) {
      clearTimeout(reconnectTimer)
      reconnectTimer = null
    }
    if (pingTimer) {
      clearInterval(pingTimer)
      pingTimer = null
    }
  }

  function startPing() {
    if (pingTimer) clearInterval(pingTimer)

    pingTimer = setInterval(() => {
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'ping' }))
      }
    }, WS_CONFIG.pingInterval) as unknown as number
  }

  function connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        ws = new WebSocket(WS_URL)

        ws.onopen = () => {
          state.value.isConnected = true
          state.value.isReconnecting = false
          state.value.reconnectAttempts = 0
          startPing()
          resolve()
        }

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data)

            if (data.message && data.message.from && data.message.message) {
              messageHandlers.forEach(handler => handler(data))
            } else {
              console.log('Сообщение не содержит данных чата:', data)
            }
          } catch (error) {
            console.error('Ошибка парсинга сообщения:', error, 'Данные:', event.data)
          }
        }

        ws.onclose = () => {
          console.log('WebSocket отключен')
          state.value.isConnected = false
          clearTimers()

          if (state.value.reconnectAttempts < WS_CONFIG.maxReconnectAttempts) {
            reconnect()
          } else {
            console.error('Максимальное количество попыток переподключения превышено')
          }
        }

        ws.onerror = (error) => {
          console.error('Ошибка WebSocket:', error)
          reject(error)
        }
      } catch (error) {
        console.error('Ошибка создания WebSocket:', error)
        reject(error)
      }
    })
  }

  function reconnect() {
    if (state.value.isReconnecting || state.value.reconnectAttempts >= WS_CONFIG.maxReconnectAttempts) {
      return
    }

    state.value.isReconnecting = true
    state.value.reconnectAttempts++

    const delay = WS_CONFIG.reconnectInterval *
      Math.pow(WS_CONFIG.reconnectBackoffMultiplier, state.value.reconnectAttempts - 1)

    console.log(`Переподключение через ${delay}ms (попытка ${state.value.reconnectAttempts}/${WS_CONFIG.maxReconnectAttempts})`)

    reconnectTimer = setTimeout(() => {
      connect().catch(() => {
        console.error('Ошибка переподключения')
        state.value.isReconnecting = false
      })
    }, delay) as unknown as number
  }

  function disconnect() {
    clearTimers()
    if (ws) {
      ws.close()
      ws = null
    }
    state.value.isConnected = false
    state.value.isReconnecting = false
    state.value.reconnectAttempts = 0
  }

  function onMessage(handler: (payload: WsPayload) => void) {
    messageHandlers.add(handler)

    return () => {
      messageHandlers.delete(handler)
    }
  }

  onUnmounted(() => {
    disconnect()
  })

  return {
    state,
    connect,
    disconnect,
    onMessage,
  }
}
