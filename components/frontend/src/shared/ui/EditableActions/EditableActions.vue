<template lang="pug">
  div.q-gutter-sm
    q-btn(
      :disabled="isDisabled"
      size="sm"
      v-if="isEditing"
      @click="$emit('save')"
      color="primary"
      label="Сохранить"
    )
    q-btn(
      size="sm"
      flat
      v-if="isEditing"
      @click="$emit('cancel')"
      color="negative"
      label="Отменить"
    )
  </template>

  <script lang="ts" setup>
  defineProps({
    isEditing: {
      type: Boolean,
      required: true
    },
    isDisabled: {
      type: Boolean,
      required: false,
    }
  });

  defineEmits(['save', 'cancel']);
  </script>
