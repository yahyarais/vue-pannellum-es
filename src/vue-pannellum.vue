<!--Panorama viewer pannellum wrap.-->
<template>
  <div
    class="vue-pannellum"
    @mouseup="onMouseUp"
    @touchmove="onTouchMove"
    @touchend="onTouchEnd"
  >
    <div class="info">{{ info }}</div>
    <div class="default-slot">
      <slot/>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, computed, nextTick, onMounted, onBeforeUnmount, watch } from 'vue'
import 'pannellum'
import 'pannellum/build/pannellum.css'

import { debounce as _debounce } from 'lodash-es'

export default defineComponent({
  name: 'VuePannellum',
  props: {
    debug: { type: Boolean, default: false },
    src: { type: [String, Object], required: true },
    preview: { type: String, default: '' },
    autoLoad: { type: Boolean, default: true },
    autoRotate: { type: [Number, Boolean], default: 0 },
    orientation: { type: Boolean, default: false },
    draggable: { type: Boolean, default: true },
    mouseZoom: { type: Boolean, default: true },
    doubleClickZoom: { type: Boolean, default: true },
    showInfo: { type: Boolean, default: false },
    showZoom: { type: Boolean, default: false },
    showFullscreen: { type: Boolean, default: false },
    compass: { type: Boolean, default: false },
    hotSpots: { type: Array, default: () => [] },
    hfov: { type: Number, default: 75 },
    minHfov: { type: Number, default: 30 },
    maxHfov: { type: Number, default: 120 },
    yaw: { type: Number, default: 0 },
    pitch: { type: Number, default: 0 },
    crossOrigin: {type: String, default: 'anonymous' },
  },
  emits: ['load', 'error', 'update:hfov', 'update:yaw', 'update:pitch'],
  setup(props, { emit, expose }) {
    const viewer = ref(null)
    const info = ref('')
    const rafId = ref(-1)
    const el = ref(null)

    const srcOption = computed(() => {
      if (typeof props.src === 'string') {
        return {
          type: 'equirectangular',
          panorama: props.src,
          hotSpots: props.hotSpots,
        }
      } else if (typeof props.src === 'object') {
        if (props.src.px && props.src.ny) {
          return {
            type: 'cubemap',
            cubeMap: [
              props.src.pz,
              props.src.px,
              props.src.nz,
              props.src.nx,
              props.src.py,
              props.src.ny,
            ],
            hotSpots: props.hotSpots,
          }
        } else if (props.src.scenes) {
          return {
            default: props.src.default,
            scenes: props.src.scenes,
          }
        } else {
          console.error('[vue-pannellum] Unknown src type')
        }
      } else {
        console.error('[vue-pannellum] Unknown src type: ' + typeof props.src)
      }
    })

    const load = () => {
      if (!el.value) return

      let options = {
        autoLoad: props.autoLoad,
        autoRotate: props.autoRotate === true ? -2 : 0,
        orientationOnByDefault: props.orientation,
        draggable: props.draggable,
        mouseZoom: props.mouseZoom,
        doubleClickZoom: props.doubleClickZoom,
        compass: props.compass,
        preview: props.preview,
        hfov: props.hfov,
        yaw: props.yaw,
        pitch: props.pitch,
        minHfov: props.minHfov,
        maxHfov: props.maxHfov,
        crossOrigin: props.crossOrigin,
        ...srcOption.value,
      }
      
      viewer.value = window.pannellum.viewer(el.value, options)
      viewer.value.on('load', () => {
        emit('load')
      })
      viewer.value.on('error', (err) => {
        emit('error', err)
      })
      
      if (props.showInfo === false && el.value) {
        let infoEl = el.value.querySelector('.pnlm-panorama-info')
        // Note: Using display will not work when in tour mode and switch scene
        if (infoEl) infoEl.style.visibility = 'hidden'
      }
      if (props.showZoom === false && el.value) {
        let zoomEl = el.value.querySelector('.pnlm-zoom-controls')
        if (zoomEl) zoomEl.style.display = 'none'
      }
      if (props.showFullscreen === false && el.value) {
        let fullscreenEl = el.value.querySelector('.pnlm-fullscreen-toggle-button')
        if (fullscreenEl) fullscreenEl.style.display = 'none'
      }
    }

    const loop = () => {
      rafId.value = window.requestAnimationFrame(loop)
      if (!viewer.value) return
      let hfov = viewer.value.getHfov()
      let yaw = viewer.value.getYaw()
      let pitch = viewer.value.getPitch()
      if (pitch > 90) pitch = 90
      else if (pitch < -90) pitch = -90
      if (hfov != props.hfov) emit('update:hfov', hfov)
      if (yaw != props.yaw) emit('update:yaw', yaw)
      if (pitch != props.pitch) emit('update:pitch', pitch)
    }

    const onMouseUp = () => {
      if (props.debug) info.value += ' mu'
      debounceRotate()
    }

    const onTouchMove = () => {
      if (props.debug) info.value += ' tm'
    }

    const onTouchEnd = () => {
      if (props.debug) info.value += ' te'
      debounceRotate()
    }

    const debounceRotate = _debounce(function () {
      if (!viewer.value) return
      // priority of orientation is higher
      if (props.orientation) viewer.value.startOrientation()
      else if (props.autoRotate) viewer.value.startAutoRotate()
    }, 3000)

    watch(() => props.src, () => {
      if (el.value) {
        el.value.innerHTML = ''
        nextTick(load)
      }
    })

    watch(() => props.hfov, (val) => {
      if (viewer.value) viewer.value.setHfov(val, false)
    })

    watch(() => props.yaw, (val) => {
      if (viewer.value) viewer.value.setYaw(val, false)
    })

    watch(() => props.pitch, (val) => {
      if (viewer.value) viewer.value.setPitch(val, false)
    })

    watch([() => props.minHfov, () => props.maxHfov], () => {
      if (viewer.value) {
        viewer.value.setHfovBounds([props.minHfov, props.maxHfov])
      }
    })

    watch(() => props.autoRotate, (val) => {
      if (!viewer.value) return
      if (val) {
        viewer.value.startAutoRotate()
      } else {
        viewer.value.stopAutoRotate()
        if (props.orientation) viewer.value.startOrientation()
      }
    })

    watch(() => props.orientation, (val) => {
      if (!viewer.value) return
      if (val) {
        viewer.value.startOrientation()
      } else {
        viewer.value.stopOrientation()
        if (props.autoRotate) viewer.value.startAutoRotate()
      }
    })

    onMounted(() => {
      el.value = document.querySelector('.vue-pannellum')
      load()
      rafId.value = window.requestAnimationFrame(loop)
    })

    onBeforeUnmount(() => {
      if (viewer.value) viewer.value.destroy()
      window.cancelAnimationFrame(rafId.value)
    })

    // Expose methods for parent components
    expose({
      load,
      getViewer: () => viewer.value
    })

    return {
      info,
      onMouseUp,
      onTouchMove,
      onTouchEnd
    }
  }
})
</script>

<style>
.pnlm-ui .pnlm-about-msg {
  display: none !important;
}

.pnlm-ui .pnlm-orientation-button {
  display: none !important;
}
</style>

<style scoped>
.vue-pannellum {
  position: relative;
}

.info {
  position: absolute;
  background-color: hsla(0, 0%, 100%, 0.5);
  top: 0;
  left: 0;
  width: 100%;
  z-index: 2;
}

.default-slot {
  position: absolute;
  left: 0;
  bottom: 0;
  z-index: 2;
}
</style>
