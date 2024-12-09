<template lang="pug">
div(v-if="currentUser?.username" flat bordered).q-pa-md
  div.row
    div.col-md-4.col-xs-12
      div(style="flex-grow: 1; display: flex; justify-content: center;")
        //- UserQR

        AutoAvatar(style="width: 125px;" :username="currentUser.username").q-pa-sm.q-pt-lg

    div.col-md-8.col-xs-12
      div
        div
          q-item
            q-item-section
              q-item-label(caption) Пайщик
              q-item-label {{ displayName }}


          q-item
            q-item-section
              q-item-label(caption) Зарегистрирован как
              q-item-label(v-if="userType === 'individual'") физическое лицо
              q-item-label(v-if="userType === 'entrepreneur'") индивидуальный предприниматель
              q-item-label(v-if="userType === 'organization'") юридическое лицо

          q-item
            q-item-section
              q-item-label(caption) Имя аккаунта
              q-item-label {{ currentUser.username }}

          q-item(v-if="userType === 'individual' && individualProfile")
            q-item-section
              q-item-label(caption) Дата рождения
              q-item-label {{ individualProfile.birthdate }}

          q-item(v-if="userType === 'organization' && organizationProfile")
            q-item-section
              q-item-label(caption) ИНН / ОГРН
              q-item-label {{ inn_ogrn }}

          q-item(v-if="userProfile")
            q-item-section
              q-item-label(caption) Телефон
              q-item-label {{ userProfile.phone }}

          q-item(v-if="userProfile")
            q-item-section
              q-item-label(caption) Почта
              q-item-label {{ userProfile.email }}

  </template>

<script lang="ts" setup>
import { UserQR } from '.';
import { AutoAvatar } from 'src/shared/ui/AutoAvatar';
import { useCurrentUserStore } from 'src/entities/User'
import type { IEntrepreneurData, IIndividualData, IOrganizationData } from 'src/shared/lib/types/user/IUserData';
import { computed } from 'vue';
const currentUser = useCurrentUserStore()

const userType = computed(() => currentUser.userAccount?.type)

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
<style>

</style>
