export default function use (plugin, ...args) {
    const MVue = this;
    args.unshift(MVue);
    // 插件已使用
    if (plugin.installed) return;

    if (typeof plugin.install === 'function') {
        plugin.install.apply(plugin, args);  //调用install函数，并在install函数中利用mixin机制，来对MVue实例注入相应功能。
    } else {
        plugin.apply(null, args);
    }
    plugin.installed = true;
    return this;
}