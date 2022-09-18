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
          <b-numberinput v-model="port" :controls="false" step="1" exponential />
          <template #label>
            Port
          </template>
        </b-field>
        <b-field label="Platform">
          <b-select v-model="platform" icon="minecraft">
            <option value="java">
              Java
            </option>
            <option value="bedrock">
              Bedrock
            </option>
          </b-select>
        </b-field>
        <b-field label="Protocol Version">
          <b-numberinput v-model="version" :controls="false" step="1" exponential />
          <template #label>
            Protocol <a href="https://wiki.vg/Protocol_History"><b-icon icon="link-variant" size="is-small" class="is-clickable" /></a>
          </template>
        </b-field>
        <p class="control">
          <b-button class="button is-primary" @click="preformPing">
            Query
          </b-button>
        </p>
      </b-field>
    </div>
    <div class="columns">
      <div class="column">
        <ServerBox title="Suggested Servers" :history="suggestions" :suggested="true" @select="host = $event" />
        <ServerBox title="Recent History" :history="history" @select="host = $event" @remove="removeServer($event)" />
      </div>

      <div class="column">
        <div class="card">
          <div class="card-content">
            <div class="media">
              <div class="media-left">
                <figure class="image is-48x48">
                  <b-skeleton v-if="loading || !server.favicon" width="48px" height="48px" />
                  <b-image v-else :src="server.favicon" />
                </figure>
              </div>
              <div class="media-content">
                <b-skeleton v-if="loading" />
                <p v-else class="title is-size-4">
                  {{ host }}
                </p>
                <b-skeleton v-if="loading" />
                <p v-else class="subtitle is-size-6">
                  <!-- <b-tag icon="content-copy" size="is-small" class="is-clickable is-unselectable" @click="copyToClipboard(dns.a[0].data ?? null)">
                    {{ dns.a[0].data ?? null }}
                  </b-tag> -->
                </p>
              </div>
            </div>

            <div class="content">
              <b-taglist>
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

              <div class="block">
                <b-skeleton v-if="loading" size="is-large" :count="2" />
                <div v-else v-html="server.motd" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import DNSModal from '~/components/DNSModal.vue'
import ServerBox from '~/components/ServerBox.vue'

export default {
  name: 'IndexPage',
  components: { ServerBox },
  data () {
    return {
      version: 0,
      platform: 'java',
      suggestions: ['debugmc.info', 'hypixel.net', '2b2t.org'],
      host: 'debugmc.info',
      port: 25565,
      history: [],
      loading: true,
      server: null,
      dns: {
        a: [],
        aaaa: [],
        service: []
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
    }
  },
  methods: {
    async preformPing () {
      if (!this.host || this.host === 'localhost') { return }
      this.loading = true
      if (this.hasDNS) {
        const { a, aaaa, service } = await this.queryDNS()
        this.dns.a = a
        this.dns.aaaa = aaaa
        this.dns.service = service
      }

      if (this.history.includes(this.host)) {
        this.removeServer(this.host)
      }
      this.history.push(this.host)

      const hostname = this.host.includes(':') ? this.host.split(':')[0] : this.host
      const port = parseInt(this.host.includes(':') ? this.host.split(':')[1] : this.port) ?? false

      const query = { hostname, platform: this.platform, version: this.version }

      if (port) { query.port = port }

      this.doAPIMagic(query)
    },
    removeServer (server) {
      this.history = this.history.filter(history => history !== server)
    },
    pingColor (ping) {
      if (ping < 5) {
        return 'is-danger is-light'
      }
      if (ping < 90) {
        return 'is-success'
      }
      if (ping < 170) {
        return 'is-warning'
      }
      return 'is-success is-light'
    },
    async queryDNS () {
      const options = { headers: { accept: 'application/dns-json' } }

      let [a, aaaa, service] = await Promise.all([
        this.$axios.$get(`https://cloudflare-dns.com/dns-query?name=${this.host}&type=A`, options),
        this.$axios.$get(`https://cloudflare-dns.com/dns-query?name=${this.host}&type=AAAA`, options),
        this.$axios.$get(`https://cloudflare-dns.com/dns-query?name=_minecraft._tcp.${this.host}&type=SRV`, options)
      ])
      a = a.Answer ?? []
      aaaa = a.Answer ?? []
      service = service.Answer ?? []

      service.forEach(async (srv) => {
        const [, , , endpoint] = srv.data.split(' ')
        if (this.$isIP(endpoint) === 0) {
          const { Answer } = await this.$axios.$get(`https://cloudflare-dns.com/dns-query?name=${endpoint}&type=A`, options)
          if (!Answer) {
            // eslint-disable-next-line no-console
            console.log('I actually don\'t know what happens if this doesn\'t exist.')
          } else {
            service[service.indexOf(srv)].parsed = Answer
          }
        }
      })
      return { a, aaaa, service }
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
    },
    async doAPIMagic ({ hostname, port = 25565, platform = 'java', version }) {
      if (!['java', 'bedrock'].includes(platform)) { return }

      const query = [`hostname=${hostname}`]
      if (platform === 'java') {
        if (port !== 25565) {
          query.push(`port=${port}`)
        }
      } else if (platform === 'bedrock') {
        if (port !== 19132) {
          query.push(`port=${port}`)
        }
      }

      const response = await this.$axios.$get(`https://api.debugmc.info/${platform}?${query}`)

      const { ping, resp } = response
      const server = JSON.parse(resp)
      const motd = server.description
      delete server.description
      server.motd = this.$autoToHtml(motd)
      server.ping = (ping * 1000).toFixed(2)
      this.server = server
      this.loading = false
    },
    copyToClipboard (thingy) {
      navigator.clipboard.writeText(thingy)
      this.$buefy.notification.open({
        message: 'Copied!',
        type: 'is-success'
      })
    }
  }
}
</script>
