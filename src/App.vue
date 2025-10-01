<script setup lang="ts">
import ChatPage from './pages/ChatPage.vue'
</script>

<template>
  <div id="app" class="h-screen overflow-hidden">
    <ChatPage />
  </div>
</template>

<style>
html, body, #app {
  height: 100%;
  margin: 0;
  padding: 0;
}

#app {
  overflow: hidden;
}
</style>
