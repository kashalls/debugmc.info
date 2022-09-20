<template>
  <b-navbar :shadow="true" type="is-primary">
    <template #brand>
      <b-navbar-item tag="router-link" :to="{ path: '/' }" class="is-flex is-justify-content-center is-align-content-center">
        <h1 class="title is-5 minecraft m-auto">
          DebugMC
        </h1>
        <img
          src="~/static/icon.png"
          alt="Minecraft Debug Stick"
        >
      </b-navbar-item>
    </template>

    <template #end>
      <b-navbar-item tag="div" class="block">
        <b-button :icon-right="colorModeIcon" class="is-desktop-icon-only" active @click="changeColor" />
      </b-navbar-item>
    </template>
  </b-navbar>
</template>

<script>
export default {
  computed: {
    colorModeIcon () {
      const color = this.$nuxt.$colorMode.preference
      switch (color) {
        case 'dark':
          return 'weather-night'
        case 'light':
          return 'weather-sunny'
        default:
          return 'help'
      }
    }
  },
  methods: {
    changeColor () {
      this.$nuxt.$colorMode.preference = this.$nuxt.$colorMode.preference === 'dark' ? 'light' : 'dark'
    }
  }
}
</script>
