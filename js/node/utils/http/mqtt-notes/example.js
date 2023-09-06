import MQTT from 'async-mqtt'

const main = async () => {
  // Client
  const clientId = 'f13e0f1a-1826-446e-99e7-dd6da05626c3'
  const tcpUri = 'tcp://localhost:1883'
  const mqttOptions = {
    keepAlive: 60,
    clientId,
    properties: {
      sessionExpiryInterval: 3600 // Session will expire 1 hour after client disconnect
    },
    will: {
      topic: 'client/disconnect',
      payload: `Client ${clientId} disconnected`, // Ungraceful disconnect
      qos: 1
    }
  }
  const client = MQTT.connect(tcpUri, mqttOptions)

  // Handlers
  client.on('connect', (packet) => {
    console.log('CONNECT EVENT')
    console.log(packet)
  })
  client.on('subscribe', packet => {
    console.log('SUBSCRIBE EVENT')
    const { messageId, subscriptions } = packet
    console.log({ messageId, subscriptions })
  })
  client.on('message', (topic, message, packet) => {
    console.log('MESSAGE EVENT')
    console.log({ topic, message, packet })
  })
  client.on('publish', packet => {
    console.log('PUBLISH EVENT')
    console.log({ packet })
  })
  client.on('close', () => {
    console.log('CLOSING EVENT')
  })
  client.on('disconnect', () => {
    console.log('DISCONNECT EVENT')
  })
  client.on('error', e => {
    console.log('ERROR EVENT')
    console.log(e)
  })
  client.on('packetsend', packet => {
    console.log('PACKETSEND EVENT')
    console.log(packet)
  })
  client.on('packetreceive', packet => {
    console.log('PACKETRECEIVE EVENT')
    console.log(packet)
  })

  // Subscribe
  const subscriptions = [
    {
      topic: ['hello/world', 'foo/bar'],
      options: { qos: 1 }
    },
    {
      topic: 'users/*/status',
      options: { qos: 1 }
    },
    {
      topic: 'admin/#',
      options: { qos: 1 }
    },
  ]
  const subacks = [] // Array<Array<{topic: string, qos: number}>>
  for (const { topic, options } of subscriptions) {
    const suback = await client.subscribe(topic, options)
    subacks.push(suback)
  }

  console.log('SUBACKS')
  subacks.forEach((s, i) => {
    s.forEach((ss, ii) => {
      if (ss) {
        const { topic, qos } = ss
        console.log(`${i} ${ii} topic: ${topic}, qos: ${qos}`)
      }
    })
  })

  // Publish
  const publishes = [
    {
      topic: 'hello/world',
      message: 'Hello world!',
      options: { qos: 0, retain: false }
    },
    {
      topic: 'users/1674fbbe-78ec-4298-9c34-f5a14e8bd183/status',
      message: 'Online',
      options: {}
    },
    {
      topic: 'admin/1674fbbe-78ec-4298-9c34-f5a14e8bd183/action',
      message: 'Updated name',
      options: {}
    },
  ]
  for (const { topic, message, options } of publishes) {
    await client.publish(topic, message, options)
  }

  // Wait for messages
  await new Promise(r => setTimeout(r, 2000))

  // Close
  await client.end()
}

main()