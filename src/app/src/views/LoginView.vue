<template>
  <div class="f-center">
    <form @submit.prevent="login()" class="form">
      <h2>Alfredo authentication</h2>
      <img src="img/icon-512x512.png" width="128" height="128" alt="">
      <input
        v-model="username"
        required
        placeholder="Username"
        class="txt-field"
        type="text"
      />
      <input
        v-model="password"
        required
        placeholder="Password"
        class="txt-field"
        type="password"
      />
      <div class="error" v-if="error">
        {{ error }}
      </div>
      <div v-if="loading">Loggin in...</div>
      <button v-bind:class="{ disabled: loading }" class="btn b-ok">
        Login
      </button>
    </form>
  </div>
</template>

<script>
export default {
  inject: ["setToken"],
  name: "LoginView",
  data() {
    return {
      username: "",
      password: "",
      error: "",
      loading: false,
    };
  },
  methods: {
    async login() {
      try {
        this.loading = true;
        let resp = await fetch("/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: this.username,
            password: this.password,
          }),
        });
        let { success, token, isAdmin, error } = await resp.json();
        if (success) {
          this.setToken(token, isAdmin);
          this.$router.push({ name: "home" });
        } else {
          this.error = error;
        }
        this.username = "";
        this.password = "";
        this.loading = false;
      } catch (e) {
        console.error(e);
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.form {
  padding: 10px;
  margin-top: 40px;
  width: 30%;
  background: grey;
}
.disabled {
  background: rgb(145, 144, 144);
}
@media only screen and (max-width: 600px) {
  .form {
    width: 70%;
  }
}
</style>