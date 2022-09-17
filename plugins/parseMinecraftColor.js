import { motdParser } from '@sfirew/mc-motd-parser'

export default ({ app }, inject) => {
  inject('cleanTags', (text) => {
    return motdParser.cleanTags(text)
  })

  inject('autoToHtml', (motd) => {
    return motdParser.autoToHtml(motd)
  })

  inject('textToHTML', (motd) => {
    return motdParser.textToHTML(motd)
  })

  inject('textToJSON', (motd) => {
    return motdParser.textToJSON(motd)
  })

  inject('JSONToHtml', (motd) => {
    return motdParser.JSONToHtml(motd)
  })
}
