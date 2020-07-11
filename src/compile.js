import Watcher from "./watcher";

class Compile {
  // el:待编译模板，vm:vue实例
  constructor(el, vm) {
    this.$vm = vm;
    this.$el = document.querySelector(el);
    this.$fragment = this.node2Fragment(this.$el);
    this.compile(this.$fragment);
    this.$el.appendChild(this.$fragment);
  }
  node2Fragment(el) {
    const fragment = document.createDocumentFragment();
    let child;
    while ((child = el.firstChild)) {
      fragment.appendChild(child);
    }
    return fragment;
  }
  compile(el) {
    const childNodes = el.childNodes;
    Array.from(childNodes).forEach((node) => {
      if (node.nodeType == 1) {
        this.compileElement(node);
      } else if (this.isInter(node)) {
        this.compileText(node);
      } else {
      }
      if (node.children && node.childNodes.length) {
        this.compile(node);
      }
    });
  }
  isInter(node) {
    return node.nodeType == 3 && /\{\{(.*)\}\}/.test(node.textContent);
  }
  compileText(node) {
    const exp = RegExp.$1;
    this.update(node, exp, "text");
  }
  update(node, exp, dir) {
    const updator = this[dir + "Update"];
    updator && updator(node, this.$vm[exp]);
    new Watcher(this.$vm, exp, (value) => {
      updator && updator(node, value);
    });
  }
  textUpdate(node, value) {
    node.textContent = value;
  }
  valueUpdate(node, value) {
    node.value = value;
  }
  compileElement(node) {
    const nodeAttr = node.attributes;
    Array.from(nodeAttr).forEach((attr) => {
      const attrName = attr.name;
      const exp = attr.value;
      if (attrName.indexOf("v-") == 0) {
        const dir = attrName.substring(2);
        this[dir] && this[dir](node, exp);
      }
      if (attrName.indexOf("@") == 0) {
        const event = attrName.substring(1);
        node.addEventListener(event, () => {
          this.$vm[exp] && this.$vm[exp]();
        });
      }
    });
  }
  text(node, exp) {
    this.update(node, exp, "text");
  }
  model(node, exp) {
    this.update(node, exp, "value");
    node.addEventListener("input", (e) => {
      this.$vm[exp] = e.target.value;
    });
  }
}

export default Compile;
