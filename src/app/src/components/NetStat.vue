<template>
  <div class="card">
    <h4 class="padded">Router</h4>
    <div class="f-center spacey">
      <div class="title">Internet:</div>
      <img v-if="internetOK" src="@/assets/imgs/icons/internet-ok.png" alt="" />
      <img v-else src="@/assets/imgs/icons/internet-down.png" alt="" />
    </div>
    <div class="f-center spacey">
      <div>Reboot:</div>
      <img
        @click="trigger()"
        class="push-btn crisp-image"
        v-if="!down"
        src="../assets/imgs/ui/button_up.png"
        alt=""
      />
      <img
        class="push-btn crisp-image"
        v-show="down"
        src="../assets/imgs/ui/button_down.png"
        alt=""
      />
    </div>
    <div v-if="error">
      {{ error }}
    </div>
  </div>
</template>

<script>
export default {
  inject: ["getJSON"],
  name: "NetStat",
  data() {
    return {
      down: false,
      internetOK: true,
      error: "",
    };
  },
  methods: {
    async trigger() {
      this.down = true;
      await this.getJSON("/api/rebootrouter");
      setTimeout(() => {
        this.down = false;
      }, 200);
    },
  },
  async mounted() {
    let { success, error, status } = await this.getJSON("/api/netstat");
    if (success) {
      this.internetOK = status;
    } else {
      this.error = error;
    }
  },
};
</script>

<style scoped>
.title {
  max-width: 120px;
}
.card {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 200px;
  margin: 5px;
  padding: 10px;
  border-radius: 3px;
  font-size: 25px;
    background: #777777;
  border: 5px solid #807474;
  flex-direction: column;
}
.push-btn {
  cursor: pointer;
  width: 40px;
  height: 40px;
}
.spacey {
    justify-content: space-around;
    width: 100%;
}
</style>
