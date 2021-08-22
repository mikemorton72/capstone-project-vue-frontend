<template>
  <div>
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
              <span style="float: right">
                <button
                  type="button"
                  class="btn-close btn-close-white"
                  aria-label="Close"
                  v-if="isUsersRun(run)"
                  v-on:click="showModal(run.id)"
                ></button>
              </span>
            </h3>
            <h5
              class="card-title hover-click"
              v-on:click="showUser(run.user_id)"
            >
              {{ run.user }}
              <img
                v-bind:src="run.user_image"
                style="height: 1.25em; margin: auto 5px"
              />
            </h5>
            <p class="card-text">Location: {{ run.location_name }}</p>
            <p class="card-text">
              Distance: {{ distanceFormat(run.distance) }} miles
            </p>
            <p class="card-text">Time: {{ timeFormat(run.elapsed_time) }}</p>
            <p class="card-text">Pace: {{ run.pace }} min/mi</p>
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

    <!-- Delete Run Modal -->
    <div
      class="modal fade"
      v-bind:id="`delete${run.id}`"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content text-white bg-dark">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Delete Run</h5>
            <button
              type="button"
              class="btn-close"
              v-on:click="hideModal(run.id)"
            ></button>
          </div>
          <div class="modal-body">
            <p>Are you sure you want to delete {{ run.title }}?</p>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              v-on:click="hideModal(run.id)"
            >
              Cancel
            </button>
            <button
              type="button"
              class="btn btn-primary"
              v-on:click="runDestroy(run.id)"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
    <div
      class="modal-backdrop fade show"
      id="backdrop"
      style="display: none"
    ></div>
  </div>
</template>
<style>
.run-card {
  margin: 0 auto;
  float: none;
  margin-bottom: 10px;
  align-content: "center";
  width: 70%;
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
import axios from "axios";
export default {
  props: ["run", "distanceFormat", "timeFormat", "addComment", "showUser"],
  data: function () {
    return {
      mapBoxApiKey: process.env.VUE_APP_MAPBOX_API,
    };
  },
  methods: {
    isUsersRun: function (run) {
      if (localStorage.user_id == run.user_id) {
        return true;
      } else {
        return false;
      }
    },
    runShow: function (runId) {
      this.$router.push(`/runs/${runId}`);
    },
    runDestroy(runId) {
      axios.delete(`/runs/${runId}`).then(() => {
        this.hideModal(runId);
        this.$emit("runIndex");
      });
    },
    showModal: function (runId) {
      document.getElementById("backdrop").style.display = "block";
      document.getElementById(`delete${runId}`).style.display = "block";
      document.getElementById(`delete${runId}`).classList.add("show");
    },
    hideModal: function (runId) {
      document.getElementById("backdrop").style.display = "none";
      document.getElementById(`delete${runId}`).style.display = "none";
      document.getElementById(`delete${runId}`).classList.remove("show");
    },
  },
};
</script>
