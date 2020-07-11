import Dep from "./Dep";

import Compile from "./compile";

class Vue {
  constructor(options) {
    //   保存配置选项
    this.$options = options;
    // 传入date
    this.$data = options.data;
    this.proxy(this.$data);

    this.$methods = options.methods;
    this.proxy(this.$methods);
    // 响应化处理
    this.observe(options.data);
    new Compile(options.el, this);
    options.created && options.created.call(this);
  }
  observe(data) {
    if (!data || typeof data !== "object") {
      return;
    }
    Object.keys(data).forEach((key) => {
      this.defineReactive(data, key, data[key]);
    });
  }
  defineReactive(obj, key, value) {
    //   递归
    this.observe(value);
    const dep = new Dep();
    Object.defineProperty(obj, key, {
      set(newValue) {
        if (newValue !== value) {
          value = newValue;
          dep.notify();
        }
      },
      get() {
        Dep.target && dep.addDep(Dep.target);
        return value;
      }
    });
  }
  proxy(target) {
    Object.keys(target).forEach((key) => {
      Object.defineProperty(this, key, {
        set(newValue) {
          target[key] = newValue;
        },
        get() {
          return target[key];
        }
      });
    });
  }
}

export default Vue;
