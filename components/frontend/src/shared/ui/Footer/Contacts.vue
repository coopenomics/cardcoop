<template lang='pug'>
div.contact-footer.q-pa-xs.text-grey-7.text-center {{ text }}
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

<style>
.contact-footer {
  font-size: 12px !important;
}
</style>
