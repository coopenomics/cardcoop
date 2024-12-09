<template lang="pug">
.row.justify-center.q-pa-sm
  .col-md-6.col-sm-8.col-xs-12
    div(v-if="!registeredAndloggedIn")
      SignUp.q-pt-lg
      //- div.text-right
      //-   q-btn(flat size="sm" dense @click="router.push({name: 'signin'})") уже есть аккаунт?
    AlreadyRegistered(v-else).q-pt-lg

</template>
<script lang="ts" setup>
import { useSessionStore } from 'src/entities/Session';
import { useCurrentUserStore } from 'src/entities/User';
import { SignUp } from 'src/widgets/Registrator/SignUp'
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
