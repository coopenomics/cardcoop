<template lang="pug">

q-card(style="word-break: break-all !important; white-space: normal !important;").q-pa-md
  div(v-if="loading").full-width.text-center
    div(style="margin:auto;").flex.q-pa-sm.full-width.text-center
      q-spinner
      span.q-ml-sm.text-grey подговка {{doc.meta.title}}
  div(v-if="!loading")

    div(v-html="safeHtml").description.q-pa-xs

    div.row.q-mt-lg.q-pa-sm.justify-center
      q-card(style="word-break: break-all !important; text-wrap: pretty;" flat).col-md-8.col-xs-12.q-pa-sm.verify-card
        div.q-mr-lg.q-mt-md
          q-badge(:color="doc.hash == regeneratedHash ? 'teal' : 'red'").text-center.q-pa-xs
            q-icon(:name="doc.hash == regeneratedHash ? 'check_circle' : 'cancel'" ).q-mr-sm
            span контрольная сумма
          p.q-mr-lg.q-ml-lg.text-grey {{ doc.hash }}

        div.q-mr-lg.q-mt-md
          q-badge(:color="signature_verified ? 'teal' : 'red'").text-center.q-pa-xs
            q-icon(:name="signature_verified ? 'check_circle' : 'cancel'" ).q-mr-sm
            span цифровая подпись
          p.q-mr-lg.q-ml-lg.text-grey {{ actionDocumentData?.document?.signature }}

        div.q-mr-lg.q-mt-md
          q-badge(:color="signature_verified ? 'teal' : 'red'").text-center.q-pa-xs
            q-icon(:name="signature_verified ? 'check_circle' : 'cancel'" ).q-mr-sm
            span публичный ключ
          p.q-mr-lg.q-ml-lg.text-grey {{ actionDocumentData?.document?.public_key }}

        div.text-center.q-gutter-sm
          q-btn(size="sm" color="primary" icon="download" @click="download") скачать
          //- q-btn(size="sm" color="primary" icon="download" @click="download2") скачать2

          q-btn(size="sm" color="primary" icon="fa-solid fa-check-double" @click="regenerate" :loading="onRegenerate") сверить

</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Cooperative, SovietContract } from 'cooptypes'
import { Signature, PublicKey } from '@wharfkit/antelope';
import { useGlobalStore } from 'src/shared/store';
import DOMPurify from 'dompurify';
import { DigitalDocument } from 'src/entities/Document';
import { FailAlert, SuccessAlert } from 'src/shared/api';

const props = defineProps({
  action: {
    type: Object as () => Cooperative.Blockchain.IExtendedAction,
    required: true,
  },
  doc: {
    type: Object as () => Cooperative.Document.IGeneratedDocument,
    required: true
  }
})

const actionDocumentData = ref(props.action.data as SovietContract.Actions.Registry.NewSubmitted.INewSubmitted)
const doc = ref(props.doc)
const loading = ref(false)
const signature_verified = ref(false)

const regeneratedHash = ref()
const onRegenerate = ref(false)
const regenerated = ref()

const regenerate = async() => {
  try {
    onRegenerate.value = true

    regenerated.value = await new DigitalDocument().generate({...doc.value.meta}, {skip_save: true})

    if (regenerated.value.hash == regeneratedHash.value)
      SuccessAlert('Сверка прошла успешно: аналогичный документ восстановлен из исходных данных')
    else
      FailAlert('Сверка прошла безуспешно: аналогичный документ невозможно получить из исходных данных')

    onRegenerate.value = false
  } catch(e){
    onRegenerate.value = false
  }
}

// Функция для декодирования и очистки HTML
function sanitizeHtml(html: string) {
  return DOMPurify.sanitize(html);
}

const safeHtml = computed(() => sanitizeHtml(doc.value.html));


const hashBuffer = async () => {
  // Декодирование из base64
  const binaryString = window.atob(doc.value.binary.toString());

  const len = binaryString.length;

  const data = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    data[i] = binaryString.charCodeAt(i);
  }

  // Вычисление хэша из декодированных бинарных данных
  regeneratedHash.value = (await useGlobalStore().hashMessage(data)).toUpperCase();
}

hashBuffer()


const verifySignature = () => {
  const public_key = PublicKey.from(actionDocumentData.value.document.public_key)
  const signature = Signature.from(actionDocumentData.value.document.signature)
  const hash = actionDocumentData.value.document.hash
  signature_verified.value = signature.verifyDigest(hash, public_key)
}

verifySignature()

// TODO удалить позже
// использовали для отладки сверки. Позволяет скачать регенерированный документ после нажатия на кнопку сверки.
// async function download2() {
//   // Преобразование base64 строки в Blob
//   console.log('regenerated: ', regenerated)
//   const binaryData = new Uint8Array(Object.values(regenerated.value.binary));
//   const blob = new Blob([binaryData], { type: 'application/pdf' });

//   // Создание временной ссылки для скачивания файла
//   const link = document.createElement('a');
//   link.href = URL.createObjectURL(blob);
//   link.download = regenerated.value.full_title ? regenerated.value.full_title : `${regenerated.value.meta.title} - ${regenerated.value.meta.username} - ${regenerated.value.meta.created_at}.pdf`;

//   // Имитация клика по ссылке для начала скачивания
//   document.body.appendChild(link);
//   link.click();

//   // Очистка после скачивания
//   document.body.removeChild(link);
//   URL.revokeObjectURL(link.href);
// }


async function download() {
  // Преобразование base64 строки в Blob
  const response = await fetch(`data:application/pdf;base64,${doc.value.binary.toString()}`);
  const blob = await response.blob();

  // Создание временной ссылки для скачивания файла
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = doc.value.full_title ? doc.value.full_title : `${doc.value.meta.title} - ${doc.value.meta.username} - ${doc.value.meta.created_at}.pdf`;

  // Имитация клика по ссылке для начала скачивания
  document.body.appendChild(link);
  link.click();

  // Очистка после скачивания
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}

</script>
<style>
.description table {
  width: 100%;
  /* или другая фиксированная ширина */
  table-layout: fixed;
}

.description td {
  word-break: break-all !important;
  word-wrap: break-word !important;
  white-space: normal !important;
}

.digital-document .header {
  text-align: center;
  word-break: break-word !important;
}

.description {
  font-size: 14px;
  white-space: pre-wrap;
}

.description p {
  margin: 0 !important;
}

.verify-card {
  font-size: 10px !important;
}

</style>
