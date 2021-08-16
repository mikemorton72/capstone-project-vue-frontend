<template>
  <div class="card run-card mb-3">
    <div class="row g-0">
      <div class="col-md-4">
        <img
          src="https://www.nomadfoods.com/wp-content/uploads/2018/08/placeholder-1-e1533569576673.png"
          class="img-fluid rounded-start"
          alt=""
          v-on:click="runShow(run.id)"
        />
      </div>
      <div class="col-md-8">
        <div class="card-body">
          <h3 class="card-title">
            <img v-bind:src="run.user_image" style="width: 40px" />
            {{ run.user }}
          </h3>
          <h5 class="card-title">{{ run.title }}</h5>
          <p class="card-text">Distance: {{ distanceFormat(run.distance) }}</p>
          <p class="card-text">Time: {{ timeFormat(run.elapsed_time) }}</p>
          <p>
            <button
              class="btn btn-dark"
              type="button"
              data-bs-toggle="collapse"
              v-bind:data-bs-target="`#comments${run.id}`"
              aria-expanded="false"
              v-bind:aria-controls="`comments${run.id}`"
            >
              <img src="../assets/comments.png" style="width: 20px" />{{
                `  (${run.comments.length})`
              }}
            </button>
          </p>
          <div class="collapse card-text" v-bind:id="`comments${run.id}`">
            <p
              class="card-text"
              v-for="comment in run.comments"
              v-bind:key="comment.id"
            >
              <strong>{{ comment.user_name }}:</strong> {{ comment.text }}
            </p>
            <input type="text" v-model="run.newComment" /><button
              v-on:click="addComment(run)"
            >
              Add Comment
            </button>
          </div>
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
  width: 80%;
}
</style>
<script>
export default {
  props: ["run", "distanceFormat", "timeFormat", "addComment"],
  methods: {
    runShow: function (runId) {
      this.$router.push(`/runs/${runId}`);
    },
  },
};
</script>
