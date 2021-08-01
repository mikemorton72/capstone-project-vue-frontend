<template>
  <div>
    <h1>User Index</h1>
    <div v-if="!loggedIn">Please log in to view users</div>
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
  props: ["checkLoggedIn"],
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
          for (let i = 0; i < user.follower_ids.length; i++) {
            if (user.follower_ids[i].id === parseInt(localStorage.user_id)) {
              user.follower_ids.splice(i, 1);
            }
          }
        })
        .catch((errors) => {
          console.log(errors.response.data.errors);
        });
    },
  },
};
</script>
