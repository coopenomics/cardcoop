<template lang='pug'>
div
  q-step(:name='3', title='Установите мастер-пароль', :done='step > 3')
    div
      p.full-width Мастер-пароль используется для шифрования персональных данных и ключа для цифровой подписи документов. Утеря мастер-пароля потребует перевыпуска карты. Рекомендуем установить подсказку пароля.

    q-input.q-mt-lg(
      standout="bg-teal text-white",
      v-model='password',
      label='Мастер-пароль',
      type="password"
      autocomplete="new-password"
    )

    q-input.q-mt-sm(
      standout="bg-teal text-white",
      v-model='password2',
      label='Повторите мастер-пароль',
      type="password"
      autocomplete="new-password"
    )
    div
      q-badge(v-if="password" :color="badgeColor") {{ passwordStrength }}
      //- q-badge(v-else color="black") установите пароль

    q-checkbox(v-model="setHint", label="Установить подсказку для мастер-пароля").q-mt-sm


    q-input.q-mt-sm(
      v-if="setHint"
      standout="bg-teal text-white",
      v-model='hint',
      label='Подсказка для мастер-пароля',
    )

    .q-mt-lg
      p(v-if="badgeColor !== 'green' && password.length > 4").text-red Пароль должен включать цифры, заглавные и строчные буквы, специальные знаки и быть длиной более 8 символов.
      p(v-if="passwordValid && !passwordsMatch").text-red пароли не совпадают
      q-btn.col-md-6.col-xs-12(flat, @click="store.step--")
        i.fa.fa-arrow-left
        span.q-ml-md назад


      q-btn.q-mt-lg.q-mb-lg(color='primary', :disabled="!isAllValid" @click='setAccount') Продолжить


</template>
<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useCreateUser } from 'src/features/Registrator/CreateUser'
import { Notify, copyToClipboard } from 'quasar'
import { useRegistratorStore } from 'src/entities/Registrator'
const store = useRegistratorStore().state

import { FailAlert } from 'src/shared/api'

const api = useCreateUser()
const i_save = ref(false)
const account = ref(store.account)
const password = ref('')
const password2 = ref('')
const hint = ref('')
const setHint = ref(false)

if (!account.value.private_key || !account.value.public_key || !account.value.username)
  account.value = api.generateAccount()

const email = computed(() => store.email)
const step = computed(() => store.step)
const userData = computed(() => store.userData)

const passwordStrength = computed(() => {
  const lengthScore = password.value.length >= 8 ? 1 : 0;
  const hasNumbers = /[0-9]/.test(password.value) ? 1 : 0;
  const hasUppercase = /[A-Z]/.test(password.value) ? 1 : 0;
  const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password.value) ? 1 : 0;

  const score = lengthScore + hasNumbers + hasUppercase + hasSpecialChars;

  if (score === 4) return 'сильный пароль';
  if (score === 3) return 'средний пароль';
  return 'слабый пароль';
});

const copyMnemonic = () => {
  const toCopy = `${account.value.private_key}`

  copyToClipboard(toCopy)
    .then(() => {
      Notify.create({
        message: 'Информация скопирована в буфер обмена',
        type: 'positive',
      })
    })
    .catch((e) => {
      console.log(e)
    })
}

const setAccount = async () => {
  try {

    // await api.createUser(email.value, userData.value, account.value)
    store.account = account.value
    store.step = step.value + 1

  } catch (e: any) {
    store.step = 1
    console.error(e)
    FailAlert(e.message)
  }
}

const badgeColor = computed(() => {
  if (passwordStrength.value === 'сильный пароль') return 'green';
  if (passwordStrength.value === 'средний пароль') return 'orange';
  return 'red';
});

const passwordValid = computed(() => passwordStrength.value === 'сильный пароль' )

const passwordsMatch = computed(() => password.value == password2.value)
const isAllValid = computed(() => passwordStrength.value === 'сильный пароль' && passwordsMatch)

</script>
