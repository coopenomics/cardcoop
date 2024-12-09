<script setup lang="ts">
import { computed } from 'vue';

interface IProps {
  title?: string
  show_close?: boolean
}

const props = withDefaults(defineProps<IProps>(), {
  title: '',
  show_close: true
})

const title = computed(() => props.title)
</script>

<template lang="pug">
q-card(style="min-width: 350px; max-width: 100%;")
  q-bar.bg-gradient-dark.text-white
    span {{ title }}
    q-space
    q-btn(v-if="show_close" v-close-popup dense flat icon="close")
      q-tooltip Закрыть
  slot

</template>
