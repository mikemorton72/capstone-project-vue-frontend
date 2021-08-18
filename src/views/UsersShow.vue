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

      <h2 style="text-align: center; color: white">
        {{ `${user.name}'s Runs` }}
      </h2>
      <hr />
      <RunCard
        v-for="run in runs"
        v-bind:key="run.id"
        v-bind:run="run"
        v-bind:distanceFormat="distanceFormat"
        v-bind:timeFormat="timeFormat"
        v-bind:addComment="addComment"
      />
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
export default {
  components: {
    RunCard,
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
  ],
  data: function () {
    return {
      user: {},
      runs: {},
      loggedIn: false,
    };
  },
  created: function () {
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
      axios.get(`/runs?user_id=${user_id}`).then((response) => {
        console.log(response.data);
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
  },
};
</script>
