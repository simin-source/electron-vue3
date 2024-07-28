import { Fragment, defineComponent } from "vue";
import MyDraggable from '@/components/myDraggable/myDraggable.vue';
import MainChat from '@/pages/mainChat/mainChat';
import { RouterView } from "vue-router";

export default defineComponent({
    render() {
        return <RouterView />
        // return <Fragment>
        // {/* <h1>Hello World!</h1>
        // We are using Node.js <span id="node-version"></span>,
        // Chromium <span id="chrome-version"></span>,
        // and Electron <span id="electron-version"></span>. */}
        // {/* <MyDraggable /> */}
        // <MainChat/>
        // </Fragment>
    }
})