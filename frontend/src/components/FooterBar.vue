<template>
  <div class="footer-bar">
    <div class="footer-show">
      <div class="footer-text">Bumpty OJ</div>
      <a href="https://github.com/Nerlci/bumptyoj" class="footer-link">
        <font-awesome-icon :icon="['fab', 'github']" />
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: "SidBar",
};
</script>

<style scoped>
.footer-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  text-align: center;
  margin-bottom: 10px;
}

.footer-show {
  text-align: center;
}

.footer-text {
  margin-bottom: 10px;
  font-size: 14px;
  color: #888888;
}

.footer-link {
  color: #999999;
  font-size: 20px;
  margin-bottom: 10px;
  text-decoration: none;
}
</style>
