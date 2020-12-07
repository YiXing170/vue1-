import { hasOwn, def } from '../utils';
import Dep from './dep';
import { isArray } from 'util';
import arrayMethods from './collect/array';

export default function observe (value) {
    if (!value || typeof value !== 'object') return;
    let ob;
    if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
        ob = value.__ob__;
    } else if (!value._isMVue) {
        ob = new Observer(value);
    }
    return ob;
}

/*
这里先要分析清楚dep watcher  observer之间的关系
observer用来 做关键的桥梁，利用属性描述符 get set  来连接dep 和 watch

具体情况：利用observer对每一个属性做观测时，生成dep实例，编译template时，利用get时

*/

class Observer {
    constructor(value) {
        this.dep = new Dep();
        this.value = value;
        def(this.value, '__ob__', this);

        if (isArray(value)) {
            // 修改数组原型、拦截数组操作
            value.__proto__ = arrayMethods;
            this.observeArray(value);
        } else {
            this.walk(value);
        }
    }
    // observe object
    walk (obj) {
        Object.keys(obj).forEach(key => {
            defineReactive(obj, key, obj[key]);
        });
    }
    // observe array
    observeArray (arr) {
        arr.forEach(value => {
            observe(value);
        })
    }
}

export function defineReactive (obj, key, val) {
    const dep = new Dep();
    let childOb = observe(val);
    Object.defineProperty(obj, key, {
        configurable: true,
        enumerable: true,
        get () {
            if (Dep.target) {
                dep.depend();
                if (childOb) {
                    childOb.dep.depend();
                }
                if (isArray(val)) {
                    val.forEach(v => {
                        v && v.__ob__ && v.__ob__.dep.depend();
                    });
                }
            }
            return val;
        },
        set (newVal) {
            if (val === newVal) return;
            val = newVal;
            childOb = observe(newVal);
            dep.notify();
        }
    });
}