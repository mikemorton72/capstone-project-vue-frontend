<template>
  <div>
    <div v-if="!loggedIn">Please log in to view users</div>
    <div v-if="loggedIn">
      <h1>{{ user.name }}</h1>
      <img v-bind:src="user.image" style="width: 25%" />
      <div v-if="!isUsersPage()">
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
      </div>
      <p>Total miles: {{ distanceFormat(user.total_miles) }}</p>
      <h3>Runs</h3>
      <RunCard
        v-for="run in user.runs"
        v-bind:key="run.id"
        v-bind:run="run"
        v-bind:distanceFormat="distanceFormat"
        v-bind:timeFormat="timeFormat"
        v-bind:addComment="addComment"
      />
    </div>
  </div>
</template>
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
      loggedIn: false,
    };
  },
  created: function () {
    this.checkLoggedIn()
      .then(() => {
        this.getUser();
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
