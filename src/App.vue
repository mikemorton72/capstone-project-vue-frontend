<template>
  <div id="app">
    <div id="nav">
      <!-- <router-link to="/">Home</router-link> | -->
      <router-link to="/">Feed</router-link> |
      <router-link to="/runs/new">New Run</router-link> |
      <router-link to="/users">Users</router-link> |
      <router-link to="/signup">Signup</router-link> |
      <router-link to="/login">Login</router-link> |
      <router-link to="/logout">Logout</router-link>
    </div>
    <router-view
      v-bind:checkLoggedIn="checkLoggedIn"
      v-bind:addComment="addComment"
      v-bind:isCurrentUserFollowing="isCurrentUserFollowing"
      v-bind:createFollow="createFollow"
      v-bind:destroyFollow="destroyFollow"
      v-bind:showUser="showUser"
    />
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>

<script>
import axios from "axios";
export default {
  methods: {
    checkLoggedIn: function () {
      return new Promise((resolve, reject) => {
        if (localStorage.jwt) {
          resolve();
        } else {
          reject();
        }
      });
    },
    addComment: function (run) {
      axios
        .post("/comments", { run_id: run.id, text: run.newComment })
        .then((response) => {
          run.comments.push(response.data);
          run.newComment = "";
        })
        .catch((errors) => {
          console.log(errors.resposne.data.errors);
        });
    },
    isCurrentUserFollowing: function (user) {
      if (user.follower_ids) {
        let user_ids = user.follower_ids.map((element) => element.id);
        return user_ids.includes(parseInt(localStorage.user_id));
      } else {
        return false;
      }
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
    showUser: function (user) {
      this.$router.push(`/users/${user.id}`);
    },
  },
};
</script>
