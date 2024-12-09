<template lang="pug">
div(v-if="userData.individual_data").q-gutter-md.q-mt-md
  slot(name="top")
  q-input(v-model="userData.individual_data.last_name" standout="bg-teal text-white" hint="Иванов" label="Фамилия" :rules="[val => notEmpty(val), val => validatePersonalName(val)]" autocomplete="off")
  q-input(v-model="userData.individual_data.first_name" standout="bg-teal text-white" hint="Иван" label="Имя" :rules="[val => notEmpty(val), val => validatePersonalName(val)]" autocomplete="off")
  q-input(v-model="userData.individual_data.middle_name" standout="bg-teal text-white" hint="Иванович" label="Отчество" :rules="[val => validatePersonalName(val)]" autocomplete="off")

  q-input(v-model="userData.individual_data.full_address" standout="bg-teal text-white" hint="г. Москва, ул. Арбат, д.12" label="Адрес регистрации (как в паспорте)" :rules="[val => notEmpty(val)]" autocomplete="off")

  q-input(
    standout="bg-teal text-white"
    v-model="userData.individual_data.birthdate"
    mask="date"
    label="Дата рождения"
    hint="Формат: год/месяц/день"
    :rules="['date', val => notEmpty(val)]"
    autocomplete="off"
  )
    template(v-slot:append)
      q-icon(name="event" class="cursor-pointer")
        q-popup-proxy(cover transition-show="scale" transition-hide="scale")
          q-date(v-model="userData.individual_data.birthdate")
            .row.items-center.justify-end
              q-btn(v-close-popup label="Close" color="primary" flat)

  q-input(v-model="userData.individual_data.phone" standout="bg-teal text-white" mask="+7 (###) ###-##-##" fill-mask label="Номер телефона" hint="+7 (###) ###-##-##" :rules="[val => notEmpty(val), val => notEmptyPhone(val)]" autocomplete="off")

</template>
<script setup lang="ts">
import { ref } from 'vue'
import { validatePersonalName, notEmpty, notEmptyPhone } from 'src/shared/lib/utils';

import type { IUserData } from 'src/shared/lib/types/user/IUserData';

const props = defineProps<{ userData: IUserData }>();

const userData = ref<IUserData>(props.userData)


</script>
