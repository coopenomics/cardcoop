<template lang="pug">
div
  q-step(
    :name="8"
    :title="'Добро пожаловать в ' + COOP_SHORT_NAME"
    :done="step > 8"
  )

    p Совет кооператива {{ COOP_SHORT_NAME }} принял положительное решение о приёме Вас в пайщики, выдал удостоверение и создал цифровой кошелёк для Вас.

    div.q-mt-lg
      q-btn(
        color="primary"
        label="Открыть кошелёк"
        @click="next"
      ).q-mt-lg.q-mb-lg
  </template>

<script lang="ts" setup>
import { computed } from 'vue'
import { COOP_SHORT_NAME } from 'src/shared/config'
import { useRouter } from 'vue-router';
const router = useRouter()

const props = defineProps({
  step: {
    type: Number,
    required: true
  }
})

const step = computed(() => props.step)

const next = () => {
  router.push({ name: 'index' })
}


</script>
