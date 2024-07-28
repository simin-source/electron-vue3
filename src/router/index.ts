import MainChat from '@/pages/mainChat/mainChat';
import ChildChat from '@/pages/childChat/childChat';
import { createRouter, createWebHashHistory } from 'vue-router';

const routes = [
  // 动态字段以冒号开始
  { path: '/', component: MainChat },
  { path: '/child', component: ChildChat },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes: routes,
});
export default router;
