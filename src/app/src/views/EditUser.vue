<template>
  <div>
    <banner-top />
    <div class="f-center">
      <form @submit.prevent="createAccount()" class="form">
        <h2 class="padded">Edit user details:</h2>
        <input
          v-model="username"
          required
          placeholder="Username"
          class="txt-field"
          type="text"
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
        <div class="padded f-center" style="flex-direction: column;">
          <div>Reset Password:</div>
          <div class="f-center">
            <input v-model="password" type="password" class="txt-field" />
            <button @click="resetPassword()" type="button" class="btn">
              <img src="@/assets/imgs/icons/reset.png" alt="">
            </button>
          </div>
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
          <button class="btn b-ok">Save</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import BannerTop from "../components/BannerTop.vue";

export default {
  inject: ["postJSON", "getJSON"],
  name: "EditUserView",
  components: {
    BannerTop,
  },
  data() {
    return {
      username: "",
      mac: "",
      isAdmin: false,
      error: "",
      password: ""
    };
  },
  async mounted() {
    let { username, is_admin, phone_mac } = await this.getJSON(`/api/accounts/info/${this.$route.params.id}`);
    this.username = username;
    this.mac = phone_mac;
    this.isAdmin = is_admin == 1;
  },
  methods: {
    async createAccount() {
      if (this.mac && !/^[0-9a-fA-F:]+$/.test(this.mac)) {
        this.error = "Invalid MAC Address";
        return;
      }
      let { success, error } = await this.postJSON(`/api/accounts/update/${this.$route.params.id}`, {
        username: this.username,
        mac: this.mac,
        isAdmin: this.isAdmin,
      });
      if (success) {
        this.$router.push({ name: "settings" });
      } else {
        this.error = error;
      }
    },
    async resetPassword() {
      if (!this.password) {
        alert("Invalid password");
        return;
      }
      let { success, error } = await this.postJSON(`/api/accounts/resetpassword/${this.$route.params.id}`, {
        password: this.password,
      });
      this.password = "";
      if (success) {
        alert("Password reset successfull");
      } else {
        this.error = error;
      }
    }
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