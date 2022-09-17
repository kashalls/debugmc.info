import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'

import { faCloudflare } from '@fortawesome/free-brands-svg-icons'
import Vue from 'vue'

library.add(faCloudflare)

Vue.component('FontAwesomeIcon', FontAwesomeIcon)
