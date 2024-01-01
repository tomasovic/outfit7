<template>
  <v-app id="inspire">
    <v-main class="bg-grey-lighten-3">
      <v-container>
        <v-row>
          <v-col>
            <v-sheet min-height="70vh" rounded="lg">
              <v-card class="employee-list mb-1">
                <v-card-title class="pa-6 pb-3">
                  <p>Events List</p>
                  <v-spacer></v-spacer>
                  <v-text-field
                    v-model="searchQuery"
                    hide-details
                    label="Search"
                    single-line
                    @input="handleSearch"
                  ></v-text-field>
                </v-card-title>
                <v-data-table-server
                  :headers="headers"
                  :items="serverItems"
                  :items-length="totalItems"
                  :items-per-page="itemsPerPage"
                  :items-per-page-options="itemsPerPageOptions"
                  :loading="loading"
                  :search="searchQuery"
                  class="hoverable-rows"
                  item-key="id"
                  item-value="name"
                  @click:row="selectEvent"
                  @update:options="fetchData"
                >
                  <template v-slot:item.priority="{ item }">
                    <v-chip
                      :color="item.priority === 'high' ? 'red' : item.priority === 'medium' ? 'orange' : 'green'"
                      dark
                      label
                    >
                      {{ item.priority }}
                    </v-chip>
                  </template>
                  <template v-slot:item.approved="{ item }">
                    <v-chip
                      :color="item.approved ? 'green' : 'red'"
                      dark
                      label
                    >
                      {{ item.approved ? 'Approved' : 'Not Approved' }}
                    </v-chip>
                  </template>
                </v-data-table-server>
              </v-card>
            </v-sheet>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import axios from 'axios'
import {buildQueryString} from '@/utils/queryParamBuilder'

export default {
  name: 'EventsView',
  data() {
    return {
      itemsPerPageOptions: [5, 10, 20, 50, 100],
      selectedEvent: null,
      itemsPerPage: 10,
      serverItems: [],
      totalItems: 0,
      loading: true,
      searchQuery: '',
      options: {},
      headers: [
        {title: 'ID', key: 'id', value: 'id'},
        {title: 'Approved', key: 'approved', value: 'approved'},
        {title: 'Name', key: 'name', value: 'name'},
        {title: 'Description', key: 'description', value: 'description', align: 'center'},
        {title: 'Type', key: 'type', value: 'type'},
        {title: 'Priority', key: 'priority', value: 'priority'},
      ],
      params: {
        page: 1,
        limit: 10,
        sort: 'id',
        order: 'desc',
        name: null,
        desc: null,
        type: null,
        approved: null,
        priority: null,
      }
    }
  },
  methods: {
    selectEvent(item, index) {
      this.$router.push({name: 'event', params: {id: index.item.id}})
    },
    handleSearch() {
      this.params.desc = this.searchQuery
      this.fetchData(this.options)
    },
    async fetchData(options) {
      this.loading = true
      try {
        this.params.page = options.page || 1
        this.params.limit = options.itemsPerPage || 10

        if (options.sortBy && options.sortBy.length) {
          this.params.sort = options.sortBy[0].key
          this.params.order = options.sortDesc && options.sortDesc[0] ? 'asc' : 'desc'
        } else {
          delete this.params.sort
          delete this.params.order
        }

        const queryString = buildQueryString(this.params)
        const url = `v1/events?${queryString}`
        const {data} = await axios.get(url)
        this.items = data
        this.totalItems = parseInt(data.total)
        this.serverItems = data.events
      } catch (err) {
        // TODO: Handle error
        console.log(err)
      } finally {
        this.loading = false
      }
    },
  },
  // created() {
  //   this.handleSearch = _.debounce(this.handleSearch, 400)
  // },
  // mounted() {
  //   this.fetchData({page: 1, itemsPerPage: 10, sortBy: ['id']})
  // }
}
</script>

<style>
.hoverable-rows .v-data-table__tr:hover {
  background-color: #f5f5f5; /* Adjust the color as needed */
  cursor: pointer;
}
</style>
