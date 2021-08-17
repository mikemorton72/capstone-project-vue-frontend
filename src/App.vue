<template>
  <div id="app">
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container-fluid">
        <a class="navbar-brand" href="/">RunShare 🏃‍♂️</a>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <a
                class="nav-link"
                v-bind:class="{ active: isActiveNav('/') }"
                href="/"
                >Feed</a
              >
            </li>
            <li class="nav-item">
              <a
                class="nav-link"
                v-bind:class="{ active: isActiveNav('/users') }"
                href="/users"
                >Users</a
              >
            </li>
            <li class="nav-item dropdown">
              <a
                class="nav-link dropdown-toggle"
                href="#"
                id="navbarDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                v-bind:class="{ active: isActiveNav(`/users/${userId()}`) }"
              >
                Account
              </a>
              <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                <li v-if="jwt()">
                  <a class="dropdown-item" v-bind:href="`/users/${userId()}`"
                    >My Page</a
                  >
                </li>
                <li v-if="hasStrava() && jwt()">
                  <a class="dropdown-item" v-on:click="destroyStrava()"
                    >Unlink Strava</a
                  >
                </li>
                <li v-if="!hasStrava() && jwt()">
                  <a class="dropdown-item" v-bind:href="stravaOauthLink()"
                    >Link Strava</a
                  >
                </li>
                <li v-if="jwt()">
                  <a class="dropdown-item" href="/logout">Logout</a>
                </li>
                <li v-if="!jwt()">
                  <a class="dropdown-item" href="/login">Login</a>
                </li>
                <li v-if="!jwt()">
                  <a class="dropdown-item" href="/signup">Sign Up</a>
                </li>
              </ul>
            </li>
          </ul>
          <form class="d-flex">
            <input
              class="form-control me-2"
              type="search"
              placeholder="Users Search"
              aria-label="Search"
            />
            <button class="btn btn-outline-success" type="submit">
              Search
            </button>
          </form>
        </div>
      </div>
    </nav>
    <div class="container">
      <router-view
        v-bind:checkLoggedIn="checkLoggedIn"
        v-bind:addComment="addComment"
        v-bind:isCurrentUserFollowing="isCurrentUserFollowing"
        v-bind:createFollow="createFollow"
        v-bind:destroyFollow="destroyFollow"
        v-bind:showUser="showUser"
        v-bind:distanceFormat="distanceFormat"
        v-bind:timeFormat="timeFormat"
        v-bind:userId="userId"
        v-bind:hasStrava="hasStrava"
      />
    </div>
  </div>
</template>
<style>
#app {
  background-color: grey;
  min-height: 2000px;
}
</style>

<script>
import axios from "axios";
import numeral from "numeral";
export default {
  created: function () {
    if (this.$route.query.strava_initial_auth === "true") {
      localStorage.has_strava = "true";
    }
  },
  methods: {
    isActiveNav: function (route) {
      if (this.$route.path == route) {
        return true;
      } else {
        return false;
      }
    },
    distanceFormat: function (number) {
      return numeral(number).format("0.00");
    },
    timeFormat: function (time_seconds) {
      return numeral(time_seconds).format("00:00:00");
    },
    checkLoggedIn: function () {
      return new Promise((resolve, reject) => {
        if (localStorage.jwt) {
          resolve();
        } else {
          reject();
        }
      });
    },
    jwt: function () {
      return localStorage.jwt;
    },
    userId: function () {
      return localStorage.user_id;
    },
    hasStrava: function () {
      if (localStorage.has_strava === "false") {
        return false;
      } else {
        return true;
      }
    },
    stravaOauthLink: function () {
      let url = `https://www.strava.com/oauth/authorize?client_id=68303&response_type=code&redirect_uri=http://localhost:3000/strava_oauth/exchange_token&approval_prompt=force&scope=activity:read_all&state=${localStorage.user_id}`;
      return url;
    },
    destroyStrava: function () {
      axios.delete("/strava_oauth").then(() => {
        localStorage.has_strava = "false";
        this.$router.push("/?strava_removed=true");
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
    showUser: function (user_id) {
      this.$router.push(`/users/${user_id}`);
    },
  },
};
</script>
