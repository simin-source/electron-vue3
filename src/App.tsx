import { Fragment, defineComponent } from "vue";
import MyDraggable from '@/components/myDraggable/myDraggable';
import MyDraggable2 from '@/components/myDraggable2/myDraggable.vue';

export default defineComponent({
    render() {
        return <Fragment>
            <MyDraggable />
            {/* <MyDraggable2 /> */}
        </Fragment>
    }
})