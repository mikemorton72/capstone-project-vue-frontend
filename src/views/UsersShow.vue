<template>
  <div>
    <div v-if="!loggedIn">Please log in to view users</div>
    <div v-if="loggedIn">
      <div
        class="card mb-3 text-white bg-dark run-card"
        style="margin: 15px auto"
      >
        <div class="row g-0">
          <div class="col-md-4">
            <img v-bind:src="user.image" class="img-fluid rounded-start" />
          </div>
          <div class="col-md-8">
            <div class="card-body">
              <h2 class="card-title">{{ user.name }}</h2>
              <p class="card-text">
                Total miles: {{ distanceFormat(user.total_miles) }}
              </p>
              <p class="card-text">Number of Runs: {{ user.number_of_runs }}</p>
              <p class="card-text">Average Pace: {{ user.average_pace }}</p>
            </div>
          </div>
        </div>
      </div>
      <div v-if="!isUsersPage()">
        <p style="text-align: center">
          <button
            class="btn btn-secondary wide-button"
            v-if="isCurrentUserFollowing(user)"
            v-on:click="destroyFollow(user)"
          >
            Unfollow
          </button>
        </p>
        <p style="text-align: center">
          <button
            class="btn btn-warning wide-button"
            v-if="!isCurrentUserFollowing(user)"
            v-on:click="createFollow(user)"
          >
            Follow
          </button>
        </p>
      </div>
      <hr />
      <RunsNewModal
        v-bind:runs="runs"
        v-bind:hasStrava="hasStrava"
        v-bind:distanceFormat="distanceFormat"
        v-bind:timeFormat="timeFormat"
        v-if="isUsersPage()"
      />
      <br v-if="isUsersPage()" />
      <RunCard
        v-for="run in runs"
        v-bind:key="run.id"
        v-bind:run="run"
        v-bind:distanceFormat="distanceFormat"
        v-bind:timeFormat="timeFormat"
        v-bind:addComment="addComment"
      />
      <div style="text-align: center">
        <button
          class="btn btn-dark pagination-button"
          v-on:click="previousPage()"
          v-if="currentPage != 1"
        >
          Previous
        </button>
        <span v-else style="margin: auto 70px"></span>
        <span>Page {{ this.currentPage }}</span>
        <button
          class="btn btn-dark pagination-button"
          v-on:click="nextPage()"
          v-if="runs.length == 8"
        >
          Next
        </button>
        <span v-else style="margin: auto 70px"></span>
      </div>
    </div>
  </div>
</template>
<style>
.wide-button {
  width: 60%;
}
</style>
<script>
import axios from "axios";
import RunCard from "../components/RunCard.vue";
import RunsNewModal from "../components/RunsNewModal";
export default {
  components: {
    RunCard,
    RunsNewModal,
  },
  props: [
    "checkLoggedIn",
    "isCurrentUserFollowing",
    "addComment",
    "createFollow",
    "destroyFollow",
    "distanceFormat",
    "timeFormat",
    "user_id",
    "hasStrava",
  ],
  data: function () {
    return {
      user: {},
      runs: {},
      loggedIn: false,
      currentPage: null,
    };
  },
  created: function () {
    console.log(this.$route);
    this.getCurrentPage();
    this.checkLoggedIn()
      .then(() => {
        this.getUser();
        this.userRunIndex(this.$route.params.id);
        this.loggedIn = true;
      })
      .catch(() => {
        this.loggedIn = false;
      });
  },
  methods: {
    getUser: function () {
      axios.get(`/users/${this.$route.params.id}`).then((response) => {
        this.user = response.data;
      });
    },
    userRunIndex: function (user_id) {
      axios
        .get(`/runs?user_id=${user_id}`, { params: this.$route.query })
        .then((response) => {
          this.runs = response.data;
        });
    },
    isUsersPage: function () {
      if (this.$route.params.id == localStorage.user_id) {
        return true;
      } else {
        return false;
      }
    },
    getCurrentPage: function () {
      if (this.$route.query.page) {
        this.currentPage = parseInt(this.$route.query.page);
      } else {
        this.currentPage = 1;
      }
    },
    nextPage: function () {
      this.$router.push(`${this.$route.path}?page=${this.currentPage + 1}`);
      this.currentPage += 1;
      this.userRunIndex(this.$route.params.id);
    },
    previousPage: function () {
      if (this.currentPage != 1) {
        this.$router.push(`${this.$route.path}?page=${this.currentPage - 1}`);
        this.currentPage -= 1;
        this.userRunIndex(this.$route.params.id);
      }
    },
  },
};
</script>
