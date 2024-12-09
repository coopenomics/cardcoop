<template lang="pug">
div
q-card(flat).q-pa-md
  p.text-h6 Выйти из приложения
  div.q-pa-sm
    span Для повторного входа потребуется ввести ключ доступа, выданный при регистрации.
  q-btn(size="sm" color="primary" @click="logout").q-mt-md
    q-icon( color="white" name="logout")
    span.q-ml-sm Выйти

</template>
<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { useLogoutUser } from 'src/features/Registrator/Logout/model'
import { FailAlert } from 'src/shared/api';

const router = useRouter()

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
