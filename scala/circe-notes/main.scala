//> using scala 3.7.4
//> using dep "io.circe::circe-core:0.14.15"
//> using dep "io.circe::circe-parser:0.14.15"
//> using dep "io.circe::circe-generic:0.14.15"

import io.circe.*
import io.circe.generic.auto.*
import io.circe.parser.*
import io.circe.syntax.*

case class Ninja(name: String, age: Int, village: String)

@main
def runExamples(): Unit = {
  val ninja = Ninja("Kakashi", 30, "Leaf")
  println(ninja)
  val str = ninja.asJson.noSpaces
  println(str)
  val ninja2 = decode[Ninja](str)
  println(ninja2)
}
