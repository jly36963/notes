//> using scala 3.7.4
//> using dep "io.circe::circe-core:0.14.15"
//> using dep "io.circe::circe-parser:0.14.15"
//> using dep "io.circe::circe-generic:0.14.15"

import io.circe.*
import io.circe.generic.auto.*
import io.circe.parser.*
import io.circe.syntax.*

import java.net.URI
import java.net.http.HttpClient
import java.net.http.HttpRequest
import java.net.http.HttpResponse
import scala.util.Failure
import scala.util.Success
import scala.util.Try
import scala.util.chaining.scalaUtilChainingOps

@main
def examples(): Unit = {
  val scenarios: List[(String, () => Unit)] = List(
    ("http-get", httpGet),
    ("http-post", httpPost),
  )

  scenarios.foreach((s) => {
    val (title, fn) = s
    println(s"\n${title.toUpperCase()}\n")
    fn()
  })
}

def raiseForStatusDebug[T](response: HttpResponse[T]): Try[HttpResponse[T]] = {
  val status = response.statusCode()
  status match {
    case s if s >= 400 => {
      val body = response.body
      val message = s"Request failed:\nstatus: ${status}\nbody: ${body}"
      Failure(new RuntimeException(message))
    }
    case _ => {
      Success(response)
    }
  }
}

case class NewUser(id: Int, name: String)
case class User(id: Int, name: String, phone: String, address: Address)
case class Address(street: String, suite: String, city: String, zipcode: String)

def getUser(id: Int): Try[User] = {
  s"https://jsonplaceholder.typicode.com/users/${id}"
    .pipe(u => URI.create(u))
    .pipe(u => HttpRequest.newBuilder().uri(u).header("Accept", "application/json").GET().build())
    .pipe(req =>
      Try(HttpClient.newHttpClient().send(req, HttpResponse.BodyHandlers.ofString()))
        .flatMap(res => raiseForStatusDebug[String](res))
        .flatMap(res =>
          decode[User](res.body)
            .pipe(e => e.left.map(error => error.getCause()))
            .pipe(e => e.toTry)
        )
    )
}

def httpGet(): Unit = {
  val id = 1
  val user = getUser(id)
  val results = List(
    s"id: ${id}",
    s"user: ${user}",
  )
  results.foreach(println)
}

def createUser(newUser: NewUser): Try[NewUser] = {
  newUser.asJson.noSpaces
    .pipe(data =>
      HttpRequest
        .newBuilder()
        .uri(URI.create("https://jsonplaceholder.typicode.com/users/"))
        .header("Accept", "application/json")
        .header("Content-Type", "application/json")
        .POST(HttpRequest.BodyPublishers.ofString(data))
        .build()
    )
    .pipe(req =>
      Try(HttpClient.newHttpClient().send(req, HttpResponse.BodyHandlers.ofString()))
        .flatMap(res => raiseForStatusDebug[String](res))
        .flatMap(res =>
          decode[NewUser](res.body)
            .pipe(e => e.left.map(error => error.getCause()))
            .pipe(e => e.toTry)
        )
    )
}

def httpPost(): Unit = {
  val newUser = NewUser(id = 1, name = "Hiruzen Sarutobi")
  val created = createUser(newUser)
  val results = List(
    s"newUser: ${newUser}",
    s"created: ${created}",
  )
  results.foreach(println)
}
