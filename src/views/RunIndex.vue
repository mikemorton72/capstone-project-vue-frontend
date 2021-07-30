<template>
  <div>
    <h1>Run Index</h1>
    <!-- <p>{{ runs }}</p> -->
    <div v-for="(run, index) in runs" v-bind:key="run.id">
      <p>
        <b>{{ run.title }}</b>
      </p>
      <p>Athlete: {{ run.user }}</p>
      <p>Distance: {{ run.distance }} miles</p>
      <p>Time {{ run.elapsed_time }} minutes</p>
      <br />
      <p>Comments:</p>
      <p v-for="comment in run.comments" v-bind:key="comment.id">
        {{ comment.user_name }}: {{ comment.text }}
      </p>
      <input type="text" v-model="run.newComment" /><button
        v-on:click="addComment(run, index)"
      >
        Add Comment
      </button>
      <hr />
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data: function () {
    return {
      runs: {},
    };
  },
  created: function () {
    this.runIndex();
  },
  methods: {
    runIndex: function () {
      axios.get("/runs").then((response) => {
        this.runs = response.data;
      });
    },
    addComment: function (run, index) {
      axios
        .post("/comments", { run_id: run.id, text: run.newComment })
        .then((response) => {
          this.runs[index].comments.push(response.data);
          this.runs[index].newComment = "";
        })
        .catch((errors) => {
          console.log(errors.resposne.data.errors);
        });
    },
  },
};
</script>
