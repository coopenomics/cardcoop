<template lang="pug">
q-layout(view="hHh LpR fff")
  q-page-container
    q-page
      router-view

</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useQuasar } from 'quasar'
import { useCurrentUserStore } from 'src/entities/User'
import { useSessionStore } from 'src/entities/Session'

const session = useSessionStore()
const $q = useQuasar()
const leftDrawerOpen = ref(true)

const loggedIn = computed(
  () => useCurrentUserStore().isRegistrationComplete && session.isAuth
)

onMounted(() => {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  $q.dark.set(prefersDark);

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
    $q.dark.set(event.matches);
  });
});

watch(loggedIn, (newValue) => {
  leftDrawerOpen.value = newValue
})

</script>
