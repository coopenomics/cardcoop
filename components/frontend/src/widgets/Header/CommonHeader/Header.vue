<!-- Header.vue -->
<template lang="pug">
div
  q-header(v-if="!matched('cooperative-settings') && !matched('user-settings') && !matched('extstore')" bordered :class="headerClass").header
    q-toolbar()
      q-btn(v-if="loggedIn && showDrawer" stretch icon="menu" flat @click="emitToggleLeftDrawer")
      q-btn(v-if="loggedIn && !showDrawer" stretch icon="fas fa-chevron-left" flat @click="goTo('index')")

      q-toolbar-title()
        q-btn(:size="isMobile ? 'md' : 'lg'" flat @click="goTo('index')")
          span(v-if="showDrawer") {{ COOP_SHORT_NAME }}

      SettingsDropdown(:isMobile="isMobile" :isChairman="isChairman" :isMember="isMember")

      template(v-if="!loggedIn")
        q-btn(
          v-if="showRegisterButton && !is('signup') && !is('install')"
          color="primary"
          class="btn-menu"
          stretch
          :size="isMobile ? 'sm' : 'lg'"
          @click="signup"
        )
          span.q-pr-sm регистрация
          i.fa-solid.fa-right-to-bracket

        q-btn(
          v-if="showRegisterButton && is('signup')"
          color="primary"
          class="btn-menu"
          stretch
          :size="isMobile ? 'sm' : 'lg'"
          @click="login"
        )
          span.q-pr-sm вход
          i.fa-solid.fa-right-to-bracket

  q-header(v-if="matched('user-settings')" bordered).flex.bg-gradient-dark
    q-toolbar
      q-btn(flat icon="fas fa-chevron-left" stretch @click="open('index')")
      q-tabs(
        dense
        switch-indicator
        inline-label
        align="justify"
        active-class="bg-teal"
        active-bg-color="teal"
        active-color="white"
        indicator-color="secondary"
        style="height: 50px !important; overflow-x: auto;"
      )
        q-route-tab(name="Реквизиты" label="Реквизиты" :to="{name: 'user-payment-methods'}" )

  q-header(bordered v-if="matched('cooperative-settings')").bg-gradient-dark
    q-toolbar

      q-btn(flat icon="fas fa-chevron-left" stretch @click="open('index')")
      q-tabs(
        dense
        switch-indicator
        inline-label
        align="justify"
        active-class="bg-teal"
        active-bg-color="teal"
        active-color="white"
        indicator-color="secondary"
        style="height: 50px !important; overflow-x: auto;"
      )

        q-route-tab(name="Фонды накопления" label="Фонды накопления" :to="{name: 'accumulation-funds'}" )
        q-route-tab(name="Фонды списания" label="Фонды списания" :to="{name: 'expense-funds'}" )
        q-route-tab(name="Взносы" label="Взносы" :to="{name: 'initial-contributions'}" )
        q-route-tab(name="Контакты" label="Контакты" :to="{name: 'change-contacts'}" )
        q-route-tab(name="Совет" label="Совет" :to="{name: 'members'}" )

  q-header(bordered v-if="matched('extstore')").bg-gradient-dark
    q-toolbar

      q-btn(flat icon="fas fa-chevron-left" stretch @click="backFromAppstore")
      q-tabs(
        dense
        switch-indicator
        inline-label
        align="justify"
        active-class="bg-teal"
        active-bg-color="teal"
        active-color="white"
        indicator-color="secondary"
        style="height: 50px !important; overflow-x: auto;"
      )

        q-route-tab(name="Все приложения" label="Все приложения" :to="{name: 'extstore-showcase'}" )
        q-route-tab(name="Установленные" label="Установленные" :to="{name: 'appstore-installed'}" )

  </template>

  <script setup lang="ts">
  import { computed, watch } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import { useQuasar } from 'quasar'
  import { COOP_SHORT_NAME } from 'src/shared/config'
  import { useCurrentUserStore } from 'src/entities/User'
  import { useSessionStore } from 'src/entities/Session'
  import config from 'src/app/config'
  import { useWindowSize } from 'vue-window-size'
  import { SettingsDropdown } from 'src/widgets/Header/SettingsDropdown'

  const router = useRouter()
  const route = useRoute()
  const $q = useQuasar()
  const session = useSessionStore()
  const { width } = useWindowSize()
  const emit = defineEmits(['toggle-left-drawer'])

  const isDark = computed(() => $q.dark.isActive)
  const headerClass = computed(() =>
    isDark.value ? 'text-white bg-dark' : 'text-black bg-light'
  )
  const isMobile = computed(() => width.value < 768)
  const currentUser = useCurrentUserStore()
  const loggedIn = computed(
    () => currentUser.isRegistrationComplete && session.isAuth
  )

  const isChairman = computed(() => currentUser.userAccount?.role === 'chairman')
  const isMember = computed(() => currentUser.userAccount?.role === 'member')

  const open = (name: string) => {
    router.push({name})
  }

  defineProps({
    showDrawer: {
      type: Boolean,
      required: true
    }
  })

  const showRegisterButton = computed(() => {
    if (!loggedIn.value) {
      return config.registrator.showRegisterButton
    }
    return false
  })

  const is = (what: string) => route.name === what

  const goTo = (name: string) => {
    router.push({ name })
  }

  const signup = () => {
    router.push({ name: 'signup' })
  }

  const login = () => {
    router.push({ name: 'signin' })
  }

  const emitToggleLeftDrawer = () => {
    emit('toggle-left-drawer')
  }

  const backFromAppstore = () => {
    if (is('extension-install') || is('extension-settings'))
      open('one-extension')
    else if (is('one-extension'))
      open('extstore-showcase')
    else open('index')
  }


  const matched = (what: string) => {
    console.log('what: ', what, route.matched.find(el => el.name === what))

    return route.matched.find(el => el.name === what)
  }



  watch(route, () => console.log('route: ', route))


  </script>

  <style lang="scss">
  .btn-title {
    font-size: 20px;
  }

  .btn-menu {
    font-size: 20px;
    height: 60px;
  }

  .menu {
    right: 0px;
    z-index: 1000;
  }

  .q-toolbar {
    padding-left: 0px !important;
    padding-right: 0px !important;
  }

  .q-toolbar__title {
    padding: 0px !important;
  }
  </style>
