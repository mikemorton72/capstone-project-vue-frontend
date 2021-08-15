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
          <div class="modal-body centered-buttons" v-if="!entryMethodSelected">
            <p>
              <button
                type="button"
                class="btn btn-secondary"
                v-on:click="manualEntryToggle()"
              >
                Manual Entry
              </button>
            </p>
            <br />
            <br />
            <p>
              <button
                type="button"
                class="btn btn-secondary"
                v-on:click="stravaRunIndex()"
              >
                Import from Strava
              </button>
            </p>
          </div>
          <div class="modal-body" v-if="manualEntry">
            <ul v-for="error in errors" v-bind:key="error.id">
              <li>{{ error }}</li>
            </ul>
            <form class="row g-3">
              <div class="col-md-12">
                <label for="newRunTitle" class="form-label">Title</label>
                <input
                  type="text"
                  class="form-control"
                  id="newRunTitle"
                  aria-describedby="runTitleHelp"
                  v-model="newRun.title"
                />
                <div id="runTitleHelp" class="form-text">
                  Give your run a title.
                </div>
              </div>
              <div class="col-md-6">
                <label for="newRunDistance" class="form-label">Distance</label>
                <input
                  type="text"
                  class="form-control"
                  id="newRunDistance"
                  v-model="newRun.rawDistance"
                />
                <div id="runDistanceHelp" class="form-text">
                  Enter the distance you ran.
                </div>
              </div>
              <div class="col-md-4">
                <label for="newRunDistance" class="form-label">Units</label>
                <select
                  class="form-select"
                  aria-label="select distance units"
                  v-model="newRun.units"
                >
                  <option value="miles">miles</option>
                  <option value="kilometers">kilometers</option>
                  <option value="meters">meters</option>
                </select>
              </div>
              <div class="col-md-2"></div>
              <div class="col-md-4">
                <label for="newRunHours" class="form-label">Hours</label>
                <input
                  type="text"
                  class="form-control"
                  id="newRunHours"
                  v-model="newRun.hours"
                />
              </div>
              <div class="col-md-4">
                <label for="newRunMinutes" class="form-label">Minutes</label>
                <input
                  type="text"
                  class="form-control"
                  id="newRunMinutes"
                  v-model="newRun.minutes"
                />
              </div>
              <div class="col-md-4">
                <label for="newRunSeconds" class="form-label">Seconds</label>
                <input
                  type="text"
                  class="form-control"
                  id="newRunSeconds"
                  v-model="newRun.seconds"
                />
              </div>
              <div id="runTitleHelp" class="form-text">
                Enter the total elapsed time.
              </div>
            </form>
          </div>
          <div class="modal-body" v-if="stravaImport">
            <div
              class="strava-import-list"
              v-for="run in stravaRuns"
              v-bind:key="run.id"
            >
              <h4>{{ run.name }}</h4>
              <p>{{ stravaDateFormat(run.start_date) }}</p>
              <p>{{ distanceFormat(metersToMiles(run.distance)) }} miles</p>
              <p>Time: {{ timeFormat(run.elapsed_time) }}</p>
              <button
                type="button"
                class="btn btn-secondary"
                v-on:click="createStravaImport()"
              >
                Import
              </button>
              <br/>
              <hr />
            </div>
          </div>
          <div class="modal-footer" v-if="entryMethodSelected">
            <button
              type="button"
              class="btn btn-secondary"
              v-on:click="closeModal()"
            >
              Cancel
            </button>
            <button type="button" class="btn btn-dark" v-on:click="createRun()">
              Create Run
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
.centered-buttons {
  text-align: center;
}
.strava-import-list {
  text-align: center;
}
</style>
<script>
import axios from "axios";
export default {
  props: ["runs", "hasStrava", "distanceFormat", "timeFormat"],
  data: function () {
    return {
      manualEntry: false,
      newRun: { units: "miles" },
      errors: {},
      loggedIn: false,
      stravaRuns: {},
      stravaImport: false,
      entryMethodSelected: false,
    };
  },
  methods: {
    stravaDateFormat: function (dateString) {
      return dateString.slice(0, 10);
    },
    metersToMiles: function (meters) {
      return meters / 1609;
    },
    convertDistanceUnitsToMeters: function () {
      if (this.newRun.units === "miles") {
        this.newRun.distance = this.newRun.rawDistance * 1609;
      } else if (this.newRun.units === "kilometers") {
        this.newRun.distance = this.newRun.rawDistance * 1000;
      } else if (this.newRun.units === "meters") {
        this.newRun.distance = this.newRun.rawDistance;
      }
    },
    manualEntryToggle: function () {
      this.entryMethodSelected = true;
      this.manualEntry = !this.manualEntry;
    },
    showModal: function () {
      this.entryMethodSelected = false;
      if (this.hasStrava()) {
        this.manualEntry = false;
      } else {
        this.manualEntry = true;
        this.hasMethodSelected = true;
      }
      document.getElementById("backdrop").style.display = "block";
      document.getElementById("newRunModal").style.display = "block";
      document.getElementById("newRunModal").classList.add("show");
    },
    closeModal: function () {
      document.getElementById("backdrop").style.display = "none";
      document.getElementById("newRunModal").style.display = "none";
      document.getElementById("newRunModal").classList.remove("show");
      this.manualEntryToggle();
      this.stravaImport = false;
    },
    totalSeconds: function () {
      let hours = parseInt(this.newRun.hours) || 0;
      let minutes = parseInt(this.newRun.minutes) || 0;
      let seconds = parseInt(this.newRun.seconds) || 0;
      let sum = hours * 3600 + minutes * 60 + seconds;
      return sum;
    },
    createRun: function () {
      this.newRun.is_strava_import = false;
      this.newRun.elapsed_time = this.totalSeconds();
      this.convertDistanceUnitsToMeters();
      axios
        .post("/runs", this.newRun)
        .then((response) => {
          this.runs.push(response.data);
          this.newRun = {};
          this.closeModal();
          this.entryMethodSelected = false;
          this.manualEntryToggle();
        })
        .catch((errors) => {
          this.errors = errors.response.data.errors;
          console.log(errors.response.data.errors);
        });
    },
    stravaRunIndex: function () {
      axios.get("/strava_oauth/runs").then((response) => {
        this.stravaImport = true;
        this.entryMethodSelected = true;
        this.stravaRuns = response.data;
      });
    },
  },
};
</script>
