<template>
  <b-tag
    class="is-clickable is-unselectable"
    :attached="isAttached"
    :closable="isCloseable"
    :icon="getIcon"
    :icon-type="getIconType"
    size="is-small"
  >
    {{ content }}
  </b-tag>
</template>

<script>
export default {
  props: {
    suggested: {
      type: Boolean,
      required: false,
      default: false
    },
    icon: {
      type: String,
      required: false,
      default: ''
    },
    content: {
      type: String,
      required: true,
      default: ' '
    },
    isCloseable: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  computed: {
    getIcon () {
      const { icon, suggested } = this
      if (suggested) {
        return 'star'
      }

      return icon
    },
    getIconType () {
      if (this.suggested) {
        return 'is-warning'
      }
      return ''
    },
    isAttached () {
      return (this.suggested || this.icon) || this.isCloseable
    }
  }
}
</script>
