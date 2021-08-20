<template>
  <div>
    <div v-if="!loggedIn" style="text-align: center">
      <br />
      <p style="color: white">
        Please <a href="/login" style="color: white">log in</a> to view posts
      </p>
    </div>
    <div v-if="loggedIn">
      <br />
      <div
        class="card text-white bg-dark text-center"
        style="width: 100%; text-align: center"
      >
        <div class="card-body">
          <h2>{{ run.title }}</h2>
          <h5>Distance: {{ distanceFormat(run.distance) }}</h5>
          <h5>Time: {{ timeFormat(run.elapsed_time) }}</h5>
        </div>
      </div>
      <RunMap v-if="mapLoaded()" v-bind:run="run" id="map" />
      <div class="card text-white bg-dark">
        <div style="margin: 10px 30px">
          <br />
          <h3 class="card-text">Comments</h3>
          <hr />
          <p></p>
          <p
            class="card-text"
            v-for="comment in run.comments"
            v-bind:key="comment.id"
          >
            <strong
              ><img
                v-bind:src="comment.user_image"
                style="height: 1.25em; margin: auto 5px"
              />
              {{ comment.user_name }}:</strong
            >
            {{ comment.text }}
          </p>
          <p>
            <input type="text" v-model="run.newComment" />
            <button
              v-on:click="addComment(run)"
              class="btn btn-secondary"
              style="margin: 5px 20px; line-height: 1em"
            >
              Add Comment
            </button>
          </p>
          <br />
        </div>
      </div>
    </div>
  </div>
</template>
<style>
#map {
  margin: 0 auto;
  width: 100%;
  height: 30vw;
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
