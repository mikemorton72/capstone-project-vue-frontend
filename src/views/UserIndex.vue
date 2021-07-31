<template>
  <div>
    <h1>User Index</h1>
    <hr />
    <div v-for="user in users" v-bind:key="user.id">
      <!-- <p>{{ user }}</p> -->
      <p>{{ user.name }}</p>
      <p>Total miles: {{ user.total_miles }}</p>
      <hr />
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data: function () {
    return {
      users: {},
    };
  },
  created: function () {
    this.getUsers();
  },
  methods: {
    getUsers: function () {
      axios.get("/users").then((response) => {
        this.users = response.data;
      });
    },
  },
};
</script>
