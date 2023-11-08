import { createStore } from "vuex";
import drag from "./modules/drag"; //用户

const store = createStore({
  state: {
    //状态管理器中定义的数据源
  },
  mutations: {
    //同步操作
  },
  actions: {
    //异步操作
  },
  //getters相当于计算属性
  getters: {},
  modules: {
    drag
  },
});

export default store;