<template>
  <div>
    <div class="nav-to-top">
      <banner-top />
      <div class="nav">
        <div v-bind:class="{'tab-active':(selectedRoom === room)}" v-for="room in Object.keys(config)" :key="room" @click="selectedRoom = room" >{{ room }}</div>
        <div v-bind:class="{'tab-active':(selectedRoom === 'doorbell')}" @click="loadDoorbell()" >Campanello</div>
      </div>
    </div>
    <main class="doorbell-events" v-if="selectedRoom == 'doorbell'">
      <doorbell-event v-for="ring in rings" :key="ring" :img="ring.img" :when="ring.timestamp" />
    </main>
    <main v-else-if="selectedRoom">
      <switch-card @statechange="sendToggle" v-for="sn in config[selectedRoom].sonoffs" :key="sn" type="sonoffs" :name="sn.name" :state="sn.status" />
      <button-card @trigger="sendTrigger(btn.name, 'buttons')" v-for="btn in config[selectedRoom].buttons" :key="btn" :name="btn.name" />
      <button-card @trigger="sendTrigger(wol.name, 'wol')" v-for="wol in config[selectedRoom].wol" :key="wol" :name="wol.name" />
      <video-card :still="`/api/cameras/still/${selectedRoom}/${camera.name}?token=${getToken()}`" :src="`/api/cameras/feed/${selectedRoom}/${camera.name}?token=${getToken()}`" v-for="camera in config[selectedRoom].cameras" :key="camera" :name="camera.name" />
      <presence-detection v-if="config[selectedRoom]['presence_detection']" :room="selectedRoom" />
      <net-stat v-if="config[selectedRoom]['netstat']" />
      <ambient-sensor-chart  v-for="sensor in config[selectedRoom]['ambient_sensors']" :key="sensor" :name="sensor.name" :room="selectedRoom" />
    </main>
  </div>
</template>

<script>
import SwitchCard from "../components/SwitchCard.vue";
import ButtonCard from "../components/ButtonCard.vue";
import VideoCard from "../components/VideoCard.vue";
import BannerTop from "../components/BannerTop.vue";
import DoorbellEvent from "../components/DoorbellEvent.vue";
import AmbientSensorChart from "../components/AmbientSensorChart.vue";
import PresenceDetection from "../components/PresenceDetection.vue";
import NetStat from "../components/NetStat.vue";

import { io } from "socket.io-client";

export default {
  inject: ["getJSON", "getToken"],
  name: "HomeView",
  components: {
    SwitchCard,
    ButtonCard,
    VideoCard,
    BannerTop,
    DoorbellEvent,
    AmbientSensorChart,
    PresenceDetection,
    NetStat
  },
  data() {
    return {
      config: {},
      selectedRoom: null,
      socket: null,
      rings: []
    }
  },
  async mounted() {
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
    },
    async loadDoorbell() {
      this.selectedRoom = "doorbell";
      let { success, error, events } = await this.getJSON("/api/doorbellevents");
      if (success) {
        this.rings = events;
      } else {
        alert(error);
      }
    }
  }
};
</script>

<style>
.nav-to-top {
  position: sticky;
  top: 0px;
}
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

.tab-active {
  background: rgba(82, 81, 81, 0.76);
}
.doorbell-events {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
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
    align-items: center;
    flex-direction: column;
  }
}
</style>
