<template>
  <div>
    <div class="center-content">
      <div class="element">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
.center-content {
  display: flex;
  justify-content: center;
  align-items: center;
}
.element {
  position: absolute;
  text-align: center;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>