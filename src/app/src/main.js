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

app.provide('setToken', (token, role) => {
    window.localStorage.setItem("token", token);
    window.localStorage.setItem("isAdmin", role);
});

app.provide('isAdmin', () => {
    return window.localStorage.getItem('isAdmin') === "true";
});


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

app.provide('postJSON', async (url, body) => {
    let token = window.localStorage.getItem("token");
    if (token) {
        let response = await fetch(url, {
            method: "POST",
            headers: {
                "token": token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
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

app.use(router).mount('#app');