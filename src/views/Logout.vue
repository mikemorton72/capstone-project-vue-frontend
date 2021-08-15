<template>
  <div class="logout"></div>
</template>

<script>
import axios from "axios";

export default {
  created: function () {
    delete axios.defaults.headers.common["Authorization"];
    localStorage.removeItem("jwt");
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_name");
    localStorage.removeItem("has_strava");
    this.$router.push("/login");
  },
};
</script>
