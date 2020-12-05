import { mergeOptions } from '../utils';

let uid = 0;
function init (options) {
    this.$el = null; // 每个实例指向的dom元素
    this.$parent = options.parent;  // 父子组件关系，构成一棵MVue实例节点树
    if (this.$parent) { // 如果不是根节点
        // 父子组件建立联系
        this.$parent.$children.push(this);
    }
    this.$children = [];
    // 根节点，插件实例就只需要绑定到根节点即可
    this.$root = this.$parent
        ? this.$parent.$root
        : this;

    // 属性 
    this._isMVue = true;  // 避免实例被数据劫持
    this._uid = uid++;  // 实例unique id  

    this._events = [];
    this._directives = [];

    // 合并参数
    options = this.$options = mergeOptions(
        this.constructor.options,  //全局options(也就是MVue.options)
        options,  // 构造时传入的mergeOptions
        this   // 当前实例
    );
    console.log(options.data(), 'options')
    this._initMixins();  // 处理实例 mixins 配置
    this._callHook('beforeCreate');
    this._initState(); // Observer 处理
    this._callHook('created');
    if (options.el) {
        this.$compile();
    }
}

// 组件mixins
function initMixins () {
    if (this.$options.mixins) {
        const options = this.$options;
        this.$options = mergeOptions(options, options.mixins);  // 这里的参数顺序好像有问题 应该是以组件的为准
    }
}

export default {
    _init: init,
    _initMixins: initMixins,
};