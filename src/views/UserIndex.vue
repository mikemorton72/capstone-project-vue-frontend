<template>
  <div>
    <h1>User Index</h1>
    <hr />
    <div v-for="user in users" v-bind:key="user.id">
      <p>{{ user.id }}</p>
      <p>{{ user.name }}</p>
      <p>Total miles: {{ user.total_miles }}</p>
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
        let userIndex = response.data;
        userIndex.splice(userIndex.indexOf(parseInt(localStorage.user_id)), 1); //removes currently logged in user from list
        this.users = userIndex;
      });
    },
    isCurrentUserFollowing: function (user) {
      let user_ids = user.follower_ids.map((element) => element.id);
      return user_ids.includes(parseInt(localStorage.user_id));
    },
    createFollow: function (user) {
      axios
        .post(`/follows/${user.id}`)
        .then(() => {
          user.follower_ids.push({ id: parseInt(localStorage.user_id) });
        })
        .catch((errors) => {
          console.log(errors.response.data.errors);
        });
    },
    destroyFollow: function (user) {
      axios
        .delete(`follows/${user.id}`)
        .then(() => {
          user.follower_ids.splice(
            user.follower_ids.indexOf({ id: parseInt(localStorage.user_id) }),
            1
          );
        })
        .catch((errors) => {
          console.log(errors.response.data.errors);
        });
    },
  },
};
</script>
