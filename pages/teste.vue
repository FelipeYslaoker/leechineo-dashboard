<template>
  <div>
    <div id="editor" contenteditable="">aa</div>
    <div id="eventkey"></div>
  </div>
</template>

<script>
export default {
  mounted() {
    const divInput = document.querySelector("#editor");
    divInput.addEventListener("keydown", (e) => {
      document.querySelector('#eventkey').textContent = e.code
      if(e.code === space) {
        e.preventDefault()
        
      }
    });
  },
  data() {
    return {
      content: "",
    };
  },
  methods: {
    enter() {},
  },
  computed: {
    lines() {
      return this.content.split(/\n/g).length;
    },
    texts() {
      return this.content.split(/\n/g);
    },
  },
};
</script>

<style>
#editor {
  background-color: #041c32;
  border-radius: 8px;
  justify-content: space-between;
}
.lineNumber {
  padding: 8px;
  font-size: 10px;
  border-bottom: 1px solid #064663;
  margin: 10px 4px;
  color: #ecb46583;
}
.text {
  font-size: 10px;
  padding: 10px;
  margin: 10px 4px;
  color: #ecb365;
}
</style>