<template>
  <div>
    <div v-if="loggedIn">
      <RunMap v-if="mapLoaded()" v-bind:run="run" id="map" />
      <div>{{ run }}</div>
    </div>
  </div>
</template>
<style>
#map {
  margin: 20px auto;
  width: 80%;
  height: 400px;
}
</style>
<script>
import axios from "axios";
import RunMap from "../components/RunMap.vue";

export default {
  props: ["checkLoggedIn", "distanceFormat", "timeFormat", "addComment"],
  components: {
    RunMap,
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
      routeCoordinates: [],
    };
  },
  methods: {
    runShow: function () {
      axios.get(`/runs/${this.$route.params.id}`).then((response) => {
        this.run = response.data;
        this.loggedIn = true;
      });
    },
    mapLoaded: function () {
      if (this.run.id) {
        return true;
      } else {
        return false;
      }
    },
  },
};
</script>
