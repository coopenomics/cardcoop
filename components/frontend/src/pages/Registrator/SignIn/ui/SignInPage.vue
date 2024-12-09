<template lang="pug">
.row.justify-center.q-pa-sm
  .col-md-4.col-sm-6.col-xs-12
    div(v-if="!registeredAndloggedIn")
      SignIn.q-mt-lg
      div.text-right
        q-btn(flat size="sm" dense @click="router.push({name: 'lostkey'})") потеряли ключ?
        q-btn(flat size="sm" dense @click="router.push({name: 'signup'})") нет аккаунта?


    AlreadyRegistered(v-else).q-mt-lg
</template>
<script lang="ts" setup>
import { useSessionStore } from 'src/entities/Session';
import { useCurrentUserStore } from 'src/entities/User';
import { SignIn } from 'src/widgets/Registrator/SignIn'
import { computed } from 'vue'
import { AlreadyRegistered } from 'src/widgets/Registrator/AlreadyRegistered'
import { useRouter } from 'vue-router';
import { useRegistratorStore } from 'src/entities/Registrator';
const store = useRegistratorStore().state

const router = useRouter()

const registeredAndloggedIn = computed(() => {
  return useCurrentUserStore().isRegistrationComplete && useSessionStore().isAuth && store.step == 1
})
</script>
