<template>
  <router-view/>
</template>

<script>
export default {
  mounted() {
    
  }
}
</script>
<style>

#app {
  height: 100vh;
}

@font-face {
    font-family: 'bitpapmedium';
    src: url('./assets/fonts/bitpap-webfont.woff2') format('woff2'),
         url('./assets/fonts/bitpap-webfont.woff') format('woff');
    font-weight: normal;
    font-style: normal;
}

* {
  margin: 0px;
  padding: 0px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #242d36;
  -webkit-tap-highlight-color: transparent;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

body {
  font-family: bitpapmedium, Arial, Helvetica, sans-serif;
  background: url("./assets/imgs/bg.jpg");
  background-size: 192px;
  image-rendering: -moz-crisp-edges;
  image-rendering: -webkit-crisp-edges;
  image-rendering: pixelated;
  image-rendering: crisp-edges;
  margin: 0px;
  padding: 0px;
}

*::-webkit-scrollbar {
  display: none;
}


.btn {
  font-family: bitpapmedium, Arial, Helvetica, sans-serif;
}

.padded {
  margin: 10px;
}

.crisp-image {
  image-rendering: -moz-crisp-edges;
  image-rendering: -webkit-crisp-edges;
  image-rendering: pixelated;
  image-rendering: crisp-edges;
}

.form {
  -webkit-box-shadow: -1px 0px 18px 0px rgba(0,0,0,0.48);
  -moz-box-shadow: -1px 0px 18px 0px rgba(0,0,0,0.48);
  box-shadow: -1px 0px 18px 0px rgba(0,0,0,0.48);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  border-radius: 5px;
}

.f-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.txt-field {
  border: 0px;
  outline: none;
  margin: 5px;
  font-size: 15px !important;
  border: 1px solid rgba(92, 92, 92, 0.61);
  border-radius: 5px;
  padding: 5px;
  width: 80%;
}

.txt-field:focus {
  -webkit-box-shadow: -1px 0px 8px 0px rgba(141,138,235,1);
  -moz-box-shadow: -1px 0px 8px 0px rgba(141,138,235,1);
  box-shadow: -1px 0px 8px 0px rgba(141,138,235,1);
}

.btn {
  outline: none;
  border: 1px solid rgba(110, 109, 109, 0.651);
  cursor: pointer;
  font-size: 16px;
  padding: 5px;
  margin: 5px;
  border-radius: 5px;
  transition: 0.1s;
}

.btn:active {
  transform: translateY(2px) scale(0.99);
}

.b-ok {
  background: rgba(65, 176, 228, 0.596);
}

.b-ok:hover {
  background: rgba(56, 157, 204, 0.699);
}

.b-ok:active {
  background: rgba(45, 130, 170, 0.719);
}

.card {
  float: left;
}

.error {
  margin: 5px;
  color: red;
  font-weight: bold;
}

.checkbox {
  width: 20px;
  height: 20px;
  margin: 10px;
  cursor: pointer;
  border-radius: 5px;   
}

@media only screen and (max-width: 500px) {
  .form {
    width: 70%;
  }
}
</style>
