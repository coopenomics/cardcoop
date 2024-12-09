<script setup lang="ts">
import { useWalletStore } from '../../model'
const walletStore = useWalletStore()
</script>

<template lang="pug">
div.q-pa-md
  q-list
    q-item(v-for="program_wallet of walletStore.program_wallets" :key="program_wallet.id" v-ripple clickable)
      q-item-section
        q-item-label {{ program_wallet.program_details.title }}
      q-item-section(side )
        q-item-label(caption) {{program_wallet.available}}

</template>
