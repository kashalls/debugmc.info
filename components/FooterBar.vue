<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <footer class="footer">
    <div class="content has-text-centered">
      <p v-if="$fetchState.pending">
        Awaiting data...
      </p>
      <p v-else-if="$fetchState.error">
        Failed to check data.
      </p>
      <p v-else>
        <b>Your IP:</b> <b-tag rounded>
          {{ ip.ip }}
        </b-tag> · <b>ISP:</b> <b-tag rounded>
          {{ ip.connection.isp }}
        </b-tag> <b-tag rounded>
          ASN {{ ip.connection.asn }}
        </b-tag>
        · <b>Status:</b> <b-tag rounded>
          Residential
        </b-tag>
      </p>
      <p>
        <a href="https://debugmc.info">Debugmc.info</a> created by <a href="https://github.com/kashalls">Kashall</a> · Source available on <a href="https://github.com/Kashalls/debugmc.info">            <b-icon
          icon="github"
          size="is-small"
        /> github</a>
      </p>
      <p>
        <a href="https://www.minecraft.net/en-us/">Minecraft</a> is copyrighted by <a href="https://www.mojang.com/">Mojang Studios</a> and is not affiliated with this site. Buy the game!
      </p>
    </div>
  </footer>
</template>

<script>
export default {
  fetchOnServer: false,
  data () {
    return {
      ip: {}
    }
  },
  async fetch () {
    if (process.client) {
      this.ip = await this.$axios.$get('http://ipwho.is/')
    }
  }
}
</script>
