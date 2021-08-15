<template>
  <div class="login">
    <br />
    <div class="alert alert-danger" role="alert" v-if="hasErrors()">
      <ul>
        <li v-for="error in errors" v-bind:key="error">{{ error }}</li>
      </ul>
    </div>
    <form v-on:submit.prevent="submit()">
      <div class="mb-3">
        <label for="InputEmail1" class="form-label">Email address</label>
        <input
          type="email"
          class="form-control"
          id="InputEmail1"
          aria-describedby="emailHelp"
          v-model="newSessionParams.email"
        />
      </div>
      <div class="mb-3">
        <label for="InputPassword1" class="form-label">Password</label>
        <input
          type="password"
          class="form-control"
          id="InputPassword1"
          v-model="newSessionParams.password"
        />
      </div>
      <button type="submit" class="btn btn-dark">Log In</button>
    </form>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data: function () {
    return {
      newSessionParams: {},
      errors: [],
    };
  },
  methods: {
    submit: function () {
      axios
        .post("/sessions", this.newSessionParams)
        .then((response) => {
          axios.defaults.headers.common["Authorization"] =
            "Bearer " + response.data.jwt;
          localStorage.setItem("jwt", response.data.jwt);
          localStorage.setItem("user_id", response.data.user_id);
          localStorage.setItem("user_name", response.data.name);
          localStorage.setItem("has_strava", response.data.has_strava);
          this.$router.push("/");
        })
        .catch((error) => {
          console.log(error.response);
          this.errors = ["Invalid email or password."];
          this.email = "";
          this.password = "";
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
