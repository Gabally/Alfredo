<template>
  <div class="f-center">
    <form @submit.prevent="login()" class="form">
        <h2>Alfredo authentication</h2>
        <input v-model="username" required placeholder="Username" class="txt-field" type="text">
        <input v-model="password" required placeholder="Password" class="txt-field" type="password">
        <div class="error" v-if="error"> 
          {{ error }}
        </div>
        <button class="btn b-ok">Login</button>
    </form>
  </div>
</template>

<script>
export default {
  inject: ["isAuthenticated", "setToken"],
  name: 'LoginView',
  data() {
    return {
      username: "",
      password: "",
      error: ""
    }
  },
  mounted() {
    if (this.isAuthenticated()) {
      this.$router.push({ name: "home" });
    }
  },
  methods: {
    async login() {
      let resp = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body : JSON.stringify({
          username: this.username,
          password: this.password
        })
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
    }
  }
}
</script>

<style scoped>
.form {
  padding: 10px;
  margin-top: 40px;
  width: 30%;
  background: grey;
}
</style>