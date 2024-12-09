<template lang="pug">
.row.justify-center
  div.documents-gap.col-md-8.col-xs-12
    BaseDocument(:doc="complexDocument.statement.document" :action="complexDocument.statement.action")
    BaseDocument(v-if="complexDocument.decision && complexDocument.decision.document" :doc="complexDocument.decision.document" :action="complexDocument.decision.action")

    BaseDocument(v-for="doc in complexDocument.links" v-bind:key="doc.hash" :doc="doc" :action="complexDocument.statement.action")

</template>

<script setup lang="ts">
import { computed } from 'vue'
import { BaseDocument } from '../BaseDocument';
import { Cooperative } from 'cooptypes'

const props = defineProps({
  documents: {
    type: Object as () => Cooperative.Document.IComplexDocument,
    required: true
  },
})

const complexDocument = computed(() => props.documents)

</script>
