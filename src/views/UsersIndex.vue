<template>
  <div>
    <div v-if="!loggedIn" style="text-align: center">
      Please log in to view users
    </div>
    <div v-if="loggedIn">
      <br />
      <h2 style="text-align: center; color: white">All Users</h2>
      <hr />
      <div class="row row-cols-1 row-cols-md-4 g-4">
        <div v-for="user in users" v-bind:key="user.id">
          <div class="card text-center text-white bg-dark" id="user-card">
            <div v-on:click="showUser(user.id)">
              <img
                v-bind:src="user.image"
                class="card-img-top"
                style="height: 200px"
              />
              <div class="card-body">
                <h5 class="card-title">{{ user.name }}</h5>
                <p class="card-text">
                  Total miles: {{ distanceFormat(user.total_miles) }}
                </p>
              </div>
            </div>
            <a
              class="btn btn-warning"
              v-if="!isCurrentUserFollowing(user)"
              v-on:click="createFollow(user)"
              >Follow</a
            >
            <a
              class="btn btn-secondary"
              v-if="isCurrentUserFollowing(user)"
              v-on:click="destroyFollow(user)"
              >Unfollow</a
            >
          </div>
        </div>
      </div>
      <div style="text-align: center">
        <button
          class="btn btn-dark pagination-button"
          v-on:click="previousPage()"
        >
          Previous
        </button>
        <span>Page {{ this.currentPage }}</span>
        <button class="btn btn-dark pagination-button" v-on:click="nextPage()" v-if="users.length > 0">
          Next
        </button>
      </div>
    </div>
  </div>
</template>
<style>
#user-card {
  cursor: pointer;
  align-content: "center";
  width: 100%;
}
</style>
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
      currentPage: null,
    };
  },
  created: function () {
    this.getCurrentPage();
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
      axios.get("/users", { params: this.$route.query }).then((response) => {
        let userIndex = response.data;
        for (let i = 0; i < userIndex.length; i++) {
          if (userIndex[i].id === parseInt(localStorage.user_id)) {
            userIndex.splice(i, 1);
          }
        }
        this.users = userIndex;
      });
    },
    getCurrentPage: function () {
      if (this.$route.query.page) {
        this.currentPage = parseInt(this.$route.query.page);
      } else {
        this.currentPage = 1;
      }
    },
    nextPage: function () {
      this.$router.push(`/users?page=${this.currentPage + 1}`);
      this.currentPage += 1;
      this.getUsers();
    },
    previousPage: function () {
      if (this.currentPage != 1) {
        this.$router.push(`/users?page=${this.currentPage - 1}`);
        this.currentPage -= 1;
        this.getUsers();
      }
    },
  },
};
</script>
