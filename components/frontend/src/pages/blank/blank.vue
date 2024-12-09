<template lang="pug">
q-page.p-md.bg-gray-100.text-center.pa-4
  div.q-mt-lg.full-screen 404 страница не найдена!
  q-btn(flat @click="router.push('/')") на главную
</template>
<script setup lang="ts">
  import { useRouter } from 'vue-router'
  const router = useRouter()
</script>
