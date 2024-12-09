<template lang="pug">
div.q-pa-md
  div.row.q-pt-md
    div.col-md-6.col-xs-12
      q-card(bordered flat round class="cooperative-card" style="border-radius: 20px;")
        div.flex.justify-between
          AutoAvatar(style="width: 60px;" :username="currentUser.username").q-pa-sm.q-pt-lg
          div.text-right.q-pa-sm
            div(style="letter-spacing: 3px;").text-grey VIRTUAL
            div.text-overline
              span 01/2106
        div.q-pa-sm
          q-badge(style="font-size: 10px") {{formattedUsername.toUpperCase()}}
          div.text-subtitle2 {{displayName}}

    div.col-md-6.col-xs-12.q-mt-lg
      WalletBalance

</template>

<script lang="ts" setup>
import { AutoAvatar } from 'src/shared/ui/AutoAvatar';

import { useCurrentUserStore } from 'src/entities/User'
import type { IEntrepreneurData, IIndividualData, IOrganizationData } from 'src/shared/lib/types/user/IUserData';
import { computed } from 'vue';
const currentUser = useCurrentUserStore()

const userType = computed(() => currentUser.userAccount?.type)

const formattedUsername = computed(() => {
  return currentUser.username.replace(/(.{3})/g, '$1 ').trim();
});

const individualProfile = computed(() => {
  if (userType.value === 'individual') {
    return currentUser.userAccount?.private_data as IIndividualData
  }
  return null
})

const entrepreneurProfile = computed(() => {
  if (userType.value === 'entrepreneur') {
    return currentUser.userAccount?.private_data as IEntrepreneurData
  }
  return null
})

const organizationProfile = computed(() => {
  if (userType.value === 'organization') {
    return currentUser.userAccount?.private_data as IOrganizationData
  }
  return null
})

const userProfile = computed(() => {
  if (userType.value === 'individual' || userType.value === 'entrepreneur') {
    return individualProfile?.value || entrepreneurProfile?.value
  }
  return organizationProfile?.value
})

const displayName = computed(() => {
  if (userType.value === 'individual') {
    return `${individualProfile.value?.last_name} ${individualProfile.value?.first_name} ${individualProfile.value?.middle_name}`
  } else if (userType.value === 'entrepreneur') {
    return `${entrepreneurProfile.value?.last_name} ${entrepreneurProfile.value?.first_name} ${entrepreneurProfile.value?.middle_name}`
  } else {
    return organizationProfile.value?.short_name
  }
})

const inn_ogrn = computed(() => {
  if (organizationProfile.value)
    return `${organizationProfile.value.details.inn} / ${organizationProfile.value.details.ogrn}`
  else return ''
})

</script>
<style lang="scss" scoped>
.cooperative-card {
  max-width: 400px;
  width: 100%;
}
</style>
