import { defineComponent } from "vue"
import { chatBox } from './mainChat.module.scss'

export default defineComponent({
  name: 'MainChat',
  data() {
    return {
    }
  },
  mounted() {
    this.addKeyDomEvent();
    this.getChildInfo();
  },
  methods: {
    addKeyDomEvent() {
      window.addEventListener("keydown", (e) => {
        e.preventDefault();
        let keyValue = this.getKeyName(e);
        console.log(keyValue);

        const funObj = [
          {
            name: "c",
            fun: this.openChildWin,
          },
        ];

        if (keyValue == "c") {
          funObj.forEach(f => {
            if (f.name == keyValue) {
              f.fun();
            }
          });
        }

      }, false);
    },
    getKeyName(e) {
      let key = '';
      if (!e.shiftKey && e.ctrlKey && !e.altKey) {
        key = 'ctrl';
      }
      key = key + e.key;
      return key;
    },
    openChildWin() {
      console.log('打开辅助窗口');
      //@ts-ignore 
      window.api.send("m2e_send", { method: "changeChildWinState" });

    },
    mainSendChild(){
      //@ts-ignore 
      window.api.send("m2e_send", {
        method: "updateChildData",
        obj: { info: 'mainSendInfoToChild' }
      })
    },
    getChildInfo() {
      //@ts-ignore 
      window.api.receive("fromChild", (res: any) => {
        console.log("mainGetChildInfo", res);
      });
    }
  },
  render() {
    return <div class={chatBox} onClick={this.mainSendChild}>
      聊天界面
    </div>
  }
})