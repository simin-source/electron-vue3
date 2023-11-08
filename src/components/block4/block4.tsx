import { defineComponent } from "vue"
import { block4Box } from './block4.module.scss'

export default defineComponent({
  name: 'Block4',
  data() {
    return {
    }
  },
  render() {
    return <div class={block4Box}>
      模块4
    </div>
  }
})