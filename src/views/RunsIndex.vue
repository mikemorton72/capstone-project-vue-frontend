<template>
  <div>
    <div v-if="!loggedIn">Please log in to view posts</div>
    <br />
    <div v-if="loggedIn">
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
      />
      <hr />
    </div>
  </div>
</template>

<script>
import axios from "axios";
import RunCard from "./RunCard.vue";
import RunsNewModal from "./RunsNewModal.vue";
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
  ],
  data: function () {
    return {
      runs: {},
      loggedIn: false,
    };
  },
  created: function () {
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
      axios.get("/runs").then((response) => {
        this.runs = response.data;
      });
    },
  },
};
</script>
