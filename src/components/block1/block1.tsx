import { defineComponent } from "vue"
import { block1Box } from './block1.module.scss'

export default defineComponent({
    name: 'Block1',
    data() {
      return {
      }
    },
    render() {
      return <div class={block1Box}>
        模块1
      </div>
    }
  })