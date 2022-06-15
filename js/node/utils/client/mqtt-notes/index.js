
import net from 'net'
import Aedes from 'aedes'
import logging from 'aedes-logging'

const main = () => {
  const aedes = Aedes()
  const server = net.createServer(aedes.handle)
  const port = 1883

  logging({
    instance: aedes,
    servers: [server],
    pinoOptions: { prettyPrint: true }
  })

  server.listen(port, () => {
    console.log(`listening on port ${port}`)
  })
}

main()
