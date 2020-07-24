<template>
  <div class="footer">
    <a-row>
      <a-col :span="7">
        <div class="logo">
          <router-link to="/" @click.stop="onLogoClick"><img width="155px" height="21px" src="../assets/icons/logo1.png" />
          </router-link>
        </div>
      </a-col>
      <a-col :span="10">
        <div class="copyright">©️Copyright Alienworks 2017-2020</div>
      </a-col>
      <a-col :span="7" class="clearfix">
        <div class="icons website">
          <img width="24px" height="24px" src="../assets/icons/icon1.png" />
        </div>
        <div class="icons twitter">
          <img width="24px" height="24px" src="../assets/icons/icon2.png" />
        </div>
        <div class="icons github">
          <a href="http://github.com/alienworks"><img width="24px" height="24px" src="../assets/icons/icon3.png" /></a>
        </div>
        <div class="icons slack">
          <img width="24px" height="24px" src="../assets/icons/icon4.png" />
        </div>
        <div class="icons reddit">
          <img width="24px" height="24px" src="../assets/icons/icon5.png" />
        </div>
        <div class="icons discord">
          <img width="24px" height="24px" src="../assets/icons/icon6.png" />
        </div>
        <div class="icons wechat">
          <img width="24px" height="24px" src="../assets/icons/icon7.png" />
        </div>
        <div class="icons weibo">
          <img width="24px" height="24px" src="../assets/icons/icon8.png" />
        </div>
        <div class="icons youtube">
          <img width="24px" height="24px" src="../assets/icons/icon9.png" />
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