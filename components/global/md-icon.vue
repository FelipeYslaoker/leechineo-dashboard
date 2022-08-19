<template>
  <span
    :class="`material-icons-outlined md-${size || 30} pa-1 ${
      !$store.state.darkmode ? 'md-dark' : 'md-light'
    } ${disabled ? 'md-inactive' : ''} ${color || ''}`"
  >
    <slot />
  </span>
</template>

<script>
export default {
  props: ["color", "size", "dark", "disabled"],
};
</script>

<style>

/* Rules for sizing the icon. */
.material-icons-outlined.md-16 {
  font-size: 16px;
}
.material-icons-outlined.md-18 {
  font-size: 18px;
}
.material-icons-outlined.md-24 {
  font-size: 24px;
}
.material-icons-outlined.md-30 {
  font-size: 30px;
}
.material-icons-outlined.md-36 {
  font-size: 36px;
}
.material-icons-outlined.md-48 {
  font-size: 48px;
}
.material-icons-outlined.md-60 {
  font-size: 60px;
}

/* Rules for using icons as black on a light background. */
.material-icons-outlined.md-dark {
  color: rgba(0, 0, 0, 0.54);
}
.material-icons-outlined.md-dark.md-inactive {
  color: rgba(0, 0, 0, 0.26);
}

/* Rules for using icons as white on a dark background. */
.material-icons-outlined.md-light {
  color: rgba(255, 255, 255, 0.5);
}
.material-icons-outlined.md-light.md-inactive {
  color: rgba(255, 255, 255, 0.3);
}
.material-icons-outlined.md-dark {
  color: rgba(0, 0, 0, 0.54);
}
.material-icons-outlined.md-dark.md-inactive {
  color: rgba(0, 0, 0, 0.26);
}

.material-icons-outlined.md-light {
  color: rgba(255, 255, 255, 1);
}
.material-icons-outlined.md-light.md-inactive {
  color: rgba(255, 255, 255, 0.3);
}

.material-icons-outlined.md-primary {
  color: #1e88e5;
}
.material-icons-outlined.md-error {
  color: #F44336;
}
.material-icons-outlined.md-green {
  color: #4CAF50;
}
</style>
