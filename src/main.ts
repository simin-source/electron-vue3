import { createApp } from 'vue'
import store from "@/store";
import './style.css'
import App from './App'
import router from "@/router";

createApp(App).use(store).use(router).mount('#app')
