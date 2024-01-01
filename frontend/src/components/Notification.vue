<template>
  <teleport to="#notification">
    <v-alert v-if="showAlert" :text="alertMsg" :type="alertVariant" closable variant="tonal"/>
  </teleport>
</template>

<script lang="ts">
import {mapState} from 'pinia'
import useAlertStore from '@/store/alert'

export default {
  name: 'AppNotification',
  computed: {
    ...mapState(useAlertStore, ['showAlert', 'alertVariant', 'alertMsg']),
  },
}
</script>
fn
<style scoped>
</style>
