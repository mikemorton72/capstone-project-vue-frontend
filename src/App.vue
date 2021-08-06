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
              <a class="nav-link active" aria-current="page" href="/">Feed</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/users">Users</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/runs/new">Add Run</a>
            </li>
            <li class="nav-item dropdown">
              <a
                class="nav-link dropdown-toggle"
                href="#"
                id="navbarDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                My Account
              </a>
              <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                <li v-if="jwt()">
                  <a class="dropdown-item" v-bind:href="`/users/${userId()}`"
                    >My Page</a
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
    />
  </div>
</template>

<style></style>

<script>
import axios from "axios";
import numeral from "numeral";
export default {
  methods: {
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
