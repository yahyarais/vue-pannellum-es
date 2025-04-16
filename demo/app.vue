<template>
  <div class="app">
    <v-pannellum
      v-if="show"
      class="pannellum"
      :src="url"
      :preview="cubemapUrls.px"
      :auto-rotate="isAutoRotationOn"
      :orientation="isOrientationOn"
      :auto-load="true"
      :show-zoom="false"
      :double-click-zoom="false"
      :show-fullscreen="false"
      :compass="true"
      :hotSpots="hotSpots"
      v-model:hfov="hfov"
      v-model:yaw="yaw"
      v-model:pitch="pitch"
      @load="onPanoramaLoad"
    >
      Slot content
    </v-pannellum>
    <div class="controls">
      <label>
        <span>Type:</span>
        <button @click="url = equirectangularUrl">equirect</button>
        <button @click="url = cubemapUrls">cubemaps</button>
        <button @click="url = srcTour">scenes</button>
      </label>
      <label>
        <span>Hfov:</span>
        <input type="text" v-model.number="hfov" style="width: 50px;" />
      </label>
      <label>
        <span>Yaw:</span>
        <input type="text" v-model.number="yaw" style="width: 50px;" />
      </label>
      <label>
        <span>Pitch:</span>
        <input type="text" v-model.number="pitch" style="width: 50px;" />
      </label>
      <label>
        <input type="checkbox" v-model="show" />
        <span>Show</span>
      </label>
      <label>
        <input type="checkbox" v-model="isAutoRotationOn" />
        <span>Auto Rotation</span>
      </label>
      <label>
        <input type="checkbox" v-model="isOrientationOn" />
        <span>Orientation</span>
      </label>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'
import equirectangularUrl from './equirectangular/wooden-lounge.png'
import equirectangularUrlCube from './equirectangular/cube.jpg'
import equirectangularUrlGrid from './equirectangular/grid.jpg'

import px from './cubemaps/px.jpg'
import nx from './cubemaps/nx.jpg'
import py from './cubemaps/py.jpg'
import ny from './cubemaps/ny.jpg'
import pz from './cubemaps/pz.jpg'
import nz from './cubemaps/nz.jpg'

export default defineComponent({
  setup() {
    const show = ref(true)
    const hfov = ref(90)
    const yaw = ref(-90)
    const pitch = ref(0)
    const url = ref(equirectangularUrl)
    const cubemapUrls = { pz, px, nz, nx, py, ny }
    const isAutoRotationOn = ref(false)
    const isOrientationOn = ref(false)
    
    const hotSpots = [
      {
        pitch: 14.1,
        yaw: 1.5,
        type: 'info',
        text: 'Click me to Google',
        URL: 'https://google.com/',
      },
      {
        pitch: 0,
        yaw: -90,
        type: 'info',
        text: 'I am <b>bold</b> text.',
      },
      {
        pitch: -0.9,
        yaw: 144.4,
        type: 'info',
        text: 'Info 2',
      },
    ]
    
    const srcTour = {
      default: {
        firstScene: 'cube',
        author: 'Foo Bar',
        sceneFadeDuration: 1000,
      },
      scenes: {
        cube: {
          title: 'Cube',
          hfov: 110,
          pitch: -3,
          yaw: 117,
          type: 'equirectangular',
          panorama: equirectangularUrlCube,
          hotSpots: [
            {
              pitch: -2.1,
              yaw: -105,
              type: 'scene',
              text: 'Grid',
              sceneId: 'grid',
            },
          ],
        },
        grid: {
          title: 'Grid',
          hfov: 110,
          yaw: 5,
          type: 'equirectangular',
          panorama: equirectangularUrlGrid,
          hotSpots: [
            {
              pitch: -0.6,
              yaw: -77.1,
              type: 'scene',
              text: 'Cube',
              sceneId: 'cube',
              targetYaw: -23,
              targetPitch: 2,
            },
          ],
        },
      },
    }
    
    const onPanoramaLoad = () => {
      console.log('Panorama loaded successfully!')
    }
    
    return {
      show,
      hfov,
      yaw,
      pitch,
      url,
      equirectangularUrl,
      cubemapUrls,
      isAutoRotationOn,
      isOrientationOn,
      hotSpots,
      srcTour,
      onPanoramaLoad
    }
  }
})
</script>

<style>
html,
body,
.app,
.pannellum {
  height: 100vh;
}

body {
  margin: 0;
}

.controls {
  position: fixed;
  left: 10px;
  bottom: 10px;
  padding: 5px;
  border: solid 1px silver;
  background-color: hsla(0, 0%, 100%, 0.3);
  z-index: 10;
}
</style>
