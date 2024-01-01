<template>
  <Form v-slot="{ errors }" @submit="handleSubmit">
    <v-card class="pa-12 pb-8" elevation="8" rounded="lg">
      <Field v-slot="{ field }" name="email" rules="required|email">
        <v-text-field v-model="email"
                      :error-messages="errors.email"
                      label="Email"
                      placeholder="Email address"
                      prepend-inner-icon="mdi-email-outline"
                      v-bind="field"
                      variant="outlined"></v-text-field>
      </Field>
      <Field v-slot="{ field }" name="password" rules="required|min:2">
        <v-text-field v-model="password"
                      :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
                      :error-messages="errors.password"
                      :type="visible ? 'text' : 'password'"
                      label="Password"
                      placeholder="Enter your password"
                      prepend-inner-icon="mdi-lock-outline"
                      v-bind="field"
                      variant="outlined"
                      @click:append-inner="visible = !visible"></v-text-field>
      </Field>
      <Field v-slot="{ field }" name="confirm_password" rules="required|passwords_mismatch:@password">
        <v-text-field v-model="confirm_password"
                      :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
                      :error-messages="errors.confirm_password"
                      :type="visible ? 'text' : 'password'"
                      label="Confirm Password"
                      placeholder="Confirm your password"
                      prepend-inner-icon="mdi-lock-outline"
                      v-bind="field"
                      variant="outlined"
                      @click:append-inner="visible = !visible"></v-text-field>
      </Field>
      <v-btn :disabled="inSubmission"
             block
             class="mb-8"
             color="blue"
             size="large"
             type="submit"
             variant="tonal">
        Register
      </v-btn>
      <v-card-text class="text-center">
        <router-link class="text-blue text-decoration-none" to="/login">
          You have an account? Login here
        </router-link>
      </v-card-text>
    </v-card>
  </Form>
</template>

<script>
import {Field, Form} from 'vee-validate'

export default {
  components: {Field, Form},
  props: {
    inSubmission: Boolean,
    onRegister: Function
  },
  data() {
    return {
      email: '',
      password: '',
      confirm_password: '',
      visible: false
    }
  },
  methods: {
    handleSubmit() {
      if (this.onRegister) {
        this.onRegister({
          email: this.email,
          password: this.password,
          confirm_password: this.confirm_password
        })
      }
    }
  }
}
</script>

<style scoped>
</style>
