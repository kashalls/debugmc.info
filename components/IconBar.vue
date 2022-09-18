<template>
  <div>
    <b-tooltip
      v-for="service in services"
      :key="service"
      :type="getType(service)"
    >
      <template #content>
        This domain is using <u>{{ $capitalizeFirstLetter(service) }}</u>.
      </template>
      <FontAwesomeIcon
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
