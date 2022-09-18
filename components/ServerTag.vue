<template>
  <b-tag
    class="is-clickable is-unselectable"
    :attached="isAttached"
    :closable="closable"
    :icon="getIcon"
    :icon-type="getIconType"
    size="is-small"
    @click="handleClick"
    @close="handleClose"
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
    closable: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  computed: {
    getIcon () {
      const { icon, suggested } = this
      if (icon) {
        return icon
      }
      if (suggested) {
        return 'crown'
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
      return (this.suggested || this.icon) || this.closable
    }
  },
  methods: {
    handleClick () {
      this.$emit('click', this.content)
    },
    handleClose () {
      this.$emit('close', this.content)
    }
  }
}
</script>
