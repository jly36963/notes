//> using scala 3.7.4
//> using dep "com.lihaoyi::upickle:4.4.2"

import upickle.default.ReadWriter
import upickle.default.read
import upickle.default.write

case class Ninja(name: String, age: Int, village: String) derives ReadWriter

@main
def runExamples(): Unit = {
  val ninja = Ninja("Kakashi", 30, "Leaf")
  println(ninja)
  val str: String = write(ninja, indent = 2)
  println(str)
  val ninja2 = read[Ninja](str)
  println(ninja2)
}
