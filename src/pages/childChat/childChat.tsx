import { defineComponent } from "vue"
import { chatBox } from './childChat.module.scss'

export default defineComponent({
  name: 'ChildChat',
  data() {
    return {
    }
  },
  mounted() {
    this.getMainInfo();
  },
  methods: {
    getMainInfo() {
      //@ts-ignore 
      window.api.receive("fromMain", (res: any) => {
        console.log("childGetMainInfo", res);
      });
    },
    childSendMain(){
      //@ts-ignore 
      window.api.send("c2e_send", {
        method: "updateMainData",
        obj: { info: 'childSendInfoToMain' }
      })
    }
  },
  render() {
    return <div class={chatBox} onClick={this.childSendMain}>
      聊天界面-辅助
    </div>
  }
})