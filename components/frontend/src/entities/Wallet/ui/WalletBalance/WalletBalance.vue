<script setup lang="ts">
import { useWalletStore } from '../../model'
const walletStore = useWalletStore()
</script>

<template lang="pug">
q-list(flat).q-gutter-sm
  q-item
    q-item-section
      q-item-label(caption) Паевый счёт
      q-item-label(style="font-size: 20px;").text-bold {{ walletStore.wallet.available }}

  q-item
    q-item-section
      q-item-label(caption) Минимальный паевый счёт
      q-item-label(style="font-size: 20px;").text-bold {{ walletStore.wallet.minimum }}

  q-item
    q-item-section
      q-item-label(caption) Заблокировано в целевых программах
      q-item-label(style="font-size: 20px;").text-bold {{ walletStore.wallet.blocked }}


  q-item(v-for="program_wallet of walletStore.program_wallets" :key="program_wallet.id")
    q-item-section
      q-item-label(caption) {{ program_wallet.program_details.title }}

      q-item-label(style="font-size: 20px;").text-bold {{program_wallet.available}}

</template>
