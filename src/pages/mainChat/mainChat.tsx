import { defineComponent } from "vue"
import { chatBox, cutScreen } from './mainChat.module.scss'

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
    fileTest(e) {
      e?.stopPropagation();
      //@ts-ignore 
      window.api.send("m2e_send", {
        method: "mainWriteFile",
        obj: { funType: 'fun1', contentType: 'chats', data: JSON.stringify({ a: 1 }) },
      })
      //@ts-ignore
      window.api.send("m2e_send", {
        method: "mainReadFile",
        obj: { funType: 'fun1', contentType: 'chats' },
      })
      //@ts-ignore 
      window.api.send("m2e_send", {
        method: "mainWriteFile",
        obj: { funType: '', contentType: '', data: JSON.stringify({ b: 1 }) },
      })//写入taskid
      //@ts-ignore
      window.api.send("m2e_send", {
        method: "mainReadFile",
        obj: { funType: '', contentType: '' },
      })//读取taskid
      //@ts-ignore 
      window.api.receive("fromMain", (res: any) => {
        console.log("fromMain", res);
      });
    },
    addKeyDomEvent() {
      window.addEventListener("keydown", (e) => {
        e.preventDefault();
        let keyValue = this.getKeyName(e);
        console.log(keyValue);

        const funObj = [
          {
            name: "n",//new
            fun: this.openChildWin,
          },
          {
            name: "c",//cut
            fun: this.openCutSreen,
          },
        ];

        if (keyValue == "c" || keyValue == "n") {

          funObj.forEach((f: any) => {

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
      window.api.send("m2e_send", { method: "changeChildWinState", type: 'new' });

    },
    mainSendChild(e) {
      e?.stopPropagation();
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
    },
    openCutSreen(e) {
      console.log('打开截图窗口');
      e?.stopPropagation();
      //@ts-ignore 
      window.api.send("m2e_send", { method: "changeChildWinState", type: 'cut' });
    }
  },
  render() {
    return <div class={chatBox} onClick={this.mainSendChild}>
      聊天界面
      <div class={cutScreen} onClick={this.openCutSreen}>截图</div>
      <div class={cutScreen} style={{marginTop:'10px'}} onClick={this.fileTest}>文件测试</div>
    </div>
  }
})