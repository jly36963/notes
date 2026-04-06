# mqtt

mq telemtry transport

mqtt specifications
  - 3.1.1
  - 5

## resources

- hivemq has a playlist on youtube called "mqtt essentials"

## docs

- client
  - https://github.com/mqttjs/MQTT.js
  - https://www.npmjs.com/package/mqtt

- async client
  - https://github.com/mqttjs/async-mqtt

- server (broker)
  - https://github.com/moscajs/aedes

## underlying technologies

https://www.npmjs.com/package/mqtt-packet

## notes

### origin of mqtt

- oil pipeline sensor data needed to be collected from remote locations.
- they needed a new protocol that could meet certain constraints:
  - low energy
  - low cost
  - low bandwidth
  - unstable connections

### about

- IoT messaging protocol
- built on top of TCP/IP
  - persistent TCP connections
    - heartbeat mechanism
  - security with TLS
  - use MQTT SN for UDP
- minimal overhead
- simple
- efficient (uses binary data)
- de-coupled
  - space decoupled (they don't need to be in the same room)
  - time decoupled (queuing)
  - synchronisation decoupled (publisher/subscriber don't need to wait for each other)
- SPOF
  - single point of failure
  - if broker is down, nothing can happen
  - commercial brokers can be used for clustering/replication

### broker & clients

- client publishes a message (under a topic)
- broker receives that message
- broker sends that message to each client subscribed to that topic

### broker

- purpose
  - listen for published messages and forward to subscribed clients
  - store retained messages
    - if a new client subscribes after a message is published, they can get the last value
  - track session information 
    - subscriptions, received status (retained messages), user/accounts, etc
    - can save info long term -- persistant sessions
  - track connection status
    - handle birth / death / last will and testament messages (keep-alive timer expired)
- central location for security
  - clients are de-coupled
  - all clients have to authenticate with broker
  - only one port open (8883)
  - security
    - tls encryption
    - user/pw
    - optional cert

### clients

- mqtt is a bi-directional protocol
- any client can publish/subscribe to multiple topics
- clients are unaware of each other
  - use of topics abstracts away ip addr / domains of other clients

- examples
  - publish
    - publish sensor data
  - subscribe
    - subscription controls light intensity / color

- patterns
  - one to one
  - one to many
    - one client publishes a message, and many clients are subscribed to its topic
  - many to one
    - many clients are publishing messages, and one client is subscribed to the topic

### connecting

- client will send mqtt connect packet to broker
  - clientId (required), cleanSession (required), username, password,
  - lastWillTopic, lastWillQos, lastWillMessage, lastWillRetain
  - keepAlive
- broker will handle auth
- broker will return connack packet to client
  - sessionPresent, returnCode

### publishing

- flow
  - client sends mqtt publish packet:
    - packetId -- identifier (always 0 for qos 0)
    - topicName -- hierarchical namespace for subscribers to listen to
    - qos -- quality of service (0, 1, 2) (at most once, at least once, exactly once)
    - retainFlag -- whether or not to use the retain feature
    - payload -- data (text, file, etc)
    - dupFlag --
  - broker responds with puback packet
  - qos can cause additional packets

- max packet size is 256MB
  - don't do that, try to keep it under 10KB
  - chunk/compress to reduce payload size
  - many cloud platforms further limit size/frequency of publishes

### subscribing

- client sends subscribe packet
  - packetId
  - [list of topic + qos]

- broker returns suback packet
  - packetId
  - [list of returnCode]

### unsubscribe

- client sends unsubscribe packet
  - packetId
  - [list of topics]

- broker responds with unsuback packet
  - packetId

### topics

- utf-8 encoded string
- case sensitive
- hierarchical
  - a/b/c/...
    - eg: home/office/temp
- patterns
  - a specific topic (home/office/temp)
  - single-level wildcard (home/+/temp) ("+" can be used in any position)
  - multi-level wildcard (home/#) ("#" can only be used at end)
- rules
  - don't use leading "/" or "$"
  - no spaces
- suggestions
  - use ascii characters
  - keep it short/concise
  - use a unique identifier
    - embedded id can be used to enforce authorization
    - eg: a client can only publish to its own client id
  - don't use # at root
    - using a client to persist all messages to a db might overwhelm it
    - add a plugin to the broker that will persist data to a db instead
  - think ahead
    - structure the topics such that adding a new topic/subtopic won't require big changes


### quality of service

- 0
  - at most once
  - no puback from broker
  - use when message loss is acceptable
- 1
  - at least once
  - one puback from broker
  - use when message needs to be delivered, and redundancy is okay
- 2
  - exactly once
  - publish (c), pubrec (b), pubrel (c), pubcomp (b) 
  - when message must be delivered, and redundancy is not okay

### sessions

- persistent session
  - cleanSession is false
  - broker will remember sessions
  - in connack packet (on connection), broker will return sessionPresent as true

- clean session
  - cleanSession is true
  - broker will delete client info as soon as client disconnects

- persisted client info
  - session data, subscriptions, unacknowledged qos messages, queued messages
  
- queued messages
  - messages are queued per client
  - broker queues all qos 1 and 2 messages when  a persistent session client is offline
  - qos 0 is never queued

- check message expiry
  - by default, the broker won't clear queued messages and sessions for persistent sessions

### retained messages

- retained message: a topic's last known good value that is persisted by the broker
  - on publish packet, set retainFlag to true
  - use when a topic needs to have a start value (no empty start value)
  - broker only retains one message per topic

- queued vs retained:
  - retained
    - topic level
    - newly connected subscribers to a topic receive messages immediately
  - queued
    - client level (persistent session)
    - on re-connection, broker will deliver the enqueued/undelivered messages

- to delete retained message:
  - publish a retained message with an empty payload

### last will and testament

- LWT
  - notification to other clients when a client disconnects ungracefully
  - configured by client on connect
  - LWT event is handled by broker 
    - triggers
      - broker detects I/O error or network failure
      - failure to communicate within "Keep Alive" period
      - client does not send a disconnect packet before closing connection
      - broker closes connection because of protocol error
  - to be useful, another client should be subscribed to the lastWillTopic

- connect packet LWT properties
  - lastWillTopic: topic to publish
  - lastWillQos: qos to use
  - lastWillMessage: payload
  - lastWillRetain: should message be retained

### keep alive

- keep alive period
  - close connection if no communication within keep alive period
  - many clients default to 60s

- packets
  - pingreq (client -> broker)
  - pingresp (broker -> client)

- client takeover
  - client disconnects (eg: car in tunnel)
  - client reconnects with same clientId
  - broker removes old connection and new connection is used
  - tips
    - enforce unique clientIds (avoid unintentional client takeover)
    - use authentication (avoid unauthorized client takeover)

### subscriptions

- two types
  - subscription
  - shared subscription 
    - mqtt 5 feature
    - client side load balancing
    - clients can join/leave during runtime
    - follows this pattern: $share/GROUPID/TOPIC

### security

- security was a key concern during its creation
- layer 7 protocol
- typically uses encrypted TLS channel
- provides mechanisms for authentication/authorization