import { defineComponent, reactive } from "vue"
import { activateBox, loading, inputPart, toActivate, loadPart, toRegister, register, tip, registerBtn, close } from './activateToken.module.scss'
import { login, registertoken } from "@/utils/api"
import { encrypt, key } from "@/utils/encrypt"

export const activateState = reactive({
  isTip: true,
})

export default defineComponent({
  name: 'ActivateToken',
  data() {
    return {
      isActivatd: false,
      activateValue: '',
      token: '',
      openRegister: false,
      macAddress: '',
    }
  },
  mounted() {
  },
  methods: {
    getMacAddress() {
      if (!this.activateValue) return;
      // const plaintext = "testUserName";
      const timestamp = Math.floor(Date.now() / 1000).toString()
      const ciphertext = encrypt(timestamp, this.activateValue, key);
      console.log("加密后的密文:", ciphertext);
      console.log("时间戳:", timestamp)
      //TODO:失败,校验激活码传递给h5token
      // login({ t: timestamp, k: ciphertext });
      this.isActivatd = true;
      //@ts-ignore 
      window.api.send("m2e_send", { method: "changeMainUrl" });
      //@ts-ignore
      window.api.receive("fromMain", (res: any) => {
        if(res.isloaded)this.isActivatd = false;
      });
    },
    getRegistertoken() {
      if (!this.macAddress) {
        registertoken(this.macAddress);
      }
    }
  },
  render() {
    return <div class={activateBox}>
      {this.isActivatd ? <div class={`${loadPart} flex-col`}>
        <div>加载页面中...</div>
        <div class={loading}></div>
      </div> : <div class={`${inputPart} flex-col`}>
        <div class='flex-row'>
          <input type='text' v-model={this.activateValue} placeholder="请输入激活码" />
          <div class={`${toActivate} flex-row`} onClick={this.getMacAddress}>激活</div>
        </div>
        {activateState.isTip && <div class={`${tip} flex-row`}>未有激活码, <div class={toRegister} onClick={() => this.openRegister = true}>立即注册</div></div>}
      </div>}
      {this.openRegister && <div class={`${register} flex-col`}>
        <input type='text' v-model={this.macAddress} placeholder="请输入mac_address" />
        <div class={`${registerBtn} flex-row`} onClick={this.getRegistertoken}>注册</div>
        <div>激活码:</div>
        <div class={close} onClick={() => { this.openRegister = false }}>×</div>
      </div>}
    </div>
  }
})
