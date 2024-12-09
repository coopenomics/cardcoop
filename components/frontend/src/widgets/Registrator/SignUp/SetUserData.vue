<template lang="pug">
div(v-if="step")
  q-step(
    :name="2"
    title="Заполните форму заявления на вступление"
    :done="step > 2"
  )

    UserDataForm(v-model:userData="store.userData")
      template(#bottom="{userDataForm}")
        q-checkbox(v-model='store.agreements.condidential' full-width standout="bg-teal text-white").q-mt-lg
          | Я даю своё согласие на обработку своих персональных данных в соответствии с политикой конфиденциальности

        q-btn(flat, @click="store.step--")
          i.fa.fa-arrow-left
          span.q-ml-md назад

        q-btn(
          :disabled="!store.agreements.condidential"
          color="primary"
          label="Продолжить"
          @click="setData(userDataForm)"
        ).q-mt-lg.q-mb-lg
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { UserDataForm } from 'src/shared/ui/UserDataForm/UserDataForm';

import { useRegistratorStore } from 'src/entities/Registrator'

const store = useRegistratorStore().state

const step = computed(() => store.step)


const setData = (userDataForm: any) => {
  userDataForm.validate().then(async (success: boolean) => {
    if (success) {
      store.step = store.step + 1
    } else {
      const firstInvalid = document.querySelector('.q-field--error .q-field__native');
      if (firstInvalid) {
        firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return
    }
  })
}


</script>
<style>
.dataInput .q-btn-selected {
  color: teal;
}
</style>
