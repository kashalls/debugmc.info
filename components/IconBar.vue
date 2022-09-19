<template>
  <div class="block">
    <b-tooltip
      v-for="service in services"
      :key="service"
      :type="getType(service)"
      position="is-bottom"
    >
      <template #content>
        This domain is using <u>{{ $capitalizeFirstLetter(service) }}</u>.
      </template>
      <img v-if="service === 'tcpshield'" src="~/assets/img/TCPShieldIcon.svg" width="22px" class="mx-2">
      <FontAwesomeIcon
        v-else
        :class="service"
        :icon="getIcon(service)"
        :type="getType(service)"
      />
    </b-tooltip>
  </div>
</template>

<script>
const colorMap = {
  cloudflare: 'is-warning'
}

export default {
  props: {
    services: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  methods: {
    getIcon (service) {
      return `fa-brands fa-${service}`
    },
    getType (service) {
      return colorMap[service]
    }
  }
}
</script>

<style>
.cloudflare {
    color: #F48120;
}
</style>
