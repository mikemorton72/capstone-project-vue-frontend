<template>
  <div>
    <div v-if="!loggedIn" style="text-align: center">
      Please log in to view posts
    </div>
    <br />
    <div v-if="loggedIn">
      <h2 style="text-align: center; color: white">Run Feed</h2>
      <hr />
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
      />
      <div style="text-align: center">
        <button
          class="btn btn-dark run-pagination-button"
          v-on:click="previousPage()"
        >
          Previous
        </button>
        <span>Page {{ this.currentPage }}</span>
        <button
          class="btn btn-dark run-pagination-button"
          v-on:click="nextPage()"
        >
          Next
        </button>
      </div>
        <br />
    </div>
  </div>
</template>
<style scoped>
.run-pagination-button {
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
  ],
  data: function () {
    return {
      runs: {},
      loggedIn: false,
      currentPage: null,
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
    },
    previousPage: function () {
      if (this.currentPage != 1) {
        this.$router.push(`/?page=${this.currentPage - 1}`);
        this.currentPage -= 1;
        this.runIndex();
      }
    },
  },
};
</script>
