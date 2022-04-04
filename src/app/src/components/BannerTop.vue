<template>
  <div class="banner">
    <div class="logo" @click="toHome">
      Alfredo
    </div>
    <div class="actions">
      <img @click="registerNotifications()" src="@/assets/imgs/icons/notification.png" alt="">
      <img @click="toSettings()" src="@/assets/imgs/icons/settings.png" alt="">
      <img @click="logout()" src="@/assets/imgs/icons/logout.png" alt="">
    </div>
  </div>
</template>

<script>
export default {
  inject: ["postJSON", "isAdmin", "getJSON"],
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
    },
    async registerNotifications() {
      if ("serviceWorker" in navigator) {
        let { publicKey } = await this.getJSON("/api/notifications/publickey");
        const registration = await navigator.serviceWorker.register("notification-worker.js", {scope: "/"});
        const subscription = await registration.pushManager.
        subscribe({
          userVisibleOnly: true,
          applicationServerKey: this.urlBase64ToUint8Array(publicKey)
        });
        let { success, error } = await this.postJSON("/api/notifications/add", {
          subscription: JSON.stringify(subscription)
        });
        if (success) {
          alert("Notifications configured successfully");
        } else {
          alert(error);
        }
      } else {
        alert("Error: Your browser doesn't support service workers :(");
      }
    },
    urlBase64ToUint8Array(base64String) {
      let padding = "=".repeat((4 - base64String.length % 4) % 4);
      let base64 = (base64String + padding)
          .replace(/-/g, "+")
          .replace(/_/g, "/");

      let rawData = window.atob(base64);
      let outputArray = new Uint8Array(rawData.length);

      for (let i = 0; i < rawData.length; ++i) {
          outputArray[i] = rawData.charCodeAt(i);
      }
      return outputArray;
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
