//> using scala 3.7.4
//> using dep "com.lihaoyi::requests:0.9.0"
//> using dep "io.circe::circe-core:0.14.15"
//> using dep "io.circe::circe-parser:0.14.15"
//> using dep "io.circe::circe-generic:0.14.15"

import io.circe.*
import io.circe.generic.auto.*
import io.circe.parser.*
import io.circe.syntax.*
import requests.Request
import requests.Response

import scala.util.Failure
import scala.util.Success
import scala.util.Try
import scala.util.chaining.scalaUtilChainingOps

@main
def examples(): Unit = {
  val scenarios: List[(String, () => Unit)] = List(
    ("httpGet", httpGet),
    ("httpPost", httpPost),
  )

  scenarios.foreach((s) => {
    val (title, fn) = s
    println(s"\n${title.toUpperCase()}\n")
    fn()
  })
}

def raiseForStatusDebug(response: Response): Try[Response] = {
  val status = response.statusCode
  status match {
    case s if s >= 400 => {
      val body = response.text()
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
  val url = s"https://jsonplaceholder.typicode.com/users/${id}"
  val headers = Map(
    "Accept" -> "application/json",
    "Content-Type" -> "application/json",
  ).toList
  Try(requests.get(url, headers = headers))
    .pipe(t => t.flatMap(res => raiseForStatusDebug(res)))
    .pipe(t =>
      t.flatMap(res =>
        decode[User](res.text())
          .pipe(e => e.left.map(error => error.getCause()))
          .pipe(e => e.toTry)
      )
    )
}
def httpGet(): Unit = {
  val user = getUser(1)
  val results = List(
    s"user: ${user}",
  )
  results.foreach(println)
}

def createUser(newUser: NewUser): Try[NewUser] = {
  val url = s"https://jsonplaceholder.typicode.com/users"
  val headers = Map(
    "Accept" -> "application/json",
    "Content-Type" -> "application/json",
  ).toList
  val data = newUser.asJson.noSpaces
  // NOTE: the json placeholder API just returns the input (on post request)
  Try(requests.post(url, headers = headers, data = data))
    .pipe(t => t.flatMap(res => raiseForStatusDebug(res)))
    .pipe(t =>
      t.flatMap(res =>
        decode[NewUser](res.text())
          .pipe(e => e.left.map(error => error.getCause()))
          .pipe(e => e.toTry)
      )
    )
}

def httpPost(): Unit = {
  val newUser = NewUser(id = 1, name = "Hiruzen Sarutobi")
  val created = createUser(newUser)
  val results = List(
    s"created: ${created}",
  )
  results.foreach(println)
}
