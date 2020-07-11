// 保存data中的数值和页面中的挂钩关系
import Dep from "./Dep";
class Watcher {
  constructor(vm, key, cb) {
    this.vm = vm;
    this.key = key;
    this.cb = cb;
    // 触发依赖升级
    Dep.target = this;
    this.vm[this.key];

    Dep.target = null;
  }
  update() {
    this.cb(this.vm[this.key]);
  }
}

export default Watcher;
