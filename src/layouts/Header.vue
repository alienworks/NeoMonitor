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
    <a-row>
      <a-col :span="10">
        <div class="logo">
          <router-link to="/" @click.stop="onLogoClick"><img width="164px" height="48px" src="../assets/icons/logo.png"
              style="margin-left:7rem" /></router-link>
        </div>
      </a-col>

      <a-col :span="14" class="menu-row">
        <a-menu mode="horizontal" v-model="current">
          <a-menu-item key="home">
            <router-link to="/">Main</router-link>
          </a-menu-item>

          <a-menu-item key="nodes">
            <router-link to="/nodes">Nodes</router-link>
          </a-menu-item>

          <a-menu-item key="matrix">
            <router-link to="/matrix">API Matrix</router-link>
          </a-menu-item>
        </a-menu>
        <toolbar></toolbar>
        <a-select :default-value="flag" style="width: 120px" @change="onSetFlagNet">
          <a-select-option value="MainNet">MainNet</a-select-option>
          <a-select-option value="TestNet">TestNet</a-select-option>
        </a-select>
      </a-col>
    </a-row>
  </header>
</template>

<script>
import { mapGetters } from "vuex";
import Toolbar from "./Toolbar"
export default {
  name: "NHeader",
  data() {
    return {
      current: ["home"],
      seconds: 0,

    };
  },
  components: {
    [Toolbar.name]: Toolbar
  },
  computed: {
    ...mapGetters(['flag'])
  },
  watch: {
    // eslint-disable-next-line no-unused-vars
    $route(to, from) {
      switch (to.name) {
        case 'Main':
          this.current = ['home']
          break;
        case 'Nodes':
          this.current = ['nodes']
          break;
        case 'MemPool':
          this.current = ['nodes']
          break;
        case 'NodeInfo':
          this.current = ['nodes']
          break;
        case 'Statistics':
          this.current = ['nodes']
          break;
        case 'Matrix':
          this.current = ['matrix']
          break;
        default:
          this.current = ['home']
          break;
      }
    }
  },
  methods: {
    onSetFlagNet(flag) {
      this.$store.commit("setFlag", flag);
    },
    onLogoClick() {
      this.current = ["home"];
    }
  },

};
</script>

<style lang="scss">
.summary-block {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  h6,
  p {
    margin: 0;
  }
}
#header {
  position: relative;
  z-index: 10;
  max-width: 100%;
  box-shadow: 0 2px 8px rgba(240, 241, 242, 65);

  .logo {
    width: 120px;
    height: 48px;
    display: flex;
    justify-content: center;
    align-items: center;
    float: left;
  }

  .menu-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 0;

    > * {
      flex: none;
      margin: 0 16px 0 0;

      &:last-child {
        margin-right: 40px;
      }
    }
  }

  .ant-menu-horizontal {
    border-bottom: none;

    & .ant-menu-item-selected,
    & .ant-menu-item:hover,
    & .ant-menu-submenu:hover {
      // border: 2px solid #1890ff;
      // border-top: 2px solid transparent;
    }
  }
}
</style>
