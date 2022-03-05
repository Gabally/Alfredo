<template>
  <div>
    <banner-top />
    <div class="ring-list">
      <div class="ring-card">
        <div class="date">
          25/09/22 14:56
        </div>
        <img class="ring-capture" src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse2.mm.bing.net%2Fth%3Fid%3DOIP.hmHuKw6_uCaaB8rCVqyD6wHaFW%26pid%3DApi&f=1" alt="">
      </div>
    </div>
  </div>
</template>

<script>
import BannerTop from "../components/BannerTop.vue";

export default {
  name: 'DoorbellView',
  components: {
    BannerTop
  }
}
</script>

<style scoped>
.date {
  font-weight: bold;
  font-size: 16px;
  padding: 10px;
}
.ring-list {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}
.ring-card {
  background: rgba(197, 197, 197, 0.24);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  padding: 10px;
  margin: 10px;
  -webkit-box-shadow: -1px 0px 12px 0px rgba(141,138,235,1);
  -moz-box-shadow: -1px 0px 12px 0px rgba(141,138,235,1);
  box-shadow: -1px 0px 12px 0px rgba(141,138,235,1);
  width: 30vw;
}

.ring-capture {
  width: 100%;
}

@media only screen and (max-width: 500px) {
  .ring-card {
    width: 80vw;
  }
}
</style>
