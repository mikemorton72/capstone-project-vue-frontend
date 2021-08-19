<template>
  <div class="card run-card mb-3 text-white bg-dark">
    <div class="row g-0">
      <div class="col-md-4">
        <img
          v-bind:src="`https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/${run.start_longitude},${run.start_latitude},13,0/800x800?access_token=${mapBoxApiKey}`"
          class="img-fluid rounded-start hover-click"
          v-on:click="runShow(run.id)"
        />
      </div>
      <div class="col-md-8">
        <div class="card-body">
          <h3 class="card-title">
            {{ run.title }}
            <img
              src="../assets/strava.png"
              style="height: 1em"
              v-if="run.is_strava_import"
            />
          </h3>
          <h5 class="card-title hover-click" v-on:click="showUser(run.user_id)">
            {{ run.user }}
            <img
              v-bind:src="run.user_image"
              style="height: 1.25em; margin: auto 5px"
            />
          </h5>
          <p class="card-text">Location: {{ run.location_name }}</p>
          <p class="card-text">Distance: {{ distanceFormat(run.distance) }}</p>
          <p class="card-text">Time: {{ timeFormat(run.elapsed_time) }}</p>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
        <p>
          <button
            class="btn btn-secondary"
            id="show-comments-button"
            type="button"
            data-bs-toggle="collapse"
            v-bind:data-bs-target="`#comments${run.id}`"
            aria-expanded="false"
            v-bind:aria-controls="`comments${run.id}`"
          >
            Comments {{ `  (${run.comments.length})` }}
          </button>
        </p>
        <div
          class="collapse card-text row"
          v-bind:id="`comments${run.id}`"
          style="margin: 0px 25px"
        >
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
        </div>
      </div>
    </div>
  </div>
</template>
<style>
.run-card {
  margin: 0 auto;
  float: none;
  margin-bottom: 10px;
  align-content: "center";
  width: 60%;
}
.hover-click {
  cursor: pointer;
}
#show-comments-button {
  border-radius: 10%;
  text-align: center;
  margin-top: 15px;
  width: 100%;
  line-height: 0.7;
}
</style>
<script>
export default {
  props: ["run", "distanceFormat", "timeFormat", "addComment", "showUser"],
  data: function () {
    return {
      mapBoxApiKey: process.env.VUE_APP_MAPBOX_API,
    };
  },
  methods: {
    runShow: function (runId) {
      this.$router.push(`/runs/${runId}`);
    },
  },
};
</script>
