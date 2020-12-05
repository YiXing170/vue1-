import { mergeOptions } from "../utils";

export default function mixin (mx) {
    // debugger
    this.options = mergeOptions(this.options, mx);  //this.options 为全局MVue自带属性options
}