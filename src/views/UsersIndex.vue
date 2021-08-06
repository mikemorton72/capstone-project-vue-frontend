<template>
  <div>
    <h1>User Index</h1>
    <div v-if="!loggedIn">Please log in to view users</div>
    <hr />
    <div v-for="user in users" v-bind:key="user.id">
      <p>{{ user.id }}</p>
      <p v-on:click="showUser(user)" v-bind:key="user.id">{{ user.name }}</p>
      <p>Total miles: {{ distanceFormat(user.total_miles) }}</p>
      <button
        v-if="isCurrentUserFollowing(user)"
        v-on:click="destroyFollow(user)"
      >
        Unfollow
      </button>
      <button
        v-if="!isCurrentUserFollowing(user)"
        v-on:click="createFollow(user)"
      >
        Follow
      </button>
      <hr />
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  props: [
    "checkLoggedIn",
    "createFollow",
    "destroyFollow",
    "isCurrentUserFollowing",
    "showUser",
    "distanceFormat",
  ],
  data: function () {
    return {
      users: {},
      loggedIn: false,
    };
  },
  created: function () {
    this.checkLoggedIn()
      .then(() => {
        this.getUsers();
        this.loggedIn = true;
      })
      .catch(() => {
        this.loggedIn = false;
      });
  },
  methods: {
    getUsers: function () {
      axios.get("/users").then((response) => {
        let userIndex = response.data;
        for (let i = 0; i < userIndex.length; i++) {
          if (userIndex[i].id === parseInt(localStorage.user_id)) {
            userIndex.splice(i, 1);
          }
        }
        this.users = userIndex;
      });
    },
  },
};
</script>
