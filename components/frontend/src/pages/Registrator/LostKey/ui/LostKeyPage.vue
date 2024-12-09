<template lang="pug">
.row.justify-center.q-pa-sm
  .col-md-4.col-sm-6.col-xs-12
    LostKey.q-mt-lg
    q-btn(flat size="sm" @click="router.go(-1)") назад

</template>
<script lang="ts" setup>
import { LostKey } from 'src/widgets/Registrator/LostKey/ui';
import { useRouter } from 'vue-router';
const router = useRouter()

</script>
