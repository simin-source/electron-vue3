import { defineComponent } from "vue";
import { dragBox, btnGroup, btnName, ghost, chosenClass } from './myDraggable.module.scss';
import Draggable from 'vuedraggable';
import Block1 from '@/components/block1/block1';
import Block2 from '@/components/block2/block2';
import Block3 from '@/components/block3/block3';
import Block4 from '@/components/block4/block4';
import 'element-plus/es/components/select/style/css'

export default defineComponent({
  name: 'MyDraggable',
  data() {
    return {
      list: [
        {
          type: '1',
          name: '块1',
          component: Block1
        }, {
          type: '1',
          name: '块2',
          component: Block2
        }, {
          type: '2',
          name: '块3',
          component: Block3
        }, {
          type: '2',
          name: '块4',
          component: Block4
        },
      ],
      dataSource: [
        {
          id: 1,
          label: 'Level one 1',
          children: [
            {
              id: 3,
              label: 'Level two 1-1',
              children: [
                {
                  id: 5,
                  label: 'Level three 1-1-1',
                },
                {
                  index:1,
                  id: 6,
                  label: 'Level three 1-1-2',
                },
              ],
            },
          ],
        },
        {
          id: 2,
          label: 'Level one 1',
          children: [
            {
              id: 4,
              label: 'Level two 1-1',
              children: [
                {
                  id: 7,
                  label: 'Level three 1-1-1',
                },
                {
                  id: 8,
                  label: 'Level three 1-1-2',
                },
              ],
            },
          ],
        },
      ],
    }
  },
  render() {
    return <div class={dragBox}>
      <div class={`${btnGroup} flex-row-start-center`}>
        <div class="flex-row">
          <div class={btnName}>标准布局</div>
        </div>
        <div class="flex-row">
          <div class={btnName}>自定义布局</div>
        </div>
      </div>
      <Draggable
        list={this.list}
        ghost-class={ghost}//拖动元素类名
        chosen-class={chosenClass}//被选中目标样式
        v-slots={{
          item: ({element}:any) => {
            console.log(element);
            console.log(element.component);
            //vue warning: If this is a native custom element, make sure to exclude it from component resolution via compilerOptions.isCustomElement
            // 若是本机自定义元素，请确保通过compilerOptions.isCustomElement 将其从组件解析中排除；
            return <component is={element.component} name={element.name}/>
          }
        }}
      />
    </div >
  }
})