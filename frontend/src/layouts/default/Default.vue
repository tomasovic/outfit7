<template>
  <v-container class="fill-height">
    <v-responsive class="align-center text-center fill-height mt-10">
      <v-app>
        <default-bar/>
        <default-view/>
      </v-app>
    </v-responsive>
  </v-container>
</template>

<script lang="ts">
import DefaultBar from '@/layouts/default/AppBar.vue'
import DefaultView from '@/layouts/default/View.vue'

export default {
  name: 'AppDefaults',
  components: {DefaultBar, DefaultView},
}
</script>
