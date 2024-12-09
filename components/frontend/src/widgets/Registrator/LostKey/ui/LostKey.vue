<template lang="pug">
div
  q-card(flat).q-pa-md
    p.text-subtitle1.text-center ПЕРЕВЫПУСК КЛЮЧА


    form(@submit.prevent="submit").q-mt-md.full-width
      q-input(label="Введите электронную почту"
        v-model="email"
        standout="bg-teal text-white"
        autocorrect="off"
        autocapitalize="off"
        autocomplete="off"
        spellcheck="false"
        hint=""
        :rules='[validateEmail]',
      )

      q-btn(
        color="primary"
        type="submit"
        :loading="loading"
      ).full-width продолжить


</template>
<script lang="ts" setup>
import { useCreateUser } from 'src/features/Registrator/CreateUser';
import { useLostKey } from 'src/features/Registrator/LostKey/model';

import { FailAlert } from 'src/shared/api';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

const email = ref('')
const loading = ref(false)

const { lostKeyRequest } = useLostKey()
const { emailIsValid } = useCreateUser()
const isValidEmail = computed(() => emailIsValid(email.value))

const validateEmail = () => {
  return isValidEmail.value || 'Введите корректный email'
}



const router = useRouter()

const submit = async () => {
  try {
    loading.value = true
    await lostKeyRequest(email.value)
    router.push({ name: 'resetkey' })
    loading.value = false
  } catch (e: any) {
    loading.value = false
    FailAlert(e.message)
  }
}


</script>
