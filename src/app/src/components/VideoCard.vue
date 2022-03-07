<template>
  <div class="card">
    <div class="title">
        {{ name }}
    </div>
    <img @click="viewFullScreen" class="video" :src="still" alt="">
    <div v-if="showFullscreen" class="fullscreen a-center">
      <div class="obscurator a-center" @click="closeFullScreen"></div>
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
    text-overflow: ellipsis;
    max-width: 120px;
    margin: 10px;
}
.card {
    display: flex;
    flex-direction: column;
    width: 200px;
    height: 200px;
    margin: 5px;
    padding: 20px;
    padding-bottom: 25px;
    font-size: 25px;
    border-radius: 3px;
    background: url("@/assets/imgs/video-bg.png");
    background-size: cover;
}

.video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    cursor: pointer;
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
