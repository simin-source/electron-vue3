import { defineComponent } from "vue"
import { block2Box } from './block2.module.scss'

export default defineComponent({
    name: 'Block2',
    data() {
      return {
      }
    },
    render() {
      return <div class={block2Box}>
        模块2
      </div>
    }
  })