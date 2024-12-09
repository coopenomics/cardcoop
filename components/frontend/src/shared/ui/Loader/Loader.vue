<template lang='pug'>
div.bg-none.full-width.text-center.q-pt-lg.q-pb-lg
  q-spinner(size='50px', color='grey' style="margin: auto;").bg-none
  p(style='font-size:12px').full-width.text-center.text-grey {{ text }}
</template>

<script setup lang='ts'>
import { computed } from 'vue';

const props = defineProps({
  text: {
    type: String,
    required: false,
    default: ''
  }
});
const text = computed(() => props.text)

</script>
