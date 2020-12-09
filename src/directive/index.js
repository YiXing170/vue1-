import { getIn, extend, bind } from "../utils";
import Watcher from "../observer/watcher";


/*
文本的descriptor: {
      vm,
      el,  // 真实dom引用
      name: "text",
      def: directives.text,
      attr: name,
      arg: name.replace(RE.bind, ""),
      expression: value, //数据的表达式
    };
v-on的描述符：
    {
      vm,
      el,
      name: "on",
      expression: value,
      def: directives.on,
      attr: name,
      arg: name.replace(RE.on, "")
    }


// v-text处理 即directives.text
    text: {
        bind() {
            this.attr = 
                this.el.nodeType === 3 ? 'data' : 'textContent';   //为什么是这个顺序呢？
        },
        update(value) {
            this.el[this.attr] = domValue(value);
        }
    },    
*/
export default class Directive {
  constructor(descriptor, vm) {
    this.vm = vm;
    this.descriptor = descriptor;
    Object.assign(
      this,
      getIn(descriptor, ["name", "expression", "el", "filters", "modifiers"])
    );
  }

  _bind () {
    const { descriptor } = this;
    const { def } = descriptor; // {bind,update}
    if (typeof def === "function") {
      this.update = def;
    } else {
      extend(this, def);
    }

    // 具体指令继承来的bind方法
    if (this.bind) {
      this.bind();
    }

    if (this.expression) {
      const dir = this;
      if (this.update) {
        // 暴露出去的update方法 new Watcher的callback参数
        this._update = function (value, oldVal) {
          dir.update(value, oldVal);
        };
      }
      const watcher = (this._watcher = new Watcher(
        this.vm,
        this.expression,
        this._update,  // 暴露给dep
        {
          filters: this.filters
        }
      ));

      // 第一次更新渲染  其实就是触发exp上state的getter
      if (this.update) {
        this.update(watcher.value);
      }
    }
  }

  // 废弃
  _teardown (i) {
    if (this.unbind) {
      this.unbind()
    }
    if (this._watcher) {
      this._watcher.teardown()
    }
    this.vm = this.el = this._watcher = null
  }

  set (value) {
    this._watcher.set(value);
  }
}
