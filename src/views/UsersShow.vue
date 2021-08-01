<template>
  <div>
    <div v-if="!loggedIn">Please log in to view users</div>
    <div v-if="loggedIn">
      <h1>{{ user.name }}</h1>
      <p>Total miles: {{ user.total_miles }}</p>
      <h3>Runs</h3>
      <div v-for="run in user.runs" v-bind:key="run.id">
        <p>{{ run.title }}</p>
        <p>Distance: {{ run.distance }} miles</p>
        <p>Time {{ run.elapsed_time }} minutes</p>
        <br />
        <p>Comments:</p>
        <p v-for="comment in run.comments" v-bind:key="comment.id">
          {{ comment.user_name }}: {{ comment.text }}
        </p>
        <hr />
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
export default {
  props: ["checkLoggedIn"],
  data: function () {
    return {
      user: {},
      loggedIn: false,
    };
  },
  created: function () {
    this.checkLoggedIn()
      .then(() => {
        this.getUser();
        this.loggedIn = true;
      })
      .catch(() => {
        this.loggedIn = false;
      });
  },
  methods: {
    getUser: function () {
      axios.get(`/users/${this.$route.params.id}`).then((response) => {
        this.user = response.data;
        console.log(response.data);
      });
    },
  },
};
</script>
