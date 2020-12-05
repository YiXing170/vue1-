import mixins, {
    init,  // 初始化函数
    state,
    lifecycle,
    render,
} from './mixins';
import { useGlobal } from './global';
import directives from './directive/directives';


// 装饰原型  
@mixins([
    init, //让每个实例获得特别的功能,原型获得_init 和_initMixins方法
    state, // data props methods
    lifecycle, //为实例披上生命周期函数
    render, // 等同于Compile处理
])
class MVue {
    constructor(options = {}) {
        this._init(options);
    }
}

// 自带的指令 组件 过滤器
MVue.options = {
    directives, // 
    components: {},
    filters: {},
};

// this is used to identify the "base" constructor to extend all plain-object
// components with in Weex's multi-instance scenarios.
// 来自Vue源码，不是很明白这么设置。
MVue.options._base = MVue;

useGlobal(MVue);  // 给MVue添加mixin extend use component nextTick 方法
window.MVue = MVue;
export default MVue;