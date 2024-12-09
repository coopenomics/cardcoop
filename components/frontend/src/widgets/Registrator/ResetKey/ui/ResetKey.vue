<template lang="pug">
div
  q-card(flat).q-pa-md
    div(v-if="token")
      p.text-subtitle1.text-center СОХРАНИТЕ КЛЮЧ
      span.q-mt-md Новый приватный ключ доступа сгенерирован для вас. Пожалуйста, подтвердите надёжное сохранение. Мы рекомендуем сохранить его в бесплатном менеджере паролей, таком как
        a(href="https://bitwarden.com/download" target="_bank").q-ml-xs Bitwarden
        | .

      q-input.q-mt-lg(
        v-if='account && account.private_key',
        v-model='account.private_key',
        label='Приватный ключ',
        :readonly='true'
      )


      q-checkbox(v-model="i_save", label="Я сохранил ключ")
      div.row.q-mt-md
        q-btn.col-md-6.col-xs-12(flat, @click='copyMnemonic')
          i.fa.fa-copy
          span.q-ml-md скопировать


        q-btn(:disabled="!i_save" @click="finish" color="primary" :loading="loading").col-md-6.col-xs-12 продолжить

    div(v-else)
      p.text-subtitle1.text-center ПРОВЕРЬТЕ ПОЧТУ
      span.q-mt-md На вашу электронную почту отправлено письмо со ссылкой для перевыпуска ключа. Пожалуйста, перейдите по ссылке для продолжения. Время действия ссылки - 10 минут. Эту страницу можно закрыть.

</template>
<script lang="ts" setup>
import { copyToClipboard } from 'quasar';
import { useCreateUser } from 'src/features/Registrator/CreateUser';
import { useResetKey } from 'src/features/Registrator/ResetKey/model';
import { FailAlert, SuccessAlert } from 'src/shared/api';
import { type IGeneratedAccount } from 'src/shared/lib/types/user';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute()
const router = useRouter()

const { generateAccount } = useCreateUser()
const account = ref<IGeneratedAccount | undefined>()

const i_save = ref(false)
const token = ref(route.query.token)
const loading = ref(false)

const { resetKey } = useResetKey()

account.value = generateAccount()


const copyMnemonic = () => {
  const toCopy = `${account.value?.private_key}`

  copyToClipboard(toCopy)
    .then(() => {
      SuccessAlert('Ключ был скопирован в буфер обмена')
    })
    .catch((e) => {
      console.log(e)
    })
}

const finish = async () => {
  try {

    if (!account.value) {
      FailAlert('Возникла ошибка при генерации приватного ключа')
      return
    }
    loading.value = true
    await resetKey(token.value as string, account.value.public_key)

    SuccessAlert('Ключ доступа успешно установлен')
    loading.value = false

    router.push({ name: 'signin' })

  } catch (e: any) {
    loading.value = false
    FailAlert(e.message)
  }
}

</script>
