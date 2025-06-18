<template lang='pug'>
div

  q-card.q-pa-md.signup(flat)
    p.text-h6.text-center.q-mb-md.q-mt-sm ПОЛУЧИТЬ КАРТУ ПАЙЩИКА
    q-stepper(v-model='store.step', vertical, animated, flat, done-color='primary')
      EmailInput

      SetUserData

      GenerateAccount

      Welcome(v-model:step='store.step')

  div.text-right
    q-btn(@click="signin" dense size="sm" flat) есть карта? войти
    //- q-btn(@click="reload" dense size="sm" flat) начать с начала

</template>

<script lang="ts" setup>
import { watch, onMounted, onBeforeUnmount, computed } from 'vue'
import EmailInput from './EmailInput.vue'
import GenerateAccount from './GenerateAccount.vue'
import SetUserData from './SetUserData.vue'
import Welcome from './Welcome.vue'
import { COOPNAME } from 'src/shared/config'
import { useCurrentUserStore } from 'src/entities/User'
import { useRegistratorStore } from 'src/entities/Registrator'
import { useSessionStore } from 'src/entities/Session'
import { useWalletStore } from 'src/entities/Wallet'
import { useRouter } from 'vue-router'
import { useLogoutUser } from 'src/features/Registrator/Logout'

const router = useRouter()
const currentUser = useCurrentUserStore()
const { state, clearUserData } = useRegistratorStore()
const session = useSessionStore()
const store = state
const username = computed(() => session.username)
const wallet = useWalletStore()

onMounted(() => {
  if (!currentUser.isRegistrationComplete) {

    if (currentUser.userAccount?.status === 'registered' || currentUser.userAccount?.status === 'active' || currentUser.userAccount?.status === 'blocked') {
      store.step = 7
      return
    }
  }
})

const reload = async () => {
  const { logout } = useLogoutUser()
  await logout()

  clearLocalStorage()

  window.location.reload()
}

const signin = async () => {
  router.push({name: 'signin'})
}

const clearLocalStorage = () => {
  clearUserData()
}

onBeforeUnmount(() => {
  if (store.step == 8) {
    clearLocalStorage()
  }
})

watch(() => currentUser.participantAccount, (newValue) => {
  if (newValue) {
    clearLocalStorage()
    store.step = 8
  }
})

watch(
  () => [store.step, store.email, store.account, store.userData],
  () => {
    if (store.step >= 4 && store.step < 8) {
      currentUser.loadProfile(username.value, COOPNAME)
      wallet.loadUserWalet({coopname: COOPNAME, username: username.value})
    }
  }
)
</script>
<style></style>
