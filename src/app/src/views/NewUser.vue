<template>
  <div>
    <banner-top />
    <div class="f-center">
      <form @submit.prevent="createAccount()" class="form">
        <h2 class="padded">Create New User:</h2>
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
        <input
          v-model="mac"
          placeholder="Phone MAC Address"
          class="txt-field"
          type="text"
        />
        <div class="padded">
          <span style="font-size: 20px">Is Admin:</span>
          <input type="checkbox" v-model="isAdmin" class="checkbox" />
        </div>
        <div class="error" v-if="error">
          {{ error }}
        </div>
        <div class="f-center">
          <button
            class="btn b-cancel"
            @click="$router.push({ name: 'settings' })"
          >
            Cancel
          </button>
          <button class="btn b-ok">Create</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import BannerTop from "../components/BannerTop.vue";

export default {
  inject: ["postJSON"],
  name: "NewUserView",
  components: {
    BannerTop,
  },
  data() {
    return {
      username: "",
      password: "",
      mac: "",
      isAdmin: false,
      error: "",
    };
  },
  mounted() {},
  methods: {
    async createAccount() {
      if (this.mac && !/^[0-9a-fA-F:]+$/.test(this.mac)) {
        this.error = "Invalid MAC Address";
        return;
      }
      let resp = await this.postJSON("/api/accounts/create", {
        username: this.username,
        password: this.password,
        mac: this.mac,
        isAdmin: this.isAdmin,
      });
      let { success, error } = resp;
      if (success) {
        this.$router.push({ name: "settings" });
      } else {
        this.error = error;
      }
      this.username = "";
      this.password = "";
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
.b-cancel {
  background: rgb(185, 64, 64);
}
.b-cancel:hover {
  background: rgb(167, 56, 56);
}
.b-cancel:active {
  background: rgb(151, 49, 49);
}
</style>