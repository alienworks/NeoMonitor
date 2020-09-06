<template>
  <div class="toolbar">
    <a-row>
      <a-col :span="24" class="menu-row">
        <a-col class="summary-block" :span="16">
          <p>Latest block</p>
          <h6>{{ height }}</h6>
        </a-col>
        <a-col class="summary-block" :span="8">
          <div id="container">
            <div id="glass-container" ref="hourglass">
              <div id="glass">
                <div class="top half-glass triangle"></div>
                <div class="bottom half-glass triangle rotate"></div>
              </div>
              <div id="layer-1">
                <div>
                  <div class="top layer-1 triangle"></div>
                </div>
                <div class="rotate">
                  <div class="bottom layer-1 triangle"></div>
                </div>
              </div>
              <div id="layer-2">
                <div>
                  <div class="top layer-2 triangle"></div>
                </div>
                <div class="rotate">
                  <div class="bottom layer-2 triangle"></div>
                </div>
              </div>
              <div id="sand-stream"></div>
              <div id="bond">
                <div class="top bond triangle"></div>
                <div class="bottom bond triangle"></div>
                <div class="seconds">{{ seconds }}s</div>
              </div>
            </div>
          </div>
        </a-col>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Toolbar',
  data() {
    return {
      current: ['home'],
      timer: null,
      seconds: 0,
      toolbarHeight: 0,
      needRotate: false,
    }
  },

  computed: {
    ...mapGetters({
      flag: 'flag',
      maxHeight: 'maxHeight',
    }),
    height() {
      const flag = this.flag
      return this.maxHeight[flag]
    },
  },
  methods: {},
  mounted() {
    let self = this
    self.timer = setInterval(() => {
      if (self.height > self.toolbarHeight) {
        self.seconds = 0
        self.toolbarHeight = self.height
        // self.$refs.hourglass.style = " -webkit-animation: spin 3s ease-in infinite normal running;  animation: spin 3s ease-in  infinite normal running";
        // setTimeout(() => {
        //   self.$refs.hourglass.style = " -webkit-animation: spin 3s ease-in infinite normal paused;  animation: spin 3s ease-in  infinite normal paused";
        // }, 1500);
      }
      self.seconds++
    }, 1000)
  },
  destroyed() {
    let self = this
    if (self.timer) {
      clearInterval(self.timer)
    }
  },
  deactivated() {
    let self = this
    if (self.timer) {
      clearInterval(self.timer)
    }
  },
}
</script>

<style lang="scss">
@-webkit-keyframes flow {
  0% {
    -webkit-transform: scale(1);
    transform: scale(1);
  }
  90% {
    -webkit-transform: scale(0);
    transform: scale(0);
  }
  100% {
    -webkit-transform: scale(0);
    transform: scale(0);
  }
}
@keyframes flow {
  0% {
    -webkit-transform: scale(1);
    transform: scale(1);
  }
  90% {
    -webkit-transform: scale(0);
    transform: scale(0);
  }
  100% {
    -webkit-transform: scale(0);
    transform: scale(0);
  }
}
@-webkit-keyframes spin {
  0% {
    -webkit-transform: rotate(0);
    transform: rotate(0);
  }
  90% {
    -webkit-transform: rotate(0);
    transform: rotate(0);
  }
  100% {
    -webkit-transform: rotate(180deg);
    transform: rotate(180deg);
  }
}
@keyframes spin {
  0% {
    -webkit-transform: rotate(0);
    transform: rotate(0);
  }
  90% {
    -webkit-transform: rotate(0);
    transform: rotate(0);
  }
  100% {
    -webkit-transform: rotate(180deg);
    transform: rotate(180deg);
  }
}

::selection {
  color: rgba(255, 255, 255, 0.85);
  background: rgba(0, 0, 0, 0.075);
}

#container {
  position: absolute;
  left: 50%;
  top: 50%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}

#glass-container {
  position: relative;
  -webkit-animation: spin 3s ease-in infinite normal running;
  animation: spin 3s ease-in infinite normal running;
}
#glass-container,
#glass,
#layer-1,
#layer-2 {
  width: 38px;
  height: 42px;
}
.triangle {
  border-color: transparent;
  border-style: solid;
  border-width: 28px 19px 0 19px;
  width: 0;
  height: 0;
}
.rotate {
  -webkit-transform: rotateX(180deg);
  transform: rotateX(180deg);
}
.half-glass {
  border-top-color: #bfdde8;
  border-radius: 5px;
}
.bottom.half-glass {
  margin-top: -14px;
}
#layer-1,
#layer-2 {
  position: absolute;
  left: 0;
  top: 0;
  -webkit-transform: scale(0.75);
  -webkit-transform-origin: center top;
  transform: scale(0.75);
  transform-origin: center top;
}
#layer-1 {
  z-index: 5;
}
#layer-2 {
  z-index: 10;
}
#layer-1 .top.triangle,
#layer-2 .top.triangle {
  position: absolute;
  bottom: 10px;
  border-radius: 5px;
}
#layer-1 .bottom.triangle,
#layer-2 .bottom.triangle {
  position: absolute;
  bottom: 22px;
  border-radius: 5px;
}
#layer-1 .top,
#layer-2 .bottom {
  border-top-color: #ffffff;
  border-radius: 5px;
}
#layer-1 .bottom,
#layer-2 .top {
  border-top-color: #b99d55;
  border-radius: 5px;
}
#layer-2 .triangle {
  -webkit-transform-origin: center bottom;
  -webkit-animation: flow 3s ease-in infinite;
  transform-origin: center bottom;
  animation: flow 3s ease-in infinite;
}
#sand-stream {
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: -1.2px;
  z-index: 20;
  width: 2.4px;
  height: 16px;
  background: #b99d55;
}
#bond {
  position: absolute;
  z-index: 100;
  left: 16px;
  top: 18px;
  margin-left: -10px;
  margin-top: -4px;
  width: 0;
  height: 0;
}
#bond .triangle {
  border-top-color: #0077a7;
  width: 28px;
  border-width: 12px 7px 0 7px;
}
#bond .bottom {
  border-bottom-color: #0077a7;
  margin-top: -4px;
  border-width: 0 4px 7px 4px;
}
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
.seconds {
  font-size: 10px;
  position: relative;
  color: #fff;
  top: -16px;
  left: 4px;
  font-weight: bold;
  margin-left: auto;
  margin-right: auto;
  width: 20px;
}
.toolbar {
  position: relative;
  z-index: 10;
  width: 12rem;
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
    justify-content: flex-end;
    margin: 0;

    > * {
      flex: none;
      margin: 0 16px 0 0;

      &:last-child {
        margin-right: 40px;
      }
    }
  }
}
</style>
