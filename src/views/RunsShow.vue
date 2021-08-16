<template>
  <div v-if="loggedIn">
    <RunCard
      v-bind:run="run"
      v-bind:distanceFormat="distanceFormat"
      v-bind:timeFormat="timeFormat"
      v-bind:addComment="addComment"
    />
  </div>
</template>
<script>
import axios from "axios";
import RunCard from "./RunCard.vue";
export default {
  props: ["checkLoggedIn", "distanceFormat", "timeFormat", "addComment"],
  components: {
    RunCard,
  },
  created: function () {
    this.checkLoggedIn()
      .then(() => {
        this.runShow();
      })
      .catch(() => {
        this.loggedIn = false;
      });
  },
  data: function () {
    return {
      run: {},
      loggedIn: false,
    };
  },
  methods: {
    runShow: function () {
      axios.get(`/runs/${this.$route.params.id}`).then((response) => {
        this.run = response.data;
        this.loggedIn = true;
      });
    },
  },
};
</script>
