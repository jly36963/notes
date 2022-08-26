require "kemal"
require "uuid"
require "uuid/json"
require "json"

# GET /api
# Return string
get("/api") do
  "Hello world!"
end

# GET /api/hello
# Return json
get("/api/hello") do |env|
  env.response.content_type = "application/json"
  {message: "Hello world!"}.to_json
end

# GET /api/health
# Status only
get("/api/health") do |env|
  env.response.status_code = 200
end

# Get /api/health-check
# Redirect
# NOTE: connection reset if body?
get("/api/health-check") do |env|
  env.redirect "/api/health"
end

# GET /api/store/search
# Return query params
# env.params.query: URI::Params
get("/api/store/search") do |env|
  query = env.params.query
  q = query["q"]?
  t = query["t"]?
  env.response.content_type = "application/json"
  {q: q, t: t}.to_json
end

# GET /api/user/:id
# Return mock user with id
get("/api/user/:id") do |env|
  id = UUID.parse?(env.params.url["id"])
  if !id
    halt env, status_code: 404, response: nil
  end
  user = User.new(id, "Kakashi", "Hatake", 27) # Fake db response
  env.response.content_type = "application/json"
  user.to_json
end

# POST /api/user
# Receive and send json
# env.params.json: Hash(String, Array(JSON::Any)
# env.request: HTTP::Request
# env.request.body: HTTP::FixedLengthContent (undocumented)
post("/api/user") do |env|
  body = env.params.json
  first_name = body["firstName"]?.as?(String)
  last_name = body["lastName"]?.as?(String)
  age = body["age"]?.as?(Int64) # Kemal defaults ints to Int64 (?)

  if !(first_name && last_name && age)
    halt env, status_code: 400, response: nil
  end

  age = age.to_i32
  uuid = UUID.random
  user = User.new(uuid, first_name, last_name, age)

  env.response.content_type = "application/json"
  user.to_json
rescue
  env.response.status_code = 500
end

# Catch all (api)
get("/api/*") do |env|
  env.response.status_code = 404
end

# Catch all
get "/" do |env|
  env.response.content_type = "text/html"
  "<html><body>Welcome!</body></html>"
end
get "/*" do |env|
  env.redirect "/"
end

# Override default behavior and do nothing
error 404 do |env|
  env.response.status_code = 404
end

# ---
# Classes
# ---

class User
  include JSON::Serializable

  @[JSON::Field(key: "id")]
  property id : UUID
  @[JSON::Field(key: "firstName")]
  property first_name : String
  @[JSON::Field(key: "lastName")]
  property last_name : String
  @[JSON::Field(key: "age")]
  property age : Int32

  def initialize(@id, @first_name, @last_name, @age)
  end

  def to_s
    self.to_json
  end
end

# ---
# Main
# ---

def main_
  Kemal.run
end

main_()
