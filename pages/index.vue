<!-- eslint-disable vue/attribute-hyphenation -->
<template>
  <section class="section">
    <h1 class="title has-text-centered">
      Debug MC
    </h1>
    <h2 class="subtitle has-text-centered">
      <i>Quickly debug your minecraft server!</i>
    </h2>
    <b-field grouped>
      <b-input v-model="host" placeholder="debugmc.info" type="search" expanded />
      <p class="control">
        <b-button class="button is-primary" @click="preformPing">
          Query
        </b-button>
      </p>
    </b-field>
    <div class="columns">
      <div class="column">
        <form class="box">
          <div class="control">
            <h1 class="title is-size-5">
              Recent History
            </h1>
            <b-field v-if="history.length" grouped group-multiline>
              <b-taglist>
                <ServerTag
                  v-for="historyServer in history"
                  :key="historyServer"
                  :content="historyServer"
                  isCloseable="true"
                  aria-close-label="Remove Server"
                  @click.native="host = historyServer"
                  @close.native="removeServer(historyServer)"
                />
              </b-taglist>
            </b-field>
            <p v-else>
              Nothing seems to be here... Why not check out the tested servers below?
            </p>
          </div>
        </form>
        <div class="box">
          <h1 class="title is-size-5">
            Suggested Servers
          </h1>
          <b-taglist>
            <ServerTag
              v-for="suggested in suggestions"
              :key="suggested"
              :content="suggested"
              :suggested="true"
              @click.native="host = suggested"
            />
          </b-taglist>
        </div>
      </div>

      <div class="column">
        <div class="columns is-multiline">
          <div class="column">
            <div class="card">
              <div class="card-content">
                <div class="media">
                  <div class="media-left">
                    <figure class="image is-48x48">
                      <template v-if="loading">
                        <b-skeleton width="48px" height="48px" />
                      </template>
                    </figure>
                  </div>
                  <div class="media-content">
                    <b-skeleton v-if="loading" />
                    <p v-else class="title is-size-4">
                      {{ server.name }}
                    </p>
                    <b-skeleton v-if="loading" />
                    <p v-else class="subtitle is-size-6">
                      {{ host }}
                    </p>
                  </div>
                </div>

                <div class="content">
                  <b-taglist>
                    <b-tag :type="loading ? '' : pingColor(server.ping)" icon="wifi-star" size="is-small">
                      <template v-if="loading">
                        <b-skeleton width="36px" />
                      </template>
                      <template v-else>
                        {{ server.ping }}ms
                      </template>
                    </b-tag>
                    <b-tag icon="information-variant" size="is-small">
                      <template v-if="loading">
                        <b-skeleton width="86px" />
                      </template>
                      <template v-else>
                        {{ server.version }}
                      </template>
                    </b-tag>
                    <b-tag type="is-info is-light" icon="account-multiple" size="is-small">
                      <template v-if="loading">
                        <b-skeleton width="64px" />
                      </template>
                      <template v-else>
                        {{ server.playercount }}
                      </template>
                    </b-tag>
                    <b-tag icon="dns" size="is-small" class="is-clickable is-unselectable" @click.native="doDNSLook">
                      DNS
                    </b-tag>
                  </b-taglist>

                  <div class="block">
                    <template v-if="loading">
                      <b-skeleton size="is-large" :count="2" />
                    </template>
                    <template v-else>
                      {{ server.motd }}
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import ServerTag from '~/components/ServerTag.vue'
import DNSModal from '~/components/DNSModal.vue'

export default {
  name: 'IndexPage',
  components: { ServerTag },
  data () {
    return {
      suggestions: ['debugmc.info', 'hypixel.net', '2b2t.org'],
      host: 'debugmc.info',
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
    },
    removeServer (server) {
      this.history = this.history.filter(history => history !== server)
    },
    pingColor (ping) {
      if (ping > 5) {
        return 'is-danger is-light'
      }
      if (ping > 90) {
        return 'is-success'
      }
      if (ping > 170) {
        return 'is-warning'
      }
      return 'is-danger'
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
    }
  }
}
</script>
