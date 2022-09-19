<template>
  <div>
    <b-tooltip
      v-for="service in services"
      :key="service"
      :type="getType(service)"
      position="is-bottom"
    >
      <template #content>
        This domain is using <u>{{ $capitalizeFirstLetter(service) }}</u>.
      </template>
      <template v-if="service === 'tcpshield'">
        <TCPShieldIcon :class="getType(service)" />
      </template>
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
import TCPShieldIcon from '~/assets/icons/TCPShieldIcon.svg?inline'

const colorMap = {
  cloudflare: 'is-warning'
}

export default {
  components: { TCPShieldIcon },
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
