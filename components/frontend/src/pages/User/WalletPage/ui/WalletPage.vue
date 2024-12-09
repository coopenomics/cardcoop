<template lang="pug">
WalletCard(:username="username")
</template>
<script lang="ts" setup>
import { WalletCard } from 'src/widgets/User/WalletCard'

import { computed } from 'vue';
import { useCurrentUserStore } from 'src/entities/User';

const currentUser = useCurrentUserStore()

const username = computed(() => currentUser.username)

</script>
