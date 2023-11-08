import { defineComponent } from "vue"
import { block3Box } from './block3.module.scss'

export default defineComponent({
  name: 'Block3',
  data() {
    return {
    }
  },
  render() {
    return <div class={block3Box}>
      模块3
    </div>
  }
})