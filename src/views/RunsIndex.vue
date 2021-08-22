<template>
  <div>
    <div v-if="!loggedIn" style="text-align: center">
      <br />
      <p style="color: white">
        Please <a href="/login" style="color: white">log in</a> to view posts
      </p>
    </div>
    <div v-else>
      <br />
      <div
        class="card text-center text-white bg-dark"
        style="width: 70%; margin: 0px auto"
      >
        <h2 style="padding: 10px 0px">Run Feed</h2>
      </div>
      <hr />
      <div v-if="noPosts">
        <p style="color: white; text-align: center">
          <br />
          It looks like nothing is in your feed. <br />
          <a href="/users" style="color: white">Follow users</a> or create a
          post using the button below.
          <br />
          <br />
        </p>
      </div>
      <RunsNewModal
        v-bind:runs="runs"
        v-bind:hasStrava="hasStrava"
        v-bind:distanceFormat="distanceFormat"
        v-bind:timeFormat="timeFormat"
      />
      <br />
      <RunCard
        v-for="run in runs"
        v-bind:key="run.id"
        v-bind:run="run"
        v-bind:distanceFormat="distanceFormat"
        v-bind:timeFormat="timeFormat"
        v-bind:addComment="addComment"
        v-bind:showUser="showUser"
        v-on:runIndex="runIndex"
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
      <br />
    </div>
  </div>
</template>
<style>
.pagination-button {
  width: 100px;
  margin: 10px 20px;
}
</style>

<script>
import axios from "axios";
import RunCard from "../components/RunCard.vue";
import RunsNewModal from "../components/RunsNewModal.vue";
export default {
  components: {
    RunCard,
    RunsNewModal,
  },
  props: [
    "checkLoggedIn",
    "addComment",
    "timeFormat",
    "distanceFormat",
    "hasStrava",
    "showUser",
    "scrollToTop",
  ],
  data: function () {
    return {
      runs: {},
      loggedIn: false,
      currentPage: null,
      noPosts: false,
    };
  },
  created: function () {
    this.getCurrentPage();
    this.checkLoggedIn()
      .then(() => {
        this.runIndex();
        this.loggedIn = true;
      })
      .catch(() => {
        this.loggedIn = false;
      });
  },
  methods: {
    runIndex: function () {
      axios.get("/runs", { params: this.$route.query }).then((response) => {
        this.runs = response.data;
        if (this.runs.length == 0) {
          this.noPosts = true;
        }
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
      this.$router.push(`/?page=${this.currentPage + 1}`);
      this.currentPage += 1;
      this.runIndex();
      this.scrollToTop();
    },
    previousPage: function () {
      if (this.currentPage != 1) {
        this.$router.push(`/?page=${this.currentPage - 1}`);
        this.currentPage -= 1;
        this.runIndex();
        this.scrollToTop();
      }
    },
  },
};
</script>
