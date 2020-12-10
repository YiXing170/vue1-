import { replace, insertAfter, insertBefore, getComponent } from "../utils";

// options.components处理 是不对外暴露的指令
export default {
    bind () {
        const componentName = this.expression;
        this.anchorStart = document.createComment(`v-comp-${componentName}-start`);
        this.anchorEnd = document.createComment(`v-comp-${componentName}-end`);
        // 替换掉无用的原标签
        replace(this.el, this.anchorStart);
        insertAfter(this.anchorEnd, this.anchorStart);
        const child = this.build(); // 把组件利用 new Vue.extend()出来构造函数 渲染并挂载
        console.log('child', child);
        insertBefore(child.$el, this.anchorEnd);
    },
    build () {
        // 这里需要把组件注册成MVue.extend
        this.Component = getComponent(this.vm.$options.components, this.expression); //组件其实是Vue的一个子类?
        const options = {
            name: this.expression,
            el: this.el.cloneNode(true),
            // 父实例
            _context: this.vm,
            parent: this.vm,
        };
        // MVue.extend的用法
        return new this.Component(options);
    }
}