<template lang='pug'>
div
  q-step(:name='1', title='Введите электронную почту', :done='step > 1')
    p Добро пожаловать в {{ COOP_SHORT_NAME }}! Для начала регистрации, пожалуйста, введите вашу электронную почту:

    q-input.q-mt-lg(
      v-model.trim='email',
      standout="bg-teal text-white",
      type='email',
      label='Введите email',
      :readonly='inLoading',
      color='primary',
      :rules='[validateEmail, validateExists]',
      @keypress.enter='setEmail'
    )

    q-btn.q-mt-lg.q-mb-lg(
      color='primary',
      label='Продолжить',
      :disable='!isValidEmail',
      :loading='inLoading',
      @click='setEmail'
    )
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import { useCreateUser } from 'src/features/Registrator/CreateUser'
import { debounce } from 'quasar'
import { COOP_SHORT_NAME } from 'src/shared/config'
import { useRegistratorStore } from 'src/entities/Registrator'
const store = useRegistratorStore().state


const api = useCreateUser()

watch(() => store.email, () => email.value = store.email)

const email = ref(store.email)
const step = computed(() => store.step)

const inLoading = ref(false)
const isEmailExist = ref(false)

const isValidEmail = computed(() => api.emailIsValid(email.value))

const validateEmail = () => {
  return isValidEmail.value || 'Введите корректный email'
}

const validateExists = () => {
  return !isEmailExist.value || 'Пользователь с таким email уже существует. Войдите.'
}

const checkEmailExists = debounce(async () => {
  inLoading.value = true
  isEmailExist.value = await api.emailIsExist(email.value)
  inLoading.value = false
}, 500) // 500ms delay

watch(email, checkEmailExists)

const setEmail = () => {
  if (isValidEmail.value && !isEmailExist.value) {
    store.email = email.value
    if (store.userData.individual_data)
      store.userData.individual_data.email = email.value
    if (store.userData.organization_data)
      store.userData.organization_data.email = email.value
    if (store.userData.entrepreneur_data)
      store.userData.entrepreneur_data.email = email.value

    store.step = step.value + 1
  }
}
</script>
