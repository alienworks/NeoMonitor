<template>
  <div class="footer">
    <a-row>
      <a-col :span="7">
        <div class="logo">
          <router-link to="/" @click.stop="onLogoClick"><img width="155px" height="21px" src="logo1.png" /></router-link>
        </div>
      </a-col>
      <a-col :span="10">
        <div class="copyright">©️Copyright Alienworks 2017-2020</div>
      </a-col>
      <a-col :span="7" class="clearfix">
        <div class="icons">
          <img width="24px" height="24px" src="icon1.png" />
        </div>
        <div class="icons">
          <img width="24px" height="24px" src="icon2.png" />
        </div>
        <div class="icons">
          <img width="24px" height="24px" src="icon3.png" />
        </div>
        <div class="icons">
          <img width="24px" height="24px" src="icon4.png" />
        </div>
        <div class="icons">
          <img width="24px" height="24px" src="icon5.png" />
        </div>
        <div class="icons">
          <img width="24px" height="24px" src="icon6.png" />
        </div>
        <div class="icons">
          <img width="24px" height="24px" src="icon7.png" />
        </div>
        <div class="icons">
          <img width="24px" height="24px" src="icon8.png" />
        </div>
        <div class="icons">
          <img width="24px" height="24px" src="icon9.png" />
        </div>

      </a-col>
    </a-row>
  </div>
</template>

<script>
export default {
  name: "NFooter",
  data() {
    return {
      current: ["home"],
    }
  },
  methods: {
    onLogoClick() {
      this.current = ["home"];
    }
  }
}
</script>

<style lang="scss" scoped>
.footer {
  background-color: #222;
  height: 48px;
  line-height: 48px;
  width: 100%;
}
.copyright {
  color: #fff;
  font-weight: bold;
}
.icons {
  float: left;
  margin-left: 3px;
  margin-right: 3px;
}
</style>