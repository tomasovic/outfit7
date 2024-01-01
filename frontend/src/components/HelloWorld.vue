<template>
  <v-container class="fill-height">
    <v-responsive class="align-center text-center fill-height mt-10">
      <v-img height="300" src="@/assets/logo.svg"/>
      <h1 class="text-h2 font-weight-bold">Events7</h1>
      <div class="py-14"/>
      <v-row class="d-flex align-center justify-center">
        <v-col cols="auto">
          <v-btn
            color="primary"
            href="/login"
            min-width="228"
            size="x-large"
            variant="flat"
          >
            <v-icon
              icon="mdi-login"
              size="large"
              start
            />
            Login
          </v-btn>
        </v-col>

        <v-col cols="auto">
          <v-btn
            href="/register"
            min-width="164"
            variant="text"
          >
            <v-icon
              icon="mdi-account-plus"
              size="large"
              start
            />
            Register
          </v-btn>
        </v-col>
      </v-row>
    </v-responsive>
  </v-container>
</template>

<script lang="ts" setup>
//
</script>
