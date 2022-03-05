<template>
  <div @click="viewFullScreen" class="card">
    <div class="title">
        {{ name }}
    </div>
    <img class="video" :src="still" alt="">
    <div v-if="showFullscreen" class="fullscreen a-center">
      <div class="close-feed" @click="closeFullScreen">
        ❌
      </div>
      <div class="obscurator a-center"></div>
      <img class="feed" :src="src" alt="">
    </div>
  </div>
</template>

<script>
export default {
  name: 'VideoCard',
  props: {
    name: String,
    still: String,
    src: String
  },
  data() {
    return {
      showFullscreen: false
    }
  },
  methods: {
    viewFullScreen() {
      this.showFullscreen = true;
      document.body.style.overflow = "hidden";
    },
    closeFullScreen() {
      this.showFullscreen = false;
      document.body.style.overflow = "visible";
    }
  }
}
</script>

<style scoped>
.title {
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 120px;
    margin-bottom: 6px;
}
.card {
    -webkit-box-shadow: -1px 0px 12px 0px rgba(141,138,235,1);
    -moz-box-shadow: -1px 0px 12px 0px rgba(141,138,235,1);
    box-shadow: -1px 0px 12px 0px rgba(141,138,235,1);
    display: flex;
    flex-direction: column;
    width: 200px;
    height: 200px;
    margin: 5px;
    padding: 10px;
    border-radius: 3px;
}

.video {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.a-center {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.fullscreen {
  z-index: 999999999;
  width: 100vw;
  height: auto;
  text-align: center;
  user-select: none;
}

.obscurator {
  z-index: 9999;
  background: rgba(161, 161, 161, 0.26);
  width: 100vw;
  height: 100vh;
}

.feed {
  width: 80%;
  object-fit: contain;
  border: 2mm ridge rgba(73, 73, 73, 0.76);
  border-radius: 3px;
}

.close-feed {
  position: absolute;
  top: 10px;
  left: 10px;
  font-size: 16px;
  cursor: pointer;
  z-index: 999999;
}
</style>
