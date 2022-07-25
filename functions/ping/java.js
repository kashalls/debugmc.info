const protocol = require('minecraft-protocol')

export function doRequestGet ({ params }) {
  try {
    protocol.ping({
      host: params.host, port: params.port
    },
    (err, res) => {
      if (err) { throw err } else { return new Response(JSON.stringify(res)) }
    })
  } catch (err) {
    return new Response(JSON.stringify(err))
  }
}
