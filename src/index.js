import Vue from "./Vue";

const app = new Vue({
  el: "#app",
  data: {
    age: 12,
    name: "你好",
    text: "text21212"
  },
  created() {
    console.log(this);
    setTimeout(() => {
      this.name = "我好";
    }, 1500);
  }
});
