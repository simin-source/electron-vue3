<template>
  <div class="wrap">
    <div class="flex-row-start defineLayout">
      <div class="flex-row" @click="changeLayout(LayoutType.FOUR)">
        <div class="name">标准布局</div>
      </div>
      <div class="flex-row" @click="changeLayout(LayoutType.THREE)">
        <div class="name">三栏布局</div>
      </div>
      <el-dropdown ref="dropdown1" trigger="contextmenu" style="margin-right: 30px">
        <div class="flex-row el-dropdown-link" @click="() => {
          if (dropdown1) dropdown1.handleOpen();
        }">
          <div class="name">自定义布局</div>
        </div>
        <template #dropdown>
          <el-checkbox-group class="flex-col-start" v-model="checkedIdList" :max="4" style="padding: 10px 0 10px 30px;">
            <el-checkbox @change="changeLayout(LayoutType.DEFINE)" v-for="(item, index) of cList" :key="index"
              :label='item.id'>{{
                item.name }}</el-checkbox>
          </el-checkbox-group>
        </template>
      </el-dropdown>
    </div>
    <div class="draggable-border">
      <draggable :list="moduleList" item-key="id" :options="{ animation: 200, ghostClass: 'ghost' }" :class="{
        gird1col: moduleList.length == 1,
        gird2col: moduleList.length == 2,
        gird3col: moduleList.length == 3,
        gird4col: moduleList.length == 4
      }">
        <template #item="{ element, index }">
          <component :ref="element.ref" :is="element.component" :name="element.name" :class="{
            [`dragItem${index}`]: true,
          }">
          </component>
        </template>
      </draggable>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useState, useMutations } from "@/utils/useStore";
import Block1 from '@/components/block1/block1';
import Block2 from '@/components/block2/block2';
import Block3 from '@/components/block3/block3';
import Block4 from '@/components/block4/block4';
import Block5 from '@/components/block5/block5.vue';

//@ts-ignore
import draggable from "vuedraggable";
import { LayoutType } from '@/utils/enum';

//资源对象
let resource = ref<any>();
//@ts-ignore
const { moduleList } = useState(["moduleList"], "drag");
//@ts-ignore
const { setModuleList } = useMutations(["setModuleList"], "drag");

let dropdown1 = ref();
let checkedIdList = ref<number[]>([]);//自定义选择的模块

let cList: any[] = [
  {
    type: '1',
    id: 1,
    name: '块1',
    component: Block1
  }, {
    type: '1',
    id: 2,
    name: '块2',
    component: Block2
  }, {
    type: '2',
    id: 3,
    name: '块3',
    component: Block3
  }, {
    type: '2',
    id: 4,
    name: '块4',
    component: Block4
  }, {
    type: '2',
    id: 5,
    name: '块5',
    component: Block5
  },
];

onMounted(() => {
  setCompontent([1, 2, 3, 4]);
})

// 自定义当前页包含组件
const setCompontent = (idList: number[]) => {
  checkedIdList.value = idList;
  let list = cList.filter((f: any) => {
    return idList.indexOf(f.id) != -1;
  });
  setModuleList(list);
  console.log("list", list);
};

// 切换布局
const changeLayout = (type) => {
  switch (type) {
    case LayoutType.THREE:
      setCompontent([1, 2, 5]);
      break;
    case LayoutType.DEFINE:
      if (checkedIdList.value) setCompontent(checkedIdList.value);
      break;
    default:
      // 默认四宫格
      setCompontent([1, 2, 3, 4]);
      break;
  }
}
</script>

<style scoped lang="scss">
.wrap {
  height: 100vh;
  width: 100vw;
  position: relative;
  display: block;
  overflow: hidden;

  .defineLayout {
    color: #fff;
    height: 41px;
    width: 100%;
    background-color: #000;
    align-items: center;
    padding: 0 20px;

    .name {
      font-size: 12px;
      font-weight: 500;
      color: #FFFFFF;
      line-height: 17px;
      margin-left: 5px;
      margin-right: 20px;
      cursor: pointer;
    }
  }

  .draggable-border {
    background-color: #fff;
    width: 100%;
    height: calc(100vh - 41px);
  }
}

// 设置拖拽组件的样式
.draggable-border>div {
  width: 100%;
  height: 100%;
  display: grid;
  grid:
    'one two'
    'three four';
  grid-template-columns: 50% 50%;
  grid-template-rows: 50% 50%;
}

.gird4col {
  grid:
    'one two'
    'three four' !important;
  grid-template-columns: 50% 50% !important;
  grid-template-rows: 50% 50% !important;
}

.gird3col {
  grid:
    'one three'
    'two three' !important;
  grid-template-columns: 50% 50% !important;
  grid-template-rows: 50% 50% !important;
}

.gird2col {
  grid:
    'one two'
    'one two' !important;
  grid-template-columns: 50% 50% !important;
  grid-template-rows: 50% 50% !important;
}

.gird1col {
  grid:
    'one' !important;
  grid-template-columns: 100% !important;
  grid-template-rows: 100% !important;
}

.fullscreen {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
}

.dragItem0 {
  grid-area: one;
}

.dragItem1 {
  grid-area: two;
}

.dragItem2 {
  grid-area: three;
}

.dragItem3 {
  grid-area: four;
}
</style>
