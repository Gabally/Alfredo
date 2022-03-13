<template>
  <div class="banner">
    <div class="logo" @click="toHome">
      Alfredo
    </div>
    <div class="actions">
      <img src="@/assets/imgs/icons/notification.png" alt="">
      <img v-if="isAdmin()" @click="toSettings()" src="@/assets/imgs/icons/settings.png" alt="">
      <img @click="logout()" src="@/assets/imgs/icons/logout.png" alt="">
    </div>
  </div>
</template>

<script>
export default {
  inject: ["postJSON", "isAdmin"],
  name: 'BannerTop',
  props: {
  },
  methods: {
    toHome() {
      this.$router.push({ name: "home" });
    },
    toSettings() {
      this.$router.push({ name: "settings" });
    },
    async logout() {
      let { success, error } = await this.postJSON("/api/logout", {});
      if (success) {
        window.localStorage.removeItem("token");
        window.localStorage.removeItem("isAdmin");
        this.$router.push({ name: "login" });
      } else {
        alert(`An error occurred while logging out: ${error}`);
      }
    }
  }
}
</script>

<style scoped>
.banner {
  background: rgb(66, 66, 66);
  padding: 15px;
  font-size: 23px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.logo {
  cursor: pointer;
  color: white;
}

.actions {
  margin-right: 10px;
}

.actions > img {
  cursor: pointer;
  margin-left: 10px;
  width: 32px;
  height: 32px;
  transition: .1s;
}

.actions > img:hover {
  transform: scale(1.1);
}

.actions > img:active {
  transform: scale(0.95);
}
</style>
