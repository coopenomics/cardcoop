<template lang="pug">
div
  q-img(:src="ava").bg-grey.rounded-borders
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { createAvatar } from '@dicebear/core'
import { rings } from '@dicebear/collection'

const ava = ref('')

const props = defineProps({
  username: {
    type: String,
    required: true,
  },
})

const username = computed(() => props.username)

onMounted(async () => {
  if (username.value) {
    const avatar = createAvatar(rings, {
      seed: username.value,
      ringColor: ['4db6ac'],
    })
    const blob = new Blob([avatar.toString()], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)

    ava.value = url

  }

})

</script>
