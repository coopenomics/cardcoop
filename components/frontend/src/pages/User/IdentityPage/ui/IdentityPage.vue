<template lang="pug">
PersonalCard(:username="username")

</template>
<script lang="ts" setup>
import { PersonalCard } from 'src/widgets/User/PersonalCard/ui'

import { computed } from 'vue';
import { useCurrentUserStore } from 'src/entities/User';

const currentUser = useCurrentUserStore()

const username = computed(() => currentUser.username)

</script>
