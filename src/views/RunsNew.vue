<template>
  <div>
    <h1>Post a Run</h1>
    <form v-on:submit.prevent="submit()">
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
      <input type="submit" />
    </form>
  </div>
</template>
<script>
import axios from "axios";
export default {
  data: function () {
    return {
      newRun: {},
      errors: {},
    };
  },
  methods: {
    submit: function () {
      axios
        .post("/runs", this.newRun)
        .then(() => {
          this.newRun = {};
          this.$router.push("/");
        })
        .catch((errors) => {
          this.errors = errors.response.data.errors;
          console.log(errors.response.data.errors);
        });
    },
  },
};
</script>
