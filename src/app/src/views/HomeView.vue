<template>
  <div>
    <banner-top />
    <div class="nav">
      <div v-for="room in Object.keys(config)" :key="room" @click="selectedRoom = room" >{{ room }}</div>
    </div>
    <main v-if="selectedRoom">
      <switch-card v-for="sn in config[selectedRoom].sonoffs" :key="sn" :name="sn.name" :state="false" />
      <button-card v-for="btn in config[selectedRoom].buttons" :key="btn" :name="btn.name" />
      <button-card v-for="computer in config[selectedRoom].computers" :key="computer" :name="computer.name" />
      <video-card v-for="camera in config[selectedRoom].cameras" :key="camera" :name="camera.name" />
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
  inject: ["getJSON"],
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
      selectedRoom: null
    }
  },
  async mounted() {
    this.config = await this.getJSON("/api/devices");
    this.selectedRoom = Object.keys(this.config)[0];
    io({ path: "/api/socket.io" });
  }
};
</script>

<style>
.nav {
  display: flex;
  flex-direction: row;
  justify-content: left;
  background: rgba(101, 157, 231, 0.856);
  font-size: 20px;
  user-select: none;
  overflow-x: scroll;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.nav::-webkit-scrollbar {
  display: none;
}

.nav > div {
  transition: 0.1s;
  margin-top: 8px;
  margin-left: 5px;
  background: rgb(163, 202, 253);
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  padding: 10px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  white-space: nowrap;
}

.nav > div:hover {
  background: rgb(156, 180, 212);
}

.nav > div:active {
  background: rgb(120, 145, 179);
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
