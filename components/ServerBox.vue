<template>
  <div class="box">
    <h1 class="title is-size-5">
      {{ title }}
    </h1>
    <b-taglist v-if="history.length">
      <ServerTag
        v-for="server in history"
        :key="server"
        :content="server"
        :closable="!suggested"
        :suggested="suggested"
        aria-close-label="Remove Server"
        @click="handleClick(server)"
        @close="handleRemove(server)"
      />
    </b-taglist>
    <p v-else>
      Nothing seems to be here... Why not check out some servers?
    </p>
  </div>
</template>

<script>

export default {
  props: {
    title: {
      type: String,
      required: true
    },
    history: {
      type: Array,
      required: false,
      default: () => []
    },
    suggested: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  methods: {
    handleClick (e) {
      this.$emit('select', e)
    },

    handleRemove (e) {
      this.$emit('remove', e)
    }
  }
}
</script>
