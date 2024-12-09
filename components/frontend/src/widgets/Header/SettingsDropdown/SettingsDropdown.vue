<template lang="pug">
q-btn-dropdown(flat :size="isMobile ? 'sm' : 'md'" :dense="isMobile" stretch icon="fa-solid fa-cog")
  q-list
    ToogleDarkLight(:isMobile="isMobile" :showText="true")

    q-item(v-if="loggedIn" flat clickable v-close-popup @click="open('user-payment-methods')")
      q-item-section
        q-item-label
          q-icon(name="fa-solid fa-wrench").q-mr-sm
          span.font10px НАСТРОЙКИ ПАЙЩИКА

    q-item(v-if="loggedIn && isChairman" flat clickable v-close-popup @click="open('accumulation-funds')")
      q-item-section
        q-item-label
          q-icon(name="fa-solid fa-hammer").q-mr-sm
          span.font10px НАСТРОЙКИ КООПЕРАТИВА


    q-item(flat v-if="isChairman" clickable v-close-popup @click="open('extstore-showcase')")
      q-item-section
        q-item-label
          q-icon(name="fa-solid fa-plus").q-mr-sm
          span.font10px МАГАЗИН РАСШИРЕНИЙ
    hr(v-if="loggedIn")

    q-item(v-if="loggedIn" flat clickable v-close-popup @click="logout")
      q-item-section
        q-item-label
          q-icon(name="logout").q-mr-sm
          span.font10px ВЫЙТИ

</template>
<script lang="ts" setup>
import { useLogoutUser } from 'src/features/Registrator/Logout';
import { FailAlert } from 'src/shared/api';
import { useRouter } from 'vue-router';
import { ToogleDarkLight } from '../../../shared/ui/ToogleDarkLight';
import { useCurrentUserStore } from 'src/entities/User';
import { computed } from 'vue';
import { useSessionStore } from 'src/entities/Session';

const session = useSessionStore()

const currentUser = useCurrentUserStore()
const loggedIn = computed(
  () => currentUser.isRegistrationComplete && session.isAuth
)

defineProps({
  isMobile: Boolean,
  isChairman: {
    type: Boolean,
    default: false,
    required: false
  },
  isMember: {
    type: Boolean,
    default: false,
    required: false
  }
})

const router = useRouter()
const open = (name: string) => {
  router.push({name})
}

const logout = async () => {
  const { logout } = useLogoutUser()

  try {
    await logout()
    router.push({ name: 'signin' })

  } catch (e: any) {
    FailAlert('Ошибка при выходе: ' + e.message)
  }
}

</script>

<style>
.font10px{
  font-size: 10px;
}
</style>
