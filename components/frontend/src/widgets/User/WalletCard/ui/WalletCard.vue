<template lang="pug">
div.q-pa-md

  div.row.justify-between.q-mt-lg
    div.col-md-4.col-xs-12
      WalletBalance
    div.col-md-4.col-xs-12.q-mt-lg

</template>

<script lang="ts" setup>
import { WalletBalance } from 'src/entities/Wallet/ui'

defineProps({
  username: {
    type: String,
    required: true,
  },
})

</script>
