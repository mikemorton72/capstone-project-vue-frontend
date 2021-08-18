<template>
  <div>
    <div class="signup card text-white bg-dark">
      <form v-on:submit.prevent="submit()" style="margin: 10px 20px">
        <h3 style="text-align: center">Sign Up</h3>
        <hr />
        <div style="text-align: center">
          <h5 style="text-align: center">Create Your Avatar</h5>
          <p>
            <img id="avatar-preview" style="width: 15em" />
          </p>
          <p>
            <button
              type="button"
              class="btn btn-secondary avatar-button"
              style="line-height: 0.5em; width: 12em"
              v-on:click="changeAvatarGender()"
            >
              Change Gender
            </button>
          </p>
          <p>
            <button
              type="button"
              class="btn btn-secondary avatar-button"
              style="line-height: 0.5em; width: 12em"
              v-on:click="getAvatarImage()"
            >
              Randomize
            </button>
          </p>
        </div>
        <div class="mb-3">
          <label for="Inputname1" class="form-label">Name</label>
          <input
            type="text"
            class="form-control"
            id="Inputname1"
            aria-describedby="nameHelp"
            v-model="newUserParams.name"
          />
        </div>
        <div class="mb-3">
          <label for="InputEmail1" class="form-label">Email address</label>
          <input
            type="email"
            class="form-control"
            id="InputEmail1"
            aria-describedby="emailHelp"
            v-model="newUserParams.email"
          />
        </div>
        <div class="mb-3">
          <label for="InputPassword1" class="form-label">Password</label>
          <input
            type="password"
            class="form-control"
            id="InputPassword1"
            v-model="newUserParams.password"
          />
        </div>
        <div class="mb-3">
          <label for="InputPasswordConf1" class="form-label"
            >Password Confirmation</label
          >
          <input
            type="password"
            class="form-control"
            id="InputPasswordConf1"
            v-model="newUserParams.password_confirmation"
          />
        </div>
        <button type="submit" class="btn btn-secondary">Sign Up</button>
      </form>
    </div>
    <div
      class="alert alert-danger"
      style="width: 60%; margin: 10px auto"
      role="alert"
      v-if="hasErrors()"
    >
      <p v-for="error in errors" v-bind:key="error">{{ error }}</p>
    </div>
  </div>
</template>
<style>
.signup {
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
      newUserParams: {},
      gender: "male",
      errors: [],
    };
  },
  mounted: function () {
    this.getAvatarImage();
  },
  methods: {
    submit: function () {
      this.newUserParams.image = document.getElementById("avatar-preview").src;
      axios
        .post("/users", this.newUserParams)
        .then((response) => {
          console.log(response.data);
          this.$router.push("/login");
        })
        .catch((error) => {
          this.errors = error.response.data.errors;
        });
    },
    hasErrors: function () {
      if (this.errors.length > 0) {
        return true;
      } else {
        return false;
      }
    },
    getAvatarImage: function () {
      document.getElementById(
        "avatar-preview"
      ).src = `https://avatars.dicebear.com/api/${
        this.gender
      }/${Math.random()}.svg?mood=happy`;
    },
    changeAvatarGender: function () {
      if (this.gender === "male") {
        this.gender = "female";
      } else {
        this.gender = "male";
      }
      this.getAvatarImage();
    },
  },
};
</script>
