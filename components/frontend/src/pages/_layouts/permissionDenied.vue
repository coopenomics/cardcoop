<template lang="pug">
div.row.justify-center
  q-card(flat bordered).q-pa-md.q-mt-lg
    q-card-section
      div.full-width.text-center
        q-badge(color="red").q-pa-sm
          q-icon(name="fa-regular fa-hand" size="48px")
      div(class="text-h4") Недостаточно прав доступа

    q-card-actions(align="center")
      q-btn(label="Вернуться" color="secondary" icon="fa fa-arrow-left" @click="goBack")
</template>
<script lang="ts" setup>
import { useRouter } from 'vue-router'
const router = useRouter()

function goBack() {
  router.push({ name: 'index' });
}
</script>