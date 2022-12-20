<!-- eslint-disable vue/no-v-html -->
<!-- eslint-disable vue/attribute-hyphenation -->
<template>
  <section class="section">
    <h1 class="title has-text-centered">
      Debug MC
    </h1>
    <h2 class="subtitle has-text-centered">
      <i>Quickly debug your minecraft server!</i>
    </h2>
    <div class="box">
      <b-field grouped group-multiline>
        <b-field expanded>
          <b-input v-model="host" placeholder="debugmc.info" type="search" expanded />
          <template #label>
            Host
          </template>
        </b-field>
        <b-field>
          <b-numberinput
            v-model="port"
            :controls="false"
            step="1"
            exponential
            :min="1"
            :max="65535"
          />
          <template #label>
            Port
            <b-tag v-if="port !== defaultPort" icon="restart" size="is-small" class="is-unselectable" @click.native="port = defaultPort">
              Default
            </b-tag>
          </template>
        </b-field>
        <b-field label="Platform">
          <b-select v-model="platform" icon="minecraft" icon-type="is-success" @input="shouldUpdatePort">
            <option value="java">
              Java
            </option>
            <option value="bedrock">
              Bedrock
            </option>
          </b-select>
        </b-field>
        <b-field>
          <b-numberinput
            v-model="version"
            :controls="false"
            step="1"
            exponential
            :min="0"
            :max="999"
            :disabled="platform === 'bedrock'"
          />
          <template #label>
            Protocol <a href="https://wiki.vg/Protocol_version_numbers"><b-icon icon="link-variant" size="is-small" class="is-clickable" /></a>
          </template>
        </b-field>
        <b-button type="is-primary" class="mt-auto" :loading="loading" @click="preformPing">
          Query
        </b-button>
      </b-field>
    </div>
    <div class="columns">
      <div class="column">
        <div class="card">
          <div class="card-content">
            <div class="media">
              <div class="media-left">
                <figure class="image is-64x64">
                  <b-skeleton v-if="loading || !server.favicon" width="64px" height="64px" />
                  <b-image v-else custom-class="pixel-image" :src="server.favicon" />
                </figure>
              </div>
              <div class="media-content">
                <b-skeleton v-if="loading" />
                <p v-else class="title is-size-4">
                  {{ server.host }} <IconBar :services="services" />
                </p>
              </div>
            </div>

            <div class="content">
              <b-taglist class="mb-0">
                <b-tag :type="loading ? '' : pingColor(server.ping)" icon="wifi-star" size="is-small">
                  <b-skeleton v-if="loading" width="36px" />
                  <template v-else>
                    {{ server.ping }}ms
                  </template>
                </b-tag>
                <b-tag icon="information-variant" size="is-small">
                  <b-skeleton v-if="loading" width="86px" />
                  <template v-else>
                    {{ server.version.name }}
                  </template>
                </b-tag>
                <b-tag type="is-info is-light" icon="account-multiple" size="is-small">
                  <b-skeleton v-if="loading" width="64px" />
                  <template v-else>
                    {{ server.players.online }} / {{ server.players.max }}
                  </template>
                </b-tag>
                <b-tag icon="dns" size="is-small" class="is-clickable is-unselectable" @click.native="doDNSLook">
                  DNS
                </b-tag>
              </b-taglist>
              <AAGIP :dns="dns" />

              <div class="block">
                <b-skeleton v-if="loading" size="is-large" :count="2" />
                <b-tooltip v-else position="is-bottom" label="Click to copy!" type="is-dark">
                  <div class="minecraft is-unselectable is-clickable" @click="$copyToClipboard(server.description)" v-html="server.motd" />
                </b-tooltip>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="column">
        <ServerBox title="Suggested Servers" :history="suggestions" :suggested="true" @select="host = $event" />
        <ServerBox title="Recent History" :history="history" @select="host = $event" @remove="removeServer($event)" />
      </div>
    </div>
  </section>
</template>

<script>
import DNSModal from '~/components/DNSModal.vue'
import ServerBox from '~/components/ServerBox.vue'
import IconBar from '~/components/IconBar.vue'
import AAGIP from '~/components/AAGIP.vue'

const options = { headers: { accept: 'application/dns-json' } }

export default {
  name: 'IndexPage',
  components: { ServerBox, IconBar, AAGIP },
  data () {
    return {
      version: 0,
      platform: 'java',
      suggestions: ['debugmc.info', 'hypixel.net', '2b2t.org', 'play.eternal.gs'],
      services: [],
      host: 'play.eternal.gs',
      port: 25565,
      history: [],
      loading: true,
      server: null,
      dns: {
        a: [],
        aaaa: [],
        service: [],
        srvA: []
      }
    }
  },
  computed: {
    hasDNS () {
      switch (this.$isIP(this.host)) {
        case 0:
          return true
        case 4:
        case 6:
        default:
          return false
      }
    },
    defaultPort () {
      if (this.platform === 'java') {
        return 25565
      } else {
        return 19132
      }
    }
  },
  mounted () {
    this.preformPing()
  },
  methods: {
    shouldUpdatePort () {
      if (this.platform === 'java' && this.port === 19132) {
        this.port = this.defaultPort
      }
      if (this.platform === 'bedrock' && this.port === 25565) {
        this.port = this.defaultPort
      }
    },
    async preformPing () {
      if (!this.host || this.host === 'localhost') { return }
      this.services = []
      this.loading = true

      if (this.history.includes(this.host)) {
        this.removeServer(this.host)
      }
      this.history.push(this.host)

      const hostname = this.host.includes(':') ? this.host.split(':')[0] : this.host

      const query = [`hostname=${hostname}`, `port=${this.port === this.defaultPort ? this.defaultPort : this.port}`]
      if (this.platform === 'java') {
        query.push(`version=${this.version}`)
      }
      const response = await this.$axios.$get(`https://api.debugmc.info/${this.platform}?${query.join('&')}`)
      if (this.hasDNS) {
        this.dns = await this.queryDNS()
      }

      if (!response) {
        this.loading = false
        return this.$buefy.notification.open({
          message: 'Failed to connect. Is that server firewalled or running?',
          type: 'is-danger'
        })
      }

      const { ping, resp } = response
      const server = JSON.parse(resp)
      server.motd = this.$autoToHtml(server.description)
      server.host = hostname

      server.ping = (ping * 1000).toFixed(2)
      this.server = server
      this.loading = false
    },
    removeServer (server) {
      this.history = this.history.filter(history => history !== server)
    },
    pingColor (ping) {
      if (ping < 90) {
        return 'is-success'
      }
      if (ping < 170) {
        return 'is-warning'
      }
      return 'is-danger'
    },
    async queryDNS () {
      const [a, aaaa, services, soa] = await Promise.all([
        this.preformRecordDiscovery(this.host, 'A'),
        this.preformRecordDiscovery(this.host, 'AAAA'),
        this.preformRecordDiscovery(`_minecraft._tcp.${this.host}`, 'SRV'),
        this.preformRecordDiscovery(this.host, 'soa')
      ])

      const srvA = []
      for (const service of services) {
        const dataLocation = service.type === 33 ? service.data.split(' ')[3] : service.data
        const answer = await this.preformRecordDiscovery(dataLocation, 'SRV')
        if (!answer.length) { return };
        const ips = answer.filter(record => record.type === 1)
        if (!ips.length) { return }
        ips.forEach((record) => {
          if (record.name === 'tcpshield.net') {
            if (this.services.includes('tcpshield')) { return }
            this.services.push('tcpshield')
          }
          srvA.push(record.data)
        })
      }

      soa.forEach((answer) => {
        if (this.services.includes('cloudflare')) { return }
        if (answer.data.includes('cloudflare.com')) {
          this.services.push('cloudflare')
        }
      })

      return { a, aaaa, service: services, srvA }
    },
    async preformRecordDiscovery (host, type) {
      const response = await this.$axios.$get(`https://cloudflare-dns.com/dns-query?name=${host}&type=${type}`, options)
      if (response.Status === null || response.Status !== 0) { return [] }
      if (!response.Answer) { return [] }
      if (response.Question[0].type === 6) {
        return response.Authority ?? response.Answer
      }
      return response.Answer
    },
    doDNSLook () {
      const { host, dns } = this
      this.$buefy.modal.open({
        parent: this,
        props: { host, dns },
        component: DNSModal,
        hasModalCard: true,
        trapFocus: true
      })
    }
  }
}
</script>

<style>
  @font-face {
      font-family: 'Minecraft';
      src: local('Minecraft'), url(~assets/fonts/Monocraft.otf) format('opentype');
  }

  .minecraft {
      font-family: 'Minecraft';
  }

  .pixel-image {
    image-rendering: pixelated;
  }
  </style>
