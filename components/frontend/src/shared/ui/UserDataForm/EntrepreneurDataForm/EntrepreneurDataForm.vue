<template lang="pug">
div(v-if="userData.entrepreneur_data").q-gutter-md.q-mt-md
  q-input(v-model="userData.entrepreneur_data.last_name" standout="bg-teal text-white" hint="Иванов" label="Фамилия" :rules="[val => notEmpty(val), val => validatePersonalName(val)]" autocomplete="off")
  q-input(v-model="userData.entrepreneur_data.first_name" standout="bg-teal text-white" hint="Иван" label="Имя" :rules="[val => notEmpty(val), val => validatePersonalName(val)]" autocomplete="off")
  q-input(v-model="userData.entrepreneur_data.middle_name" standout="bg-teal text-white" hint="Иванович" label="Отчество" :rules="[val => validatePersonalName(val)]" autocomplete="off")

  q-input(
    standout="bg-teal text-white"
    v-model="userData.entrepreneur_data.birthdate"
    mask="date"
    label="Дата рождения"
    hint="Формат: год/месяц/день"
    :rules="['date', val => notEmpty(val)]"
    autocomplete="off"
  )
    template(v-slot:append)
      q-icon(name="event" class="cursor-pointer")
        q-popup-proxy(cover transition-show="scale" transition-hide="scale")
          q-date(v-model="userData.entrepreneur_data.birthdate")
            .row.items-center.justify-end
              q-btn(v-close-popup label="Close" color="primary" flat)

  q-input(v-model="userData.entrepreneur_data.phone" standout="bg-teal text-white" mask="+7 (###) ###-##-##" fill-mask label="Номер телефона" hint="+7 (###) ###-##-##" :rules="[val => notEmpty(val), val => notEmptyPhone(val)]" autocomplete="off")

  q-select(v-model="userData.entrepreneur_data.country" standout="bg-teal text-white" map-options emit-value option-label="label" option-value="value" label="Страна" :options="[{ label: 'Россия', value: 'Russia' }]" :rules="[val => notEmpty(val)]" autocomplete="off")

  q-input(v-model="userData.entrepreneur_data.city" standout="bg-teal text-white" label="Город" hint="Москва" :rules="[val => notEmpty(val)]" autocomplete="off")
  q-input(v-model="userData.entrepreneur_data.full_address" standout="bg-teal text-white" label="Адрес регистрации (как в паспорте)" hint="г. Москва, ул. Арбат, д.12" :rules="[val => notEmpty(val)]" autocomplete="off")

  q-input(
    v-model="userData.entrepreneur_data.details.inn"
    standout="bg-teal text-white"
    mask="############"
    label="ИНН предпринимателя"
    hint="10 или 12 цифр"
    :rules="[val => notEmpty(val), val => (val.length === 10 || val.length === 12) || 'ИНН должен содержать 10 или 12 цифр']"
    autocomplete="off"
  )
  q-input(
    v-model="userData.entrepreneur_data.details.ogrn"
    standout="bg-teal text-white"
    mask="###############"
    label="ОГРНИП"
    hint="13 или 15 цифр"
    :rules="[val => notEmpty(val), val => (val.length === 13 || val.length === 15) || 'ОГРНИП должен содержать 13 или 15 цифр']"
    autocomplete="off"
  )

  q-input(
    v-model="userData.entrepreneur_data.bank_account.bank_name"
    standout="bg-teal text-white"
    label="Наименование банка"
    hint="ПАО Сбербанк"
    :rules="[val => notEmpty(val)]"
    autocomplete="off"
  )

  q-input(
    v-model="userData.entrepreneur_data.bank_account.details.corr"
    standout="bg-teal text-white"
    mask="####################"
    label="Корреспондентский счёт"
    hint="20 цифр"
    :rules="[val => notEmpty(val), val => val.length === 20 || 'Корреспондентский счёт должен содержать 20 цифр']"
    autocomplete="off"
  )

  q-input(
    v-model="userData.entrepreneur_data.bank_account.details.bik"
    standout="bg-teal text-white"
    mask="#########"
    label="БИК"
    hint="9 цифр"
    :rules="[val => notEmpty(val), val => val.length === 9 || 'БИК должен содержать 9 цифр']"
  )

  q-input(
    v-model="userData.entrepreneur_data.bank_account.details.kpp"
    standout="bg-teal text-white"
    mask="#########"
    label="КПП (банка)"
    hint="9 цифр"
    :rules="[val => notEmpty(val), val => val.length === 9 || 'КПП должен содержать 9 цифр']"
    autocomplete="off"
  )

  q-select(v-model="userData.entrepreneur_data.bank_account.currency"
    label="Валюта счёта"
    standout="bg-teal text-white"
    :options="[{ label: 'RUB', value: 'RUB' }]"
    emit-value
    map-options
  )

  q-input(
    v-model="userData.entrepreneur_data.bank_account.account_number"
    standout="bg-teal text-white"
    mask="####################"
    label="Номер счёта"
    hint="20 цифр"
    :rules="[val => notEmpty(val), val => val.length === 20 || 'Номер счёта должен содержать 20 цифр']"
    autocomplete="off"
  )
</template>
<script setup lang="ts">
import { validatePersonalName, notEmpty, notEmptyPhone } from 'src/shared/lib/utils';

import type { IUserData } from 'src/shared/lib/types/user/IUserData';
import { ref } from 'vue';

const props = defineProps<{ userData: IUserData }>();

const userData = ref<IUserData>(props.userData)

</script>
