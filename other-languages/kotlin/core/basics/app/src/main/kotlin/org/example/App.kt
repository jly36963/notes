package org.example

import kotlinx.serialization.Serializable
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import java.io.File
import java.nio.file.Files
import java.nio.file.Paths
import java.util.UUID
import kotlin.io.path.Path
import kotlin.io.path.pathString
import java.util.Date;
import java.text.DateFormat;
import java.text.SimpleDateFormat;

// ---
// Main
// ---

fun main() {
    printSectionTitle("basic variables")
    basicVariables()

    printSectionTitle("basic booleans")
    basicBooleans()

    printSectionTitle("basic floats")
    basicFloats()

    printSectionTitle("basic ints")
    basicInts()

    printSectionTitle("basic strings")
    basicStrings()

    printSectionTitle("basic bytes")
    basicBytes()

    printSectionTitle("basic chars")
    basicChars()

    printSectionTitle("basic enums")
    basicEnums()

    printSectionTitle("basic reflection")
    basicReflection()

    printSectionTitle("basic conditionals")
    basicConditionals()

    printSectionTitle("basic when")
    basicWhen()

    printSectionTitle("basic arrays")
    basicArrays()

    printSectionTitle("basic arraylists")
    basicArrayLists()

    printSectionTitle("basic lists")
    basicLists()

    printSectionTitle("basic maps")
    basicMaps()

    printSectionTitle("basic sets")
    basicSets()

    printSectionTitle("basic generics")
    basicGenerics()

    printSectionTitle("basic files")
    basicFiles()

    printSectionTitle("basic files (IO)")
    basicFilesIO()

    printSectionTitle("basic system")
    basicSystem()

    printSectionTitle("basic runtime")
    basicRuntime()

    printSectionTitle("basic uuid")
    basicUUID()

    printSectionTitle("basic classes")
    basicClasses()

    printSectionTitle("basic data classes")
    basicDataClasses()

    printSectionTitle("basic date (java)")
    basicDateJava()

    printSectionTitle("basic async")
    basicAsync()

    printSectionTitle("basic coroutines")
    basicCoroutines()
}

// ---
// Utils
// ---

fun printSectionTitle(str: String) {
    println("\n" + str.uppercase() + "\n")
}

// ---
// Examples
// ---

fun basicVariables() {
    // `val` is immutable, `var` is mutable
    val str1 = "Where's the leak, ma'am?"
    var str2 = "Finland"
    str2 = str2 + "!"

    val results = arrayOf("str1: $str1", "str2: $str2")
    results.forEach { v -> println(v) }
}

fun basicBooleans() {
    val t = true
    val f = false

    val results =
        arrayOf(
            "t: $t",
            "f: $f",
            "t and t: ${t and t}",
            "t.not(): ${t.not()}",
            "t or f: ${t or f}",
            "t xor f: ${t xor f}",
        )

    results.forEach { v -> println(v) }
}

fun basicFloats() {
    // Float (f32) and Double (f64)
    // Default is Double
    val f1: Float = 3.14f
    val d1: Double = 3.14

    val results =
        arrayOf(
            "f1: $f1",
            "d1: $d1",
            "d1.div(2): ${d1.div(2)}",
            "d1.minus(2): ${d1.minus(2)}",
            "d1.plus(2): ${d1.plus(2)}",
            "d1.rem(2): ${d1.rem(2)}",
            "d1.times(2): ${d1.times(2)}",
            "d1.mod(2): ${d1.mod(2.0)}",
        )

    results.forEach { v -> println(v) }
}

fun basicInts() {
    // Byte (i8), Short (i16), Int (i32), Long (i64)
    // UByte, UShort, UInt, ULong
    // Default is Int

    val i1 = 2
    val i2 = 7

    val results =
        arrayOf(
            "i1: $i1",
            "i2: $i2",
            "i1.dec(): ${i1.dec()}",
            "i1.div(2): ${i1.div(2)}",
            "i1.inc(): ${i1.inc()}",
            "i1.minus(2): ${i1.minus(2)}",
            "i1.plus(2): ${i1.plus(2)}",
            "i1.rangeTo(i2): ${i1.rangeTo(i2)}",
            "i1.rem(2): ${i1.rem(2)}",
            "i1.times(2): ${i1.times(2)}",
            "i2.mod(i1): ${i2.mod(i1)}",
            "i1.until(i2): ${i1.until(i2)}",
        )

    results.forEach { v -> println(v) }
}

fun basicStrings() {
    val results =
        arrayOf(
            "\"Bar\" + \"nacles\": " + "Bar" + "nacles",
            "\"Quem são vocês?\".length: " + "Quem são vocês?".length,
            "\"Quem são vocês?\".count(): " + "Quem são vocês?".count(),
            "\"Quem são vocês?\".toByteArray().size: " + "Quem são vocês?".toByteArray().size,
            "\"too bad that didn't kill me\": " +
                "too bad that didn't kill me".replaceFirstChar { v -> v.uppercase() },
            "\"Not even Squidward's house\".contains(\"id\"): " +
                "Not even Squidward's house".contains("id"),
            "\"Help me boy or you're fired\".endsWith(\"fired\"): " +
                "Help me boy or you're fired".endsWith("fired"),
            "\"Yeah! E minor! All right! Yeah!\".first(): " +
                "Yeah! E minor! All right! Yeah!".first(),
            "\"Mr. Krabs, I have an idea!\".isEmpty(): " + "Mr. Krabs, I have an idea!".isEmpty(),
            "arrayOf(\"I\", \"wumbo\", \"you\", \"wumbo\").joinToString(\" \"): " +
                arrayOf("I", "wumbo", "you", "wumbo").joinToString(" "),
            "\"We're doomed\".last(): " + "We're doomed".last(),
            "\"I CAN'T SEE MY FOREHEAD\".lowercase(): " + "I CAN'T SEE MY FOREHEAD".lowercase(),
            "\"25\".padStart(4, '0'): " + "25".padStart(4, '0'),
            "\"I'm ready!  \".repeat(3): " + "I'm ready!  ".repeat(3),
            "\"25\".padEnd(4, '.'): " + "25".padEnd(4, '.'),
            "\"I'm ready!  \".replace(\"ready\", \"not ready\"): " +
                "I'm ready!  ".replace("ready", "not ready"),
            "\"People order our patties\".reversed(): " + "People order our patties".reversed(),
            "\"Kicking? I want to do some kicking!\".slice(11.rangeTo(14)): " +
                "Kicking? I want to do some kicking!".slice(11.rangeTo(14)),
            "\"Your ceiling is talking to me!\".split(\" \"): " +
                "Your ceiling is talking to me!".split(" "),
            "\"It's okay, take your time\".startsWith(\"I\"): " +
                "It's okay, take your time".startsWith("I"),
            "\"   This is a load of barnacles!   \".trim(): " +
                "   This is a load of barnacles!   ".trim(),
            "\"moar!\".uppercase(): " + "moar!".uppercase(),
        )

    results.forEach { v -> println(v) }
}

fun basicBytes() {
    // https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-byte/
    // https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-byte-array/

    val str = "Quem são vocês?"
    val bytes = str.toByteArray()

    val results =
        arrayOf(
            "str: $str",
            "str.toByteArray(): $str.toByteArray()",
            "bytes: $bytes",
            "bytes.size: ${bytes.size}",
            "bytes.get(0): ${bytes.get(0)}",
            "bytes.toString(Charsets.UTF_8): ${bytes.toString(Charsets.UTF_8)}",
        )

    results.forEach { v -> println(v) }
}

fun basicChars() {
    // https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-char/
    // https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-char-sequence/
}

fun basicEnums() {
    // https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-enum/
}

fun basicReflection() {
    val str = "Quem são vocês?"

    val results =
        arrayOf(
            "str: $str",
            "str::class: ${str::class}",
            "str::class.simpleName: ${str::class.simpleName}",
        )

    results.forEach { v -> println(v) }
}

fun basicResult() {
    // https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-result/
    // Also `Pair`
}

fun basicNull() {
    // https://kotlinlang.org/docs/null-safety.html#checking-for-null-in-conditions
}

fun basicConditionals() {
    val num = 24
    lateinit var res: String

    if (num == 0) {
        res = "zero"
    } else if (num in -1..Int.MIN_VALUE) {
        res = "negative"
    } else if (num in 1..Int.MAX_VALUE) {
        res = "positive"
    } else {
        throw Exception("Can't happen")
    }

    println("$num is $res")
}

fun basicWhen() {
    val num = 24
    val res: String =
        when (num) {
            0 -> "zero"
            in -1..Int.MIN_VALUE -> "negative"
            in 1..Int.MAX_VALUE -> "positive"
            else -> throw Exception("Can't happen")
        }
    println("$num is $res")
}

fun basicArrays() {
    val arr0 = arrayOf(2, 3, 4)
    val arr1 = arrayOf(1, *arr0, 5)

    val results =
        arrayOf(
            "arr1: ${arr1.contentToString()}",
            "arr1.size: ${arr1.size}",
            "arr1.get(0): ${arr1.get(0)}",
            "arr1.all { n -> n > 0}: ${arr1.all { n -> n > 0}}",
            "arr1.any { n -> n > 3}: ${arr1.any { n -> n > 3}}",
            "arr1.average(): ${arr1.average()}",
            "arr1.component1(): ${arr1.component1()}",
            "arr1.contains(5): ${arr1.contains(5)}",
            "arr1.contentEquals(arr1): ${arr1.contentEquals(arr1)}",
            "arr1.count(): ${arr1.count()}",
            "arr1.distinct(): ${arr1.distinct()}",
            "arr1.drop(1): ${arr1.drop(1)}",
            "arr1.elementAtOrElse(0, { _ -> 0}): ${arr1.elementAtOrElse(0, { _ -> 0})}",
            "arr1.elementAtOrNull(10): ${arr1.elementAtOrNull(10)}",
            "arr1.filter { n -> n % 2 == 0}: ${arr1.filter { n -> n % 2 == 0}}",
            "arr1.filterNot { n -> n % 2 == 0}: ${arr1.filterNot { n -> n % 2 == 0}}",
            "arr1.filterNotNull(): ${arr1.filterNotNull()}",
            "arr1.find { n -> n % 2 == 0}: ${arr1.find { n -> n % 2 == 0}}",
            "arr1.findLast { n -> n % 2 == 0}: ${arr1.findLast { n -> n % 2 == 0}}",
            "arr1.first(): ${arr1.first()}",
            "arr1.firstOrNull(): ${arr1.firstOrNull()}",
            "arr1.fold(0, {acc, curr -> acc + curr}): ${arr1.fold(0, {acc, curr -> acc + curr})}",
            "arr1.foldRight(0, {acc, curr -> acc + curr}): ${arr1.foldRight(0, {acc, curr -> acc + curr})}",
            // arr1.forEach { v -> println(v) }
            "arr1.getOrElse(0, {_ -> 0}): ${arr1.getOrElse(0, {_ -> 0})}",
            "arr1.getOrNull(0): ${arr1.getOrNull(0)}",
            "arr1.indexOf(5): ${arr1.indexOf(5)}",
            "arr1.indexOfFirst { n -> n > 3}: ${arr1.indexOfFirst { n -> n > 3}}",
            "arr1.indexOfLast { n -> n > 3}: ${arr1.indexOfLast { n -> n > 3}}",
            "arr1.intersect(arr0.asIterable()): ${arr1.intersect(arr0.asIterable())}",
            "arr1.isArrayOf<Int>(): ${arr1.isArrayOf<Int>()}",
            "arr1.isEmpty(): ${arr1.isEmpty()}",
            "arr1.isNotEmpty(): ${arr1.isNotEmpty()}",
            "arr1.isNullOrEmpty(): ${arr1.isNullOrEmpty()}",
            "arr1.last(): ${arr1.last()}",
            "arr1.lastOrNull(): ${arr1.lastOrNull()}",
            "arr1.map { n -> n * 2}: ${arr1.map { n -> n * 2}}",
            "arr1.mapNotNull { n -> n * 2}: ${arr1.mapNotNull { n -> n * 2}}",
            "arr1.maxOrNull(): ${arr1.maxOrNull()}",
            "arr1.minOrNull(): ${arr1.minOrNull()}",
            "arr1.partition { n -> n % 2 == 0}: ${arr1.partition { n -> n % 2 == 0}}",
            "arr1.random(): ${arr1.random()}",
            "arr1.randomOrNull(): ${arr1.randomOrNull()}",
            "arr1.reduce {acc, curr -> acc + curr}: ${arr1.reduce {acc, curr -> acc + curr}}",
            "arr1.reduceOrNull {acc, curr -> acc + curr}: ${arr1.reduceOrNull {acc, curr -> acc + curr}}",
            "arr1.reversed(): ${arr1.reversed()}",
            "arr1.scan (0, {acc, curr -> acc + curr}): ${arr1.scan(0, {acc, curr -> acc + curr})}",
            "arr1.slice(1..3): ${arr1.slice(1..3)}",
            "arr1.sorted(): ${arr1.sorted()}",
            "arr1.sum(): ${arr1.sum()}",
            "arr1.take(3): ${arr1.take(3)}",
            "arr1.toList(): ${arr1.toList()}",
            "arr1.toSet(): ${arr1.toSet()}",
            "arr1.union(arrayOf(5, 6).asIterable()): ${arr1.union(arrayOf(5, 6).asIterable())}",
            "arr1.zip(arr1): ${arr1.zip(arr1)}",
        )

    results.forEach { v -> println(v) }
}

fun basicArrayLists() {
    // https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-array-list/
}

fun basicLists() {
    val l0 = listOf(2, 3, 4)
    val l1 = listOf(1, *l0.toTypedArray(), 5)

    val results =
        arrayOf(
            "l1: $l1",
            "l1.size: ${l1.size}",
            // Methods
            "l1.get(0): ${l1.get(0)}",
            "l1.all { n -> n > 0}: ${l1.all { n -> n > 0}}",
            "l1.any { n -> n > 3}: ${l1.any { n -> n > 3}}",
            "l1.average(): ${l1.average()}",
            "l1.component1(): ${l1.component1()}",
            "l1.chunked(2): ${l1.chunked(2)}",
            "l1.contains(5): ${l1.contains(5)}",
            "l1.count(): ${l1.count()}",
            "l1.distinct(): ${l1.distinct()}",
            "l1.drop(1): ${l1.drop(1)}",
            "l1.elementAtOrElse(0, { _ -> 0}): ${l1.elementAtOrElse(0, { _ -> 0})}",
            "l1.elementAtOrNull(10): ${l1.elementAtOrNull(10)}",
            "l1.filter { n -> n % 2 == 0}: ${l1.filter { n -> n % 2 == 0}}",
            "l1.filterNot { n -> n % 2 == 0}: ${l1.filterNot { n -> n % 2 == 0}}",
            "l1.filterNotNull(): ${l1.filterNotNull()}",
            "l1.find { n -> n % 2 == 0}: ${l1.find { n -> n % 2 == 0}}",
            "l1.findLast { n -> n % 2 == 0}: ${l1.findLast { n -> n % 2 == 0}}",
            "l1.first(): ${l1.first()}",
            "l1.firstOrNull(): ${l1.firstOrNull()}",
            "l1.fold(0, {acc, curr -> acc + curr}): ${l1.fold(0, {acc, curr -> acc + curr})}",
            "l1.foldRight(0, {acc, curr -> acc + curr}): ${l1.foldRight(0, {acc, curr -> acc + curr})}",
            // l1.forEach { v -> println(v) }
            "l1.getOrElse(0, {_ -> 0}): ${l1.getOrElse(0, {_ -> 0})}",
            "l1.getOrNull(0): ${l1.getOrNull(0)}",
            "l1.indexOf(5): ${l1.indexOf(5)}",
            "l1.indexOfFirst { n -> n > 3}: ${l1.indexOfFirst { n -> n > 3}}",
            "l1.indexOfLast { n -> n > 3}: ${l1.indexOfLast { n -> n > 3}}",
            "l1.intersect(l0.asIterable()): ${l1.intersect(l0.asIterable())}",
            "l1.isEmpty(): ${l1.isEmpty()}",
            "l1.isNotEmpty(): ${l1.isNotEmpty()}",
            "l1.isNullOrEmpty(): ${l1.isNullOrEmpty()}",
            "l1.last(): ${l1.last()}",
            "l1.lastOrNull(): ${l1.lastOrNull()}",
            "l1.map { n -> n * 2}: ${l1.map { n -> n * 2}}",
            "l1.mapNotNull { n -> n * 2}: ${l1.mapNotNull { n -> n * 2}}",
            "l1.maxOrNull(): ${l1.maxOrNull()}",
            "l1.minOrNull(): ${l1.minOrNull()}",
            "l1.partition { n -> n % 2 == 0}: ${l1.partition { n -> n % 2 == 0}}",
            "l1.random(): ${l1.random()}",
            "l1.randomOrNull(): ${l1.randomOrNull()}",
            "l1.reduce {acc, curr -> acc + curr}: ${l1.reduce {acc, curr -> acc + curr}}",
            "l1.reduceOrNull {acc, curr -> acc + curr}: ${l1.reduceOrNull {acc, curr -> acc + curr}}",
            "l1.reversed(): ${l1.reversed()}",
            "l1.scan (0, {acc, curr -> acc + curr}): ${l1.scan(0, {acc, curr -> acc + curr})}",
            "l1.slice(1..3): ${l1.slice(1..3)}",
            "l1.sorted(): ${l1.sorted()}",
            "l1.sum(): ${l1.sum()}",
            "l1.take(3): ${l1.take(3)}",
            "l1.toList(): ${l1.toList()}",
            "l1.toSet(): ${l1.toSet()}",
            "l1.union(arrayOf(5, 6).asIterable()): ${l1.union(arrayOf(5, 6).asIterable())}",
            "l1.zip(l1): ${l1.zip(l1)}",
        )
    results.forEach { v -> println(v) }
}

fun basicMaps() {
    // https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/
    // https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-hash-map/

    val map1 = mapOf("a" to 1, "b" to 2, "c" to 3)
    val map2 = mapOf("d" to 4, "e" to 5)

    val results =
        arrayOf(
            "map1: $map1",
            "map2: $map2",
            "map1.entries: ${map1.entries}",
            "map1.keys: ${map1.keys}",
            "map1.size: ${map1.size}",
            "map1.values: ${map1.values}",
            // Methods
            "map1.all {e -> e.value > 0}: ${map1.all {e -> e.value > 0}}",
            "map1.any {e -> e.value > 0}: ${map1.any {e -> e.value > 0}}",
            "map1.contains(\"a\"): ${map1.contains("a")}",
            "map1.containsKey(\"a\"): ${map1.containsKey("a")}",
            "map1.containsValue(3): ${map1.containsValue(3)}",
            "map1.count(): ${map1.count()}",
            "map1.filter {e -> e.value > 0}: ${map1.filter {e -> e.value > 0}}",
            "map1.filterKeys {k -> k != \"c\"}: ${map1.filterKeys {k -> k != "c"}}",
            // "map1.forEach {e -> println(e)}: ${map1.forEach {e -> println(e)}}",
            "map1.get(\"a\"): ${map1.get("a")}",
            "map1.getOrDefault(\"a\", 0): ${map1.getOrDefault("a", 0)}",
            "map1.isEmpty(): ${map1.isEmpty()}",
            "map1.isNotEmpty(): ${map1.isNotEmpty()}",
            "map1.mapKeys {e -> e.key.uppercase()}: ${map1.mapKeys {e -> e.key.uppercase()}}",
            "map1.mapValues {e -> e.value * 2}: ${map1.mapValues {e -> e.value * 2}}",
        )

    results.forEach { v -> println(v) }
}

fun basicSets() {
    val set1 = setOf(1, 2, 3)
    val set2 = setOf(2, 3, 4)

    val results =
        arrayOf(
            "set1: $set1",
            "set2: $set2",
            "set1.size: ${set1.size}",
            // Methods
            "set1.all { n -> n > 0}: ${set1.all { n -> n > 0}}",
            "set1.any { n -> n > 2}: ${set1.any { n -> n > 2}}",
            "set1.contains(1): ${set1.contains(1)}",
            "set1.containsAll(listOf(1,2)): ${set1.containsAll(listOf(1,2))}",
            "set1.count(): ${set1.count()}",
            "set1.filter { n -> n > 2}: ${set1.filter { n -> n > 2}}",
            "set1.isEmpty(): ${set1.isEmpty()}",
            "set1.intersect(set2): ${set1.intersect(set2)}",
            "set1.isNotEmpty(): ${set1.isNotEmpty()}",
            "set1.minus(set2): ${set1.minus(set2)}",
            "set1.random(): ${set1.random()}",
            "set1.randomOrNull(): ${set1.randomOrNull()}",
            "set1.union(set2): ${set1.union(set2)}",
            "(set1 - set2) union (set2 - set1): ${(set1 - set2) union (set2 - set1)}",
        )

    results.forEach { v -> println(v) }
}

fun basicGenerics() {
    // https://kotlinlang.org/docs/generics.html#declaration-site-variance
}

fun getCurrentPath(): String = Paths.get("").toAbsolutePath().toString()

fun basicFiles() {
    val dir1 = "./src"
    val filename1 = "./README.md"
    val file1 = File(filename1)
    val path1 = Path("./src")

    val results =
        arrayOf(
            "dir1: $dir1",
            "filename1: $filename1",
            // File
            "file1: $file1",
            "file1.extension: ${file1.extension}",
            "file1.isRooted: ${file1.isRooted}",
            "file1.nameWithoutExtension: ${file1.nameWithoutExtension}",
            "getCurrentPath(): ${getCurrentPath()}",
            // Path
            "path1: $path1",
            "path1.getFileName(): ${path1.getFileName()}",
            "path1.getParent(): ${path1.getParent()}",
            "path1.normalize(): ${path1.normalize()}",
            "path1.toFile(): ${path1.toFile()}",
            "path1.toString(): $path1",
        )

    results.forEach { v -> println(v) }
}

fun basicFilesIO() {
    val dataDir = Paths.get(".", "data")
    val inputDir = Paths.get(dataDir.pathString, "input")
    val outputDir = Paths.get(dataDir.pathString, "output")
    val file1Name = "report.txt"
    val file1Path = Paths.get(inputDir.pathString, file1Name)
    val file1CopyPath = Paths.get(outputDir.pathString, file1Name)

    val results =
        arrayOf(
            "dataDir: $dataDir",
            "inputDir: $inputDir",
            "outputDir: $outputDir",
            "file1Name: $file1Name",
            "file1Path: $file1Path",
            "file1CopyPath: $file1CopyPath",
        )

    results.forEach { v -> println(v) }

    File(inputDir.pathString).mkdirs()
    File(outputDir.pathString).mkdir()
    Files.createFile(file1Path)
    File(file1Path.pathString).writeText("Who you calling pinhead?")
    File(file1Path.pathString).writeBytes("Who you calling pinhead?".toByteArray())
    println("File(file1Path.pathString).readText()")
    println(File(file1Path.pathString).readText())
    println("File(file1Path.pathString).readBytes().toString(Charsets.UTF_8)")
    println(File(file1Path.pathString).readBytes().toString(Charsets.UTF_8))
    File(file1Path.pathString).copyTo(File(file1CopyPath.pathString))
    File(file1CopyPath.pathString).appendText(" I can't see my forehead.")
    println("File(file1CopyPath.pathString).readText()")
    println(File(file1CopyPath.pathString).readText())
    File(file1CopyPath.pathString).delete()
    File(file1Path.pathString).delete()
    File(outputDir.pathString).delete()
    File(inputDir.pathString).delete()
    File(dataDir.pathString).delete()
}

fun basicSystem() {
  // https://docs.oracle.com/javase/8/docs/api/java/lang/System.html
    val results =
        arrayOf(
            "System.getProperty(\"os.name\"): ${System.getProperty("os.name")}",
            "System.getenv(\"HOME\"): ${System.getenv("HOME")}",
            "System.getenv().get(\"USER\"): ${System.getenv().get("USER")}",
        )

    results.forEach { v -> println(v) }
}

fun basicRuntime() {
  // https://docs.oracle.com/javase/8/docs/api/java/lang/Runtime.html
}

fun basicUUID() {
    val uuid = UUID.randomUUID()
    val results =
        arrayOf(
            "uuid: $uuid",
            "UUID.fromString(\"92a5e414-c88c-44ff-8877-2bd8c2c4751d\"): ${UUID.fromString("92a5e414-c88c-44ff-8877-2bd8c2c4751d")}",
            "uuid.toString(): $uuid",
            "uuid.variant(): ${uuid.variant()}",
            "uuid.version(): ${uuid.version()}",
        )

    results.forEach { v -> println(v) }
}

@Serializable
class Ninja(
    val firstName: String,
    val lastName: String,
    val age: Int,
) {
    override fun toString(): String = "Ninja(firstName=$firstName, lastName=$lastName, age=$age)"

    fun greet() = println("Hello! My name is $firstName $lastName.")
}

fun basicClasses() {
    val ninja = Ninja(firstName = "Kakashi", lastName = "Hatake", age = 27)
    ninja.greet()
    val json = Json.encodeToString(ninja)
    val results =
        arrayOf(
            "ninja: $ninja",
            "json: $json",
            "Json.encodeToString(ninja): ${Json.encodeToString(ninja)}",
            "Json.decodeFromString<Ninja>(json): ${Json.decodeFromString<Ninja>(json)}",
        )

    results.forEach { v -> println(v) }
}

@Serializable
data class Shinobi(
    val firstName: String,
    val lastName: String,
    val age: Int,
) {
    fun greet() = println("Hello! My name is $firstName $lastName.")
}

fun basicDataClasses() {
    val kakashi = Shinobi(firstName = "Kakashi", lastName = "Hatake", age = 27)
    kakashi.greet()
    val json = Json.encodeToString(kakashi)
    val results =
        arrayOf(
            "kakashi: $kakashi",
            "json: $json",
            "Json.encodeToString(kakashi): ${Json.encodeToString(kakashi)}",
            "Json.decodeFromString<Shinobi>(json): ${Json.decodeFromString<Shinobi>(json)}",
        )

    results.forEach { v -> println(v) }
}

fun basicDateJava() {
    val date = Date()
    val fmt = SimpleDateFormat("yyyy-MM-dd")

    val results =
        arrayOf(
            "date: $date",
            "fmt: $fmt",
            "fmt.format(date): ${fmt.format(date)}",

        )

    results.forEach { v -> println(v) }
}

fun basicAsync() {
    // https://kotlinlang.org/docs/async-programming.html
}

fun basicCoroutines() {
    // https://kotlinlang.org/docs/coroutines-overview.html
}
