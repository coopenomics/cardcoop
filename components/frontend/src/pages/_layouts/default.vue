<template lang="pug">
q-layout(view="hHh LpR fff")
  Header(:showDrawer="showDrawer" @toggle-left-drawer="toggleLeftDrawer")

  q-footer(v-if="!loggedIn" :class="headerClass" bordered)
    ContactsFooter(:text="footerText")

  q-page-container
    q-page
      router-view
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useQuasar } from 'quasar'
import { useWindowSize } from 'vue-window-size'
import { useCurrentUserStore } from 'src/entities/User'
import { useSessionStore } from 'src/entities/Session'
import { Header } from 'src/widgets/Header/CommonHeader'
import { ContactsFooter } from 'src/shared/ui/Footer'
import { useRoute } from 'vue-router'
import { COOPNAME } from 'src/shared/config'

const session = useSessionStore()
const route = useRoute()
const showDrawer = computed(() => route.params.coopname === COOPNAME)

const $q = useQuasar()
const { width } = useWindowSize()
const leftDrawerOpen = ref(true)

const isDark = computed(() => $q.dark.isActive)
const headerClass = computed(() =>
  isDark.value ? 'text-white bg-dark' : 'text-black bg-light'
)
const isMobile = computed(() => width.value < 768)
const loggedIn = computed(
  () => useCurrentUserStore().isRegistrationComplete && session.isAuth
)
const footerText = computed(() => {
  return ''
})

onMounted(() => {
  if (isMobile.value || !loggedIn.value) {
    leftDrawerOpen.value = false
  }
})

watch(loggedIn, (newValue) => {
  leftDrawerOpen.value = newValue
})

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>
