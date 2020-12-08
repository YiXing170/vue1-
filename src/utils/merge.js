import { hasOwn, isObject, toArray } from ".";

function defaultStrat (parentVal, childVal) {
    return childVal === undefined ? parentVal : childVal
}
const strats = {
    // 合并data函数
    data (parentVal, childVal, vm) {
        // debugger
        // 全局merge
        if (!vm) {
            if (!childVal) {
                return parentVal;
            }
            if (!parentVal) {
                return childVal;
            }

            return function mergeDataFn () {
                return mergeData(parentVal.call(this), childVal.call(this));
            }
        } else if (parentVal || childVal) {
            // 组件merge
            return function mergeDataFn () {
                const oldData = typeof parentVal === 'function'
                    ? parentVal.call(vm) : void 0;
                const data = childVal.call(vm);
                return mergeData(oldData, data);
            }
        }
    }
};

/**
 * 合并options的mixins/directives等
 * @param {*} parent   全局 options
 * @param {*} child    实例 options
 * @param {*} vm 
 */
export function mergeOptions (parent, child, vm) {
    // debugger
    // 对象组件化
    guardComponents(child, vm); //用Vue.component()  包装组件
    // debugger
    const options = {};
    let key;
    for (key in parent) {
        mergeField(key);
    }

    for (key in child) {
        if (!hasOwn(parent, key)) {   // parent有同名属性，不合并到child，以child为准
            mergeField(key);
        }
    }

    function mergeField (key) {
        // for mixins/extends    [data.method]
        const strat = strats[key] || defaultStrat;
        options[key] = strat(parent[key], child[key], vm, key);  // 父合到子 
    }

    return options;
}
/**
 * 合并attrs
 * @param {*} fromNode el挂载节点
 * @param {*} toNode  option传入的template
 */
export function mergeAttrs (fromNode, toNode) {
    const attrs = fromNode.attributes;
    let name, value;
    toArray(attrs).forEach(attr => {
        name = attr.name;
        value = attr.value;
        if (name === 'class') {
            toNode.classList.add(value);
        } else {
            toNode.setAttribute(name, value);
        }
    });
}

/**
 * 合并data
 * @param {*} from  为parent {age:18 name}
 * @param {*} to    {age:24 }    
 */
function mergeData (from, to) {
    // debugger
    let key, toVal, fromVal;
    for (key in from) {
        toVal = to[key]; // 18
        fromVal = from[key]; //24
        if (!hasOwn(to, key)) {
            to[key] = fromVal;
        } else if (isObject(toVal) && isObject(fromVal)) {
            mergeData(fromVal, toVal);
        }
    }
    return to
}

/**
 * 处理组件components对象  用Vue.component()  包装组件
 * @param {*} options 
 */
function guardComponents (options, vm) {
    if (options.components) {
        const components = options.components;
        Object.keys(components).forEach(key => {
            components[key] = vm.constructor.component(key, components[key], true);
        });
    }
}