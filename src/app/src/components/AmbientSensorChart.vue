<template>
  <div class="card f-center">
    <h4 class="padded">Sensore Ambiente</h4>
    <canvas style="border-top-right-radius: 5px;border-top-left-radius: 5px;" ref="temp"></canvas>
    <canvas style="border-bottom-right-radius: 5px;border-bottom-left-radius: 5px;" ref="humidity"></canvas>
  </div>
</template>

<script>
import Chart from "chart.js/auto";

export default {
  inject: ["getJSON"],
  name: "AmbientSensorChart",
  props: {
    name: String,
    room: String
  },
  data() {
    return {
      data: []
    }
  },
  methods: {
  },
  async mounted() {
    let { data } = await this.getJSON(`/api/ambientsensors/${this.room}/${this.name}`);
    this.data = data;
    const chartOption = {
      responsive: true,
        scales: {
          x: {
            ticks: {
            display: false,
          },
          grid: {
            display: false
          }
        }
      }
    }
    const tempChartData = {
      labels: this.data.map(e => new Date(e.timestamp).toLocaleString()),
      datasets: [
        {
          label: "Temperatura",
          data: this.data.map(e => new Date(e.temperature)),
          backgroundColor: ["rgba(255, 99, 132, 0.5)"]
        }
      ]
    };
    new Chart(this.$refs.temp, {
      type: "line",
      data: tempChartData,
      options: chartOption,
    });
    const humidityChartData = {
      labels: this.data.map(e => new Date(e.timestamp).toLocaleString()),
      datasets: [
        {
          label: "Umidità",
          data: this.data.map(e => new Date(e.humidity)),
          backgroundColor: ["rgba(255, 159, 64, 0.5)"]
        }
      ]
    }
    new Chart(this.$refs.humidity, {
      type: "line",
      data: humidityChartData,
      options: chartOption,
    });
  }
}
</script>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  width: 300px;
  height: 300px;
  margin: 5px;
  padding: 45px;
  font-size: 25px;
  border-radius: 3px;
  background: url("@/assets/imgs/video-bg.png");
  background-size: cover;
}
canvas {
  background: rgb(243, 241, 241);
}
@media only screen and (max-width: 500px) {
  .card {
    width: 80%;
    background-size: contain;
    background-repeat: no-repeat;
  }
}
</style>
