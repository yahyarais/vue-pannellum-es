# vue-pannellum

Vue wrap of the brilliant panorama viewer [Pannellum](https://pannellum.org/)

Now updated to support Vue 3 and ES modules!

## Usage

Install

```
npm install vue-pannellum
```

### Vue 3 (Recommended)

```js
import { createApp } from 'vue'
import VuePannellum from 'vue-pannellum'
import 'vue-pannellum/style.css' // Import styles

const app = createApp(App)
app.component('VPannellum', VuePannellum)
app.mount('#app')

// Or in a component
import VuePannellum from 'vue-pannellum'
import 'vue-pannellum/style.css'

export default {
  components: {
    VPannellum
  }
}
```

### Vue 2 (Legacy)

For Vue 2 support, use version 0.5.x:

```js
import Vue from 'vue'
import VuePannellum from 'vue-pannellum'

Vue.component('VPannellum', VuePannellum)
```

### Usage in templates

```html
<!-- Vue 3 - use v-model for two-way binding -->
<v-pannellum 
  :src="equirectangularUrl" 
  style="height: 500px;"
  v-model:hfov="hfov"
  v-model:yaw="yaw"
  v-model:pitch="pitch"
></v-pannellum>

<!-- Vue 2 - use .sync for two-way binding (legacy) -->
<v-pannellum 
  :src="equirectangularUrl" 
  style="height: 500px;"
  :hfov.sync="hfov"
  :yaw.sync="yaw"
  :pitch.sync="pitch"
></v-pannellum>
```

## Src types

### 1 Equirectangular

```js
src = equirectangularUrl
```

### 2 Cubemap

```js
src = {
  px: cubemapUrlPx,
  nx: cubemapUrlNx,
  py: cubemapUrlPy,
  ny: cubemapUrlNy,
  pz: cubemapUrlPz,
  nz: cubemapUrlNz,
}
```

### 3 Tour ([more details](https://pannellum.org/documentation/examples/tour/))

```js
src = {
  default: {
    firstScene: 'cube',
  },
  scenes: {
    cube: {
      hfov: 110,
      pitch: -3,
      yaw: 117,
      type: 'equirectangular',
      panorama: equirectangularUrlCube,
      hotSpots: [...],
    },
    grid: {
      hfov: 110,
      yaw: 5,
      type: 'equirectangular',
      panorama: equirectangularUrlGrid,
      hotSpots: [...],
    },
  },
}
```

## API

### Component props

- **src (required)**: See above.
- **preview**: The preview image url before loaded.
- **autoLoad (boolean, default: true)**: Whether automatically load.
- **autoRotate (number|boolean, default: 0)**: The auto-rotate speed, 0 or false means disabled, true is -2.
- **orientation (boolean, default: false)**: Turn the orientation sensor on (if supported).
- **draggable (boolean, default: true)**: Allow rotating with mouse or touch dragging.
- **mouseZoom (boolean, default: true)**: Allow zooming with mouse.
- **doubleClickZoom (boolean, default: true)**: Allow zooming with double click.
- **showZoom (boolean, default: false)**: Show the zoom-in and zoom-out button.
- **showFullscreen (boolean, default: false)**: Show the fullscreen button.
- **compass (boolean, default: false)**: Show the compass indicator.
- **hotSpots (array, default: [])**: Show information on the panorama.
- **hfov (number, default: 75)**: The initial horizontal field of view in degrees.
- **yaw (number, default: 0)**: The initial yaw position in degrees.
- **pitch (number, default: 0)**: The initial pitch position in degrees.
- **minHfov (number, default: 30)**: The minimum limit of hfov in degrees.
- **maxHfov (number, default: 120)**: The maximum limit of hfov in degrees.
- **crossOrigin (string, default: anonymous)**: Specify the type of CORS request used. Can be set to `anonymous` or `use-credentials`

## Events

- `load`: When finish loading.
- `error`: When an error occurs, error message as parameter.
- `update:hfov`, `update:yaw`, `update:pitch`: Events emitted for v-model support.

## Features

- Vue 3 compatible
- ES modules support
- type
- autoLoad
- autoRotate
- compass
- show/hide control button
- preview
- initial view: hfov/yaw/pitch
- slot
- watch url changing
- max/minHfov
- orientation

## Development

```bash
# Start development server
npm run dev

# Build for production
npm run build
```

## Licence

MIT
