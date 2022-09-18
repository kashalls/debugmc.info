<template>
  <b-taglist>
    <b-tag
      v-for="record in getPrimaries"
      :key="record.data"
      class="is-clickable is-unselectable"
      :icon="getIcon(record)"
      :type="getColor(record)"
      @click="copyToClipboard(record.data ?? record)"
    >
      {{ record.data ?? record }}
    </b-tag>
  </b-taglist>
</template>

<script>
export default {
  props: {
    dns: {
      type: Object,
      required: true,
      default: () => {
        return {
          a: [],
          aaaa: [],
          service: [],
          srvA: []
        }
      }
    }
  },
  computed: {
    getPrimaries () {
      const result = this.generateArray()
      return result.slice(0, 2)
    }
  },
  methods: {
    copyToClipboard (thingy) {
      navigator.clipboard.writeText(thingy)
      this.$buefy.notification.open({
        message: 'Copied!',
        type: 'is-success'
      })
    },
    generateArray () {
      const result = []
      function doThing (res) {
        result.push(res)
      }
      this.dns.srvA.forEach(res => result.push(res))
      this.dns.a.forEach(doThing)
      this.dns.aaaa.forEach(doThing)
      return result
    },
    getIcon (record) {
      const records = this.getPrimaries
      return `numeric-${records.indexOf(record) + 1}`
    },
    getColor (record) {
      const records = this.getPrimaries
      const color = ['is-success', 'is-success is-light']
      return color[records.indexOf(record)]
    }
  }
}
</script>
