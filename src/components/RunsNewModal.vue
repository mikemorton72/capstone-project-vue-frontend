<template>
  <div>
    <!-- Button trigger modal -->
    <div id="new-run-button-div">
      <button
        type="button"
        class="btn btn-secondary my-button"
        v-on:click="showModal()"
      >
        Create New Run Post
      </button>
    </div>

    <!-- Modal -->
    <div
      class="modal fade"
      id="newRunModal"
      tabindex="-1"
      aria-labelledby="newRunModal"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content text-white bg-dark">
          <div class="modal-header">
            <h3 class="modal-title" id="newRunModalLabel">New Run</h3>
            <button
              type="button"
              class="btn-close"
              aria-label="Close"
              v-on:click="closeModal()"
            ></button>
          </div>
          <div class="modal-body centered-buttons" v-if="!entryMethodSelected">
            <br />
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
            <div v-if="hasErrors()" style="text-align: center">
              <p v-for="error in errors" v-bind:key="error">{{ error }}</p>
            </div>
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
              <div class="col-md-8">
                <label for="newRunLocation" class="form-label">Location</label>
                <input
                  type="text"
                  class="form-control"
                  id="newRunLocation"
                  aria-describedby="runLocationHelp"
                  v-model="newRun.location_name"
                  v-bind:disabled="usingMyCurrentLocation"
                />
                <div id="runLocationHelp" class="form-text">
                  Run Location (i.e. Chicago, IL)
                </div>
              </div>
              <div class="col-md-4">
                <br />
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    value=""
                    id="currentLocationCheckbox"
                    v-on:click="getCurrentLocation()"
                  />
                  <label class="form-check-label" for="flexCheckDefault">
                    Use Current Location
                  </label>
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
              id="strava-import-list"
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
                v-on:click="createStravaImport(run)"
              >
                Import
              </button>
              <br />
              <hr />
            </div>
            <div style="text-align: center">
              <button
                class="btn btn-secondary pagination-button"
                v-on:click="previousPage()"
                v-if="stravaIndexPage != 1"
                v-bind:disabled="loadingResults"
              >
                Previous
              </button>
              <span v-else style="margin: auto 70px"></span>
              <span>Page {{ this.stravaIndexPage }}</span>
              <button
                class="btn btn-secondary pagination-button"
                v-on:click="nextPage()"
                v-if="true"
                v-bind:disabled="loadingResults"
              >
                Next
              </button>
              <span v-else style="margin: auto 70px"></span>
            </div>
          </div>
          <div class="modal-footer" v-if="entryMethodSelected">
            <div style="margin: 0px auto">
              <button
                type="button"
                class="btn btn-secondary"
                v-on:click="closeModal()"
                v-if="showCreateRunButton"
                style="margin: 0px 10px; width: 8em"
              >
                Cancel
              </button>
              <button
                type="button"
                class="btn btn-secondary"
                v-on:click="createRun()"
                v-if="showCreateRunButton"
                style="margin: 0px 10px; width: 8em"
              >
                Create Run
              </button>
            </div>
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
.my-button {
  width: 60%;
}
#strava-import-list {
  text-align: center;
}
#new-run-button-div {
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
      showCreateRunButton: true,
      usingMyCurrentLocation: false,
      stravaIndexPage: 1,
      loadingResults: false,
    };
  },
  methods: {
    getCurrentLocation: function () {
      if (this.usingMyCurrentLocation) {
        this.newRun.location_name = "";
        this.usingMyCurrentLocation = !this.usingMyCurrentLocation;
      } else {
        this.newRun.location_name = "Current Location";
        this.usingMyCurrentLocation = !this.usingMyCurrentLocation;
        navigator.geolocation.getCurrentPosition((position) => {
          this.newRun.start_latitude = position.coords.latitude;
          this.newRun.start_longitude = position.coords.longitude;
        });
      }
    },
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
        this.entryMethodSelected = true;
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
      this.showCreateRunButton = true;
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
      this.newRun.using_my_current_location = this.usingMyCurrentLocation;
      this.convertDistanceUnitsToMeters();
      axios
        .post("/runs", this.newRun)
        .then((response) => {
          this.runs.unshift(response.data);
          this.runs.pop();
          this.newRun = {};
          this.closeModal();
          this.entryMethodSelected = false;
          this.manualEntryToggle();
          this.usingMyCurrentLocation = false;
        })
        .catch((errors) => {
          this.errors = errors.response.data.errors;
          console.log(errors.response.data.errors);
        });
    },
    stravaRunIndex: function () {
      this.loadingResults = true;
      axios
        .get("/strava_oauth/runs", { params: { page: this.stravaIndexPage } })
        .then((response) => {
          this.loadingResults = false;
          this.stravaImport = true;
          this.entryMethodSelected = true;
          this.showCreateRunButton = false;
          this.stravaRuns = response.data;
        });
    },
    nextPage: function () {
      this.stravaIndexPage += 1;
      this.stravaRunIndex();
    },
    previousPage: function () {
      if (this.stravaIndexPage != 1) {
        this.stravaIndexPage -= 1;
        this.stravaRunIndex();
      }
    },
    createStravaImport: function (run) {
      this.newRun.title = run.name;
      this.newRun.distance = run.distance;
      this.newRun.elapsed_time = run.elapsed_time;
      this.newRun.start_latitude = run.start_latitude;
      this.newRun.start_longitude = run.start_longitude;
      this.newRun.summary_polyline = run.map.summary_polyline;
      this.newRun.is_strava_import = true;
      this.newRun.strava_id = run.id;
      axios
        .post("/runs", this.newRun)
        .then((response) => {
          this.runs.unshift(response.data);
          this.runs.pop();
          this.newRun = {};
          this.closeModal();
          this.entryMethodSelected = false;
          this.manualEntryToggle();
          this.showCreateRunButton = true;
        })
        .catch((errors) => {
          this.errors = errors.response.data.errors;
          console.log(errors.response.data.errors);
        });
    },
    hasErrors: function () {
      if (this.errors.length > 0) {
        return true;
      } else {
        return false;
      }
    },
  },
};
</script>
