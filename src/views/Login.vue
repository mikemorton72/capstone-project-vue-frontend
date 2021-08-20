<template>
  <div>
    <div class="login card text-white bg-dark" style="width: 40vw">
      <form v-on:submit.prevent="submit()" style="margin: 10px 20px">
        <h3 style="text-align: center">Login</h3>
        <hr />
        <div style="width: 70%; margin: 0px auto">
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
          <div v-if="hasErrors()" style="text-align: center">
            <p v-for="error in errors" v-bind:key="error">{{ error }}</p>
          </div>
          <div style="text-align: center">
            <button type="submit" class="btn btn-secondary">Log In</button>
          </div>
          <div style="height: 10px"></div>
        </div>
      </form>
    </div>
    <div style="color: white; text-align: center">
      <a href="/signup" style="color: white">Sign Up</a>
    </div>
  </div>
</template>
<style>
.login {
  width: 60%;
  color: white;
  margin: 20px auto;
}
</style>
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
