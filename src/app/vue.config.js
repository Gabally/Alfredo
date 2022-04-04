const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    host: "app"
  },
  pwa: {
    name: "Alfredo Companion"
  }
})
