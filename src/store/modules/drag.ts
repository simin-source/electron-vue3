const drag = {
    namespaced: true,
    state: {
      moduleList: [],
    },
    mutations: {
      setModuleList(state: any, newList: any) {
        state.moduleList = newList;
      },
    },
    getters: {
      getModuleList: (state: any) => state.moduleList,
    },
    actions: {
    },
  };
  
  export default drag;
  