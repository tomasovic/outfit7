<template>
  <form @submit.prevent="submit">
    <v-card-title class="pa-6 pb-3">
      <p v-if="eventId > 0">EDIT EVENT</p>
      <p v-else>CREATE EVENT</p>
    </v-card-title>
    <v-text-field
      v-model="name"
      :error-messages="nameError"
      label="Name"
      variant="outlined"
    ></v-text-field>

    <v-text-field
      v-model="description"
      :error-messages="descriptionError"
      label="Description"
    ></v-text-field>

    <v-text-field
      v-model="priority"
      :error-messages="priorityError"
      label="Priority"
      max="10"
      min="0"
      type="number"
    ></v-text-field>

    <v-select
      v-model="type"
      :error-messages="typeError"
      :items="items"
      label="Type"
    ></v-select>

    <v-checkbox
      v-if="admin"
      v-model="approved"
      label="Approved"
      type="checkbox"
    ></v-checkbox>

    <v-container
      class="d-flex justify-center align-center justify-lg-space-evenly"
      fluid
    >
      <v-btn
        color="primary"
        type="submit"
      >
        submit
      </v-btn>

      <v-btn
        @click="handleReset">
        clear
      </v-btn>

      <v-btn
        color="error"
        @click="handleEventDelete"
      >
        delete
      </v-btn>
    </v-container>
  </form>
</template>

<script lang="ts">
import {onMounted, ref} from 'vue'
import {useField, useForm} from 'vee-validate'
import {useRoute} from 'vue-router'
import axios from 'axios'
import router from '@/router'
import useAlertStore from '@/store/alert'
import useUserStore from '@/store/user'


export default {
  name: 'EventForm',
  setup() {
    const route = useRoute()
    const eventId = route.params.id
    const alertStore = useAlertStore()
    const userStore = useUserStore()

    const items = ref([
      'crosspromo',
      'liveops',
      'app',
      'ads',
    ])

    const {handleSubmit, resetForm} = useForm({
      validationSchema: {
        name: 'required|min:3|max:100',
        description: 'required|min:3|max:500',
        priority: 'required|numeric|min_value:0|max_value:10',
        type: 'required|oneOf:crosspromo,liveops,app,ads',
      },
    })

    const {value: name, errorMessage: nameError} = useField('name')
    const {value: description, errorMessage: descriptionError} = useField('description')
    const {value: priority, errorMessage: priorityError} = useField('priority')
    const {value: type, errorMessage: typeError} = useField('type')
    const {value: approved} = useField('approved')

    onMounted(async () => {
      if (eventId) {
        try {
          const {data} = await axios.get(`/v1/events/${eventId}`)

          name.value = data.name
          description.value = data.description
          priority.value = data.priority
          type.value = data.type
          approved.value = data.approved
        } catch (err) {
          await alertStore.triggerAlert('error', err.response.data.message)
        }
      }
    })

    const submit = handleSubmit(async values => {
      console.log(values)
      const formattedValues = {
        ...values,
        priority: Number(values.priority),
        approved: values.approved === undefined ? false : values.approved,
      }


      if (eventId) {
        await handleEventUpdate(formattedValues)
      } else {
        await handleEventCreate(formattedValues)
      }
    })

    const handleEventUpdate = async (values) => {
      try {
        await axios.patch(`/v1/events/event/${eventId}`, values, {
          withCredentials: true,
        })
        await alertStore.triggerAlert('success', 'Event updated successfully.')
      } catch (err) {
        await alertStore.triggerAlert('error', err.response.data.message)
      }
    }

    const handleEventCreate = async (values) => {
      try {
        await axios.post('/v1/events', values)
        await router.push('/events')
        await alertStore.triggerAlert('success', 'Event created successfully')
      } catch (err) {
        await alertStore.triggerAlert('error', err.response.data.message)
      }
    }

    const handleEventDelete = async () => {
      try {
        const {status} = await axios.delete(`/v1/events/${eventId}`)
        if (status === 200) {
          await router.push('/events')
          await alertStore.triggerAlert('success', 'Event deleted successfully')
        }
      } catch (err) {
        await alertStore.triggerAlert('error', err.response.data.message)
      }
    }

    const handleReset = () => {
      resetForm()
    }

    return {
      name,
      nameError,
      description,
      descriptionError,
      priority,
      priorityError,
      type,
      typeError,
      approved,
      submit,
      handleReset,
      items,
      handleEventDelete,
      eventId,
      admin: userStore.user.admin
    }
  }
}
</script>
