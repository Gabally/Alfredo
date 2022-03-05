import { createApp } from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';

const app = createApp(App);

app.provide('isAuthenticated', () => {
    return window.localStorage.getItem("token") !== null;
});

app.provide('getToken', () => {
    return window.localStorage.getItem("token");
});
/*
app.provide('getJSON', async (url) => {
    let token = window.localStorage.getItem("token");
    if (token) {
        let response = await fetch(url, {
            headers: {
                "Token": token
            }
        });
        if (response.status === 200) {
            return await response.json();
        } else if (response.status === 401) {
            window.localStorage.removeItem("token");
            this.$router.push({ name: "login" });
        }
    } else {
        this.$router.push({ name: "login" });
    }
});
*/

app.provide('getJSON', async (url) => {
    let response = await fetch(url);
    return await response.json();
});

app.use(router).mount('#app');