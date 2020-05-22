<template>
  <header id="header">
    <!-- <b-navbar toggleable="lg" type="dark" variant="primary">
        <router-link to="/">
          <b-navbar-brand href="/" class="mx-5 px-5">NEO Nodes</b-navbar-brand>
        </router-link>
        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav class="mx-5">
            <router-link to="/">
              <b-nav-item href="/" class="px-2">Main</b-nav-item>
            </router-link>
            <router-link to="/nodes">
              <b-nav-item href="/nodes" class="px-2">Nodes</b-nav-item>
            </router-link>
            <router-link to="/matrix">
              <b-nav-item href="/matrix" class="px-2">Matrix</b-nav-item>
            </router-link>
    </b-navbar-nav>-->

    <!-- Right aligned nav items -->
    <!-- <b-navbar-nav class="ml-auto" v-if="showMenu">
            <b-nav-item-dropdown :text="netFlag" right>
              <b-dropdown-item @click="onSetFlagNet('MainNet')">MainNet</b-dropdown-item>
              <b-dropdown-item @click="onSetFlagNet('TestNet')">TestNet</b-dropdown-item>
            </b-nav-item-dropdown>
          </b-navbar-nav>
        </b-collapse>
    </b-navbar>-->
    <div class="logo">
      <router-link to="/" @click.stop="onLogoClick">NEO Nodes</router-link>
    </div>

    <a-menu mode="horizontal" v-model="current">
      <a-menu-item key="home">
        <router-link to="/">Main</router-link>
      </a-menu-item>

      <a-menu-item key="nodes">
        <router-link to="/nodes">Nodes</router-link>
      </a-menu-item>

      <a-menu-item key="matrix">
        <router-link to="/matrix">Matrix</router-link>
      </a-menu-item>
    </a-menu>
  </header>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      current: ["home"]
    };
  },
  computed: {
    ...mapGetters({
      netFlag: "getNetFlag"
    }),
    showMenu() {
      console.log(this);
      return true;
    }
  },
  methods: {
    onSetFlagNet(flag) {
      this.$store.commit("setNetFlag", flag);
    },
    onLogoClick() {
      this.current = ["home"]
    }
  }
};
</script>

<style lang="scss">
#header {
  .logo {
    width: 120px;
    height: 48px;
    display: flex;
    justify-content: center;
    align-items: center;
    float: left;
  }
  
  & .ant-menu-item-selected,
  & .ant-menu-item:hover,
  & .ant-menu-submenu:hover {
    border-top: 2px solid #1890ff;
    border-bottom: 2px solid transparent;
  }
}
</style>