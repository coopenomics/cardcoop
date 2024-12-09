<script setup lang="ts">
const emit = defineEmits(['cancel'])
interface IFormProps {
  handlerSubmit: (e?: Event) => Promise<void>
  isSubmitting?: boolean
  showSubmit?: boolean
  showCancel?: boolean
  buttonSubmitTxt?: string
  buttonCancelTxt?: string
}

withDefaults(defineProps<IFormProps>(), {
  isSubmitting: false,
  showCancel: true,
  showSubmit: true,
  buttonSubmitTxt: 'Продолжить',
  buttonCancelTxt: 'Отменить',
})

const cancel = (): void => {
  emit('cancel')
}
</script>

<template lang="pug">
q-form(@submit.prevent="handlerSubmit")
  template(#default)
    slot
    div.flex
      q-btn(v-if="showCancel" flat @click="cancel" size="sm") {{ buttonCancelTxt }}
      q-btn(v-if="showSubmit" size="sm" type="submit" :loading="isSubmitting" color="primary") {{ buttonSubmitTxt }}

</template>
