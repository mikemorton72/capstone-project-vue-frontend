<template>
  <div>
    <!-- Button trigger modal -->
    <button type="button" class="btn btn-dark" v-on:click="showModal()">
      New Run
    </button>

    <!-- Modal -->
    <div
      class="modal fade"
      id="newRunModal"
      tabindex="-1"
      aria-labelledby="newRunModal"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="newRunModalLabel">New Run</h5>
            <button
              type="button"
              class="btn-close"
              aria-label="Close"
              v-on:click="closeModal()"
            ></button>
          </div>
          <div class="modal-body">
            <!-- <p><a v-bind:href="">Import from Strava</a></p> -->
            <ul v-for="error in errors" v-bind:key="error.id">
              <li>{{ error }}</li>
            </ul>
            <p>
              <label>Title: </label>
              <input type="text" v-model="newRun.title" />
            </p>
            <p>
              <label>Distance: </label>
              <input type="text" v-model="newRun.distance" />
            </p>
            <p>
              <label>Time: </label>
              <input type="text" v-model="newRun.elapsed_time" />
            </p>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              v-on:click="closeModal()"
            >
              Close
            </button>
            <button
              type="button"
              class="btn btn-primary"
              v-on:click="createRun()"
            >
              Save
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
<script>
import axios from "axios";
export default {
  props: ["runs"],
  data: function () {
    return {
      newRun: {},
      errors: {},
      loggedIn: false,
    };
  },
  methods: {
    hasStrava: function () {
      // if localStorage.
    },
    showModal: function () {
      document.getElementById("backdrop").style.display = "block";
      document.getElementById("newRunModal").style.display = "block";
      document.getElementById("newRunModal").classList.add("show");
    },
    closeModal: function () {
      document.getElementById("backdrop").style.display = "none";
      document.getElementById("newRunModal").style.display = "none";
      document.getElementById("newRunModal").classList.remove("show");
    },
    createRun: function () {
      this.newRun.is_strava_import = false;
      axios
        .post("/runs", this.newRun)
        .then((response) => {
          this.runs.push(response.data);
          this.newRun = {};
          this.closeModal();
        })
        .catch((errors) => {
          this.errors = errors.response.data.errors;
          console.log(errors.response.data.errors);
        });
    },
  },
};
</script>
