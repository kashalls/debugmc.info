<template>
  <div class="block">
    <b-tooltip
      v-for="service in services"
      :key="service"
    >
      <FontAwesomeIcon
        :icon="service"
      />
      <template #label>
        This domain is using <u>{{ service }}</u>.
      </template>
    </b-tooltip>
  </div>
</template>

<script>
export default {
  props: {
    services: {
      type: Array,
      required: true,
      default: () => []
    }
  }
}
</script>
