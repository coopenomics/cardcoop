<template lang='pug'>
div
  q-step(:name='3', title='Получите приватный ключ и надежно сохраните его для цифровой подписи', :done='step > 3')
    div
      p.full-width Приватный ключ используется для входа в систему и подписи документов. Мы рекомендуем сохранить его в бесплатном менеджере паролей, таком как
        a(href="https://bitwarden.com/download" target="_bank").q-ml-xs Bitwarden
        | .


    q-input.q-mt-lg(
      v-if='account.private_key',
      v-model='account.private_key',
      label='Приватный ключ',
      :readonly='true'
    )

    q-checkbox(v-model="i_save", label="Я сохранил имя и ключ в надёжном месте")

    .q-mt-lg
      q-btn.col-md-6.col-xs-12(flat, @click="store.step--")
        i.fa.fa-arrow-left
        span.q-ml-md назад

      q-btn.col-md-6.col-xs-12(flat, @click='copyMnemonic')
        i.fa.fa-copy
        span.q-ml-md скопировать

      q-btn.q-mt-lg.q-mb-lg(color='primary', :disabled="!i_save" @click='setAccount')
        | Продолжить
        q-tooltip подтвердите сохранение ключа для продолжения
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

if (!account.value.private_key || !account.value.public_key || !account.value.username)
  account.value = api.generateAccount()

const email = computed(() => store.email)
const step = computed(() => store.step)
const userData = computed(() => store.userData)

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

    await api.createUser(email.value, userData.value, account.value)
    store.account = account.value
    store.step = step.value + 1

  } catch (e: any) {
    store.step = 1
    console.error(e)
    FailAlert(e.message)
  }
}
</script>
