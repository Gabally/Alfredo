<template>
  <div>
    <banner-top />
    <div class="nav">
      <div v-for="room in Object.keys(config)" :key="room" @click="selectedRoom = room" >{{ room }}</div>
    </div>
    <main v-if="selectedRoom">
      <switch-card @statechange="sendToggle" v-for="sn in config[selectedRoom].sonoffs" :key="sn" type="sonoffs" :name="sn.name" :state="sn.status" />
      <button-card @trigger="sendTrigger(btn.name, 'buttons')" v-for="btn in config[selectedRoom].buttons" :key="btn" :name="btn.name" />
      <button-card @trigger="sendTrigger(wol.name, 'wol')" v-for="wol in config[selectedRoom].wol" :key="wol" :name="wol.name" />
      <video-card still="https://testimages.org/img/testimages_screenshot.jpg" src="https://testimages.org/img/testimages_screenshot.jpg" v-for="camera in config[selectedRoom].cameras" :key="camera" :name="camera.name" />
    </main>
  </div>
</template>

<script>
import SwitchCard from "../components/SwitchCard.vue";
import ButtonCard from "../components/ButtonCard.vue";
import VideoCard from "../components/VideoCard.vue";
import BannerTop from "../components/BannerTop.vue";

import { io } from "socket.io-client";

export default {
  inject: ["getJSON", "getToken", "isAuthenticated"],
  name: "HomeView",
  components: {
    SwitchCard,
    ButtonCard,
    VideoCard,
    BannerTop
  },
  data() {
    return {
      config: {},
      selectedRoom: null,
      socket: null,
    }
  },
  async mounted() {
    if (!this.isAuthenticated()) {
      this.$router.push({ name: "login" });
    }
    this.config = await this.getJSON("/api/devices");
    this.selectedRoom = Object.keys(this.config)[0];
    this.socket = io({ path: "/api/socket.io", query: { token: this.getToken() } });
    this.socket.on("on", (room, name) => {
      let index = this.config[room]["sonoffs"].findIndex(sn => sn.name === name);
      this.config[room]["sonoffs"][index].status = true;
    });
    this.socket.on("off", (room, name) => {
      let index = this.config[room]["sonoffs"].findIndex(sn => sn.name === name);
      this.config[room]["sonoffs"][index].status = false;
    });
  },
  methods: {
    sendTrigger(device, type) {
      this.socket.emit("trigger", this.selectedRoom, device, type);
    },
    sendToggle(state, device, type) {
      this.socket.emit(state ? "on" : "off", this.selectedRoom, device, type);
    }
  }
};
</script>

<style>
.nav {
  display: flex;
  flex-direction: row;
  justify-content: left;
  font-size: 20px;
  user-select: none;
  overflow-x: scroll;
  -ms-overflow-style: none;
  scrollbar-width: none;
  background: rgb(66, 66, 66);
}

.nav::-webkit-scrollbar {
  display: none;
}

.nav > div {
  transition: 0.1s;
  margin-top: 8px;
  margin-left: 5px;
  color: white;
  padding: 10px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  white-space: nowrap;
}

.nav > div:hover {
  background: rgba(116, 116, 116, 0.308);
}

.nav > div:active {
  background: rgb(93, 93, 94);
}
</style>

<style scoped>
main {
  margin-left: 10px;
  margin-right: 10px;
  padding: 10px;
}

@media only screen and (max-width: 500px) {
  main {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
}
</style>
