import scala.collection.mutable.Map
import java.io.IOException

// ---
// scala
// ---

// compile -- `scalac ./path/to/File.scala`
// run -- `scala ./path/to/File.scala`
// janky shortcut `find . -name "*.scala" -print | xargs scalac `

// ---
// comments
// ---

// single line
/* multiline */

/**
*
* documentation comment
*
**/

// ---
// hello world
// ---

// programs must have a singleton to run.
    // singleton -- 'object' keyword. entry point for the program.
    // singletons objects must have a main()
    // if class and singleton have same name, they are companions.

class Hello {
    def sayHello(): Unit = {
        println("Hello World");
    }
}

object Hello {
    def main(args: Array[String]): Unit = {
        var hello = new Hello();
        hello.sayHello();
    }
}

// ---
// hello world (2)
// ---

// traits (extends App)
object Hello extends App {
  println("Hello, world!")
}

// ---
// types
// ---

def basicTypes(): Unit = {
    // casting is unidirectional (byte > short > int > long > float > double)
    // type inference -- if type not provided, Scala will assign type values

    var bool1: Boolean = true; // Boolean -- True or False
    var byte1: Byte = 126; // Byte -- integer (~ 128)
    var short1: Short = 45; // Short -- integer (~ 2^15)
    var int1: Int = 3; // Int -- integer (~ 2^31)
    var long1: Long = 2351325123L;// Long -- integer (~ 2^64)
    var float1: Float = 2.45673f; // Float -- decimal (7 decimal places)
    var char1: Char = 'A'; // Char -- single character (single quotes)
    var double1: Double = 2.93846523d; // Double  -- decimal (15 decimal places)
    var string1: String = "Hello there!"; // String -- sequence of characters (double quotes)
    // Unit -- analogous to java's "void". if a function returns no value, "Unit" is the return type
    // Nothing
    // Any
    // Anyval
    // Anyref
}

// ---
// operators
// ---

/*
math: + - * / % **
comparison (relational): == != > < >= <=
logical: && || !
assignment: = += -= *= /= %= **= <<= >>= &= |= ^=
bitwise: & | ^ << >> ~

*/

// ---
// variables
// ---

def basicVariables(): Unit = {
    // mutable/immutable
    var s1: String = "Hello!"; // mutable
    val s1: String = "Hello!"; // immutable

    // mutliple assignment
    var (x, y, z) = (0, 1.1, "foo");

    // scope
    // fields -- normal variables, method parameters -- params, local variables -- method variables

}

// ---
// strings
// ---

def basicStrings() : Unit = {
    var s1: String = "Hello!";
    var s2: String = "!";

    // methods and attributes
    println(s1.capitalize()); // capitalize first letter
    s1.concat(s2); // return concatenated string (also `s1 + s2`)
    s1.isEmpty() // return boolean (is string empty)
    s1.length(); // return length of string
    s1.trim(); // return string with whitespace removed (from ends)
    s1.replace("Hello", "Hi"); // replace all occurences of arg0 with arg1
    s1.toLowerCase();
    s1.toUpperCase();

    // operators
    s1*5 // returns string concatenated 5 times
    s1 ++ " How are you?" // concatenates

    // change type
    var num: String = "123";
    num.toInt;
    num.toFloat;
    num.toDouble;
    s1.toList; // returns string as list of characters
}

// ---
// format
// ---

def basicFormat(): Unit = {
    var name: String = "Kakashi";
    var s1: String = "Hey there, %s".format(name);
    println(s1);
}


// ---
// string interpolation (uses StringContext under the hood)
// ---

def basicStringInterpolation(): Unit = {
    // s
    var name: String = "Kakashi";
    var s1: String = s"Hey there, ${name}";
    println(s1);

    // f
    var name: String = "Kakashi";
    var s1: String = f"Hey there, $name%s!";
    println(s1);
}

// ---
// console (Console.println())
// ---

object Printer {
    def main(args: Array[String]): Unit = {
        println("Hello"); // adds newline
        print("Hello"); // doesn't add newline
        printf("Age = %d", 24); // format
    }
}

// ---
// numbers and math
// ---

def basicNumbers(): Unit = {

    // range (uniformly spaced integers) (useful for iterations)
    var range1 = Range(0, 10, 1); // 0 - 9
    var range2 = 0 until 10 by 1; // 0 - 9
    var range3 = range1.inclusive; // 0 - 10
}

// ---
// conditional logic
// ---

def basicConditionals(): Unit = {
    // if
    var x: Int = 0;
    if (x < 0) {
        println("x is negative.");
    } else if (x > 0) {
        println("x is positive.");
    } else if (x == 0) {
        println("x is 0.");
    } else {
        println("wtf.");
    }

    // ternary operator
    var a: Int = 3;
    var even: Boolean = if (a % 2 == 0) true else false;
    println(even);

    // while
    var x: Int = 0;
    while (x <= 5) {
        println(x);
        x+=1;
    }

    // for loop ('to' is inclusive, 'until' is exclusive)
    for (x <- 0 to 7) {
        println(x)
    }

    // multiple for loop (outer; inner)
    for (x <- 0 to 3; y <- 0 to 3){
        println(s"x: ${x}, y: ${y}");
    }

    // for loop (collection)
    var ranklist = List(1,2,3,4,5,6,7,8,9,10);
    for (rank <- ranklist) {
        println(s"rank: ${rank}");
    }

    // for loop (collection + condition)
    var ranklist = List(1,2,3,4,5,6,7,8,9,10);
    for (rank <- ranklist if rank % 2 == 0) {
        println(s"rank: ${rank}");
    }

    // for loop (yield)
    var ranklist = List(1,2,3,4,5,6,7,8,9,10);
    var ranks = for ( rank <- ranklist if rank % 2 == 0 ) yield rank; // use curly braces??
    for (rank <- ranks) {
        println(s"rank: ${rank}");
    }
}

// // ---
// // code block (block scope)
// // ---

// def basicBlocks() : Unit {
//     // last line of expression determines value/type
//     val name = {
//         val firstname = "Kakashi"; // only accesible in this code block
//         val lastname = "Hatake"; // only accesible in this code block
//         firstname + " " + lastname;
//     }
//     println(name) // Kakashi Hatake
// }

// ---
// functions
// ---

// function output type can be inferred, except in recursive functions.
// define function (inputs, output type, function body)
def addFunction(a:Int, b:Int) : Int = {
    var sum: Int = a + b; // declare
    return sum; // return
}

def basicFunctions(): Unit = {
    // call function
    println(addFunction(5,3)) // 8
}

// ---
// arrow functions
// ---

def basicArrowFunctions(): Unit = {
    var a1 = Array(1,2,3);
    // one line
    a1.foreach((x) => println(x));
    // multiline
    a1.foreach((x) => {
        println(x);
    });
    // single argument(wildcard)
    a1.foreach(println(_));
}

// ---
// anonymous functions (and lambda expressions)
// ---

def basicAnonymousFunctions(): Unit = {

    // anonymous
    var add = (a: Int,b: Int) => a + b;
    println(add(3,4));

    // anonymous (wildcard syntax)
    var add = (_: Int) + (_: Int)
    println(add(3,4));

    // no params
    var hello = () => println("Hello");
    hello();

    // no params (multiline)
    var hello = () => {
        println("Hello!");
        println("How are you?");
    };
    hello();

    // string interpolation
    var fullNameGreeting = (first: String, middle: String, last: String) => {
        var fullName: String = s"Hello! My name is ${first} ${middle} ${last}.";
        println(fullName);
    }
    fullNameGreeting("James", "Landon", "Yarrington");
}

// ---
// recursive function
// ---

def basicRecursiveFunctions(): Unit = {
    // better than while loops
    // use tail-recursion to avoid memory issues (stack overflow)
    // return type must be specified

    // factorial
    def factorial(n: Int): Int = {
        if (n <= 0) 1
        else n * factorial(n-1)
    }
    println(factorial(5))

    // fibonacci
    def fibonacci(n: Int): Int = {
        if (n <= 2) 1
        else fibonacci(n-1) + fibonacci (n-2)
    }
    println(fibonacci(4))
    // 4, 32, 211, 111
}


// ---
// tail-recursion
// ---

def basicTailRecursion(): Unit = {

    // tail recursion -- when the last action is the recursive function calling itself.
    // "@tailrec" is an explicit way to tell the compiler that it is a tail-recursive function

    // repeater (concatenate) (with default parameter)
    def repeater(str: String, n: Int, accumulator: String = ""): String = {
        if (n <= 0) accumulator;
        else repeater(str, n - 1, s"${str} " + accumulator);
    }
    println(repeater("Kakashi", 10));

    // prime
    def prime(n: Int): Boolean = {
        def isPrimeUntil(t: Int, isStillPrime: Boolean = true): Boolean = {
            if (!isStillPrime) false;
            else if (t <= 1) true;
            else isPrimeUntil(t - 1, n % t != 0 && isStillPrime);
        }
        isPrimeUntil(n / 2);
    }
    println(prime(7));

    // factorial
    def factorial(n: Int): BigInt = {
        def factorialHelper(x: Int, accumulator: BigInt): BigInt = {
            if (x <= 1) accumulator;
            else factorialHelper(x - 1, x * accumulator);
        }
        factorialHelper(n, 1);
    }
    println(factorial(5000));

    // fibonacci
    def fib(n: Int): Int = {
        def fibHelper(i: Int, acc1: Int, acc2: Int): Int = {
            if(i >= n) acc1;
            else fibHelper(i + 1, acc1 + acc2, acc1)
        }
        if (n <= 2) 1
        else fibHelper(2, 1, 1) // start index == 2, acc1 = 1, acc2 = 2
    }
    println(fib(27));
}


// ---
// higher order functions (functions that us functions as params)
// ---

def basicHOF(): Unit = {
    var numbers = List(1,2,3);
    var doubler = (x: Int) => 2 * x;
    var result = numbers.map(x => doubler(x));
    println(result);
}

// ---
// named args
// ---

def basicNamedArgs(): Unit = {
    var fullNameGreeting = (first: String, middle: String, last: String) => {
        var fullName: String = s"Hello! My name is ${first} ${middle} ${last}";
        println(fullName);
    }
    fullnameGreeting(first="James", middle="Landon", last="Yarrington");
}

// ---
// currying functions (like redux connect)
// ---

def basicFunctionCurrying(): Unit = {
    // without currying
    def add(x: Int, y: Int) = x + y;
    println(add(20, 19));

    // with currying (function that returns function)
    def add2(a: Int) = (b: Int) => a + b;
    println(add2(20)(19));

    // partially applied curried function
    def add2(a: Int) = (b: Int) => a + b;
    val sum = add2(29); // apply first argument (returns function)
    println(sum(5)); // apply second argument (returns completed function output)

    // currying (syntax 2) (notice the '_')
    def add2(a: Int) (b: Int) = a + b;
    println(add2(29)(5)); // normal
    val sum=add2(29)_; // partially applied (1)
    println(sum(5)); // partially applied (2)
}

// ---
// varargs (variable length arguments) (doesn't work with anonymous functions)
// ---

def addAll(numbers: Int*) : Int = {
    var result  = 0;
    for (n <- numbers) {
        result += n;
    }
    return result;
}

def basicVarArgs() : Unit = {
    println(addAll(1));
    println(addAll(1,2));
    println(addAll(1,2,3));
    println(addAll(1,2,3,4));
}


// ---
// other function topics
// ---

// named arguments
    // https://www.geeksforgeeks.org/scala-named-arguments/
// closures
    // https://www.geeksforgeeks.org/scala-closures/
// recursion
    // https://alvinalexander.com/scala/scala-recursion-examples-recursive-programming
    // https://alvinalexander.com/scala/fp-book/tail-recursive-algorithms
// overloading (polymorphism)
    // https://www.geeksforgeeks.org/method-overloading-in-scala/
// call by name functions
    // https://www.geeksforgeeks.org/scala-functions-call-by-name/
// partially applied functions
    // https://www.geeksforgeeks.org/scala-partially-applied-functions/

// ---
// collections
// ---

// strings
// arrays
// vectors
// lists
// maps
// sets
// tuples
// options

// ---
// lists
// ---

def basicLists(): Unit = {
    // Lists are immutable. for mutable, use ListBuffers
    // https://www.geeksforgeeks.org/scala-listbuffer/

    // syntax 1
    var l1: List[String] = List("Kakashi", "Iruka", "Konohamaru", "Yamato", "Itachi");
    println(l1);
    // syntax 2
    var l2 = List("Kakashi", "Iruka", "Konohamaru", "Yamato", "Itachi");
    println(l2);
    // 2d list
    var l3: List[List[Int]] = List(
        List(1, 0, 0),
        List(0, 1, 0),
        List(0, 0, 1)
    );
    println(l3);
    // fill (uniform list)
    var l4 = List.fill(3)("Hello");
    println(l4);

    // operators
    l1 ++ l2; // return concatenated list
    l1 :+ "Hiruzen"; // return list with item appended
    "Hiruzen" +: l1; // return list with item prepended
    l1 :: "Hiruzen"; // return list with item prepended
    l1 ::: l2; // return list with elements from both

    // methods and attributes
    l1.contains("Kakashi"); // returns boolean (list contains argument)
    l1.count((item) => item.length > 6) // return number of elements that satisfy predicate
    l1.distinct; // returns list with duplicates removed
    l1.filter(_.length > 6); // returns list with items that satisfy predicate (wildcard)
    l1.filter((item) => item.length > 6); // returns list with items that satisfy predicate
    l1.filterNot((item) => item.length > 6); // returns list with items that don't satisfy predicate
    l1.find((item) => item == "Kakashi"); // returns first match (if any)
    l1.foreach((item) => println(item)); // apply function to each element
    l1.head; // returns first element
    l1.indexOf("Konohamaru"); // returns index of first match. (no match, returns -1)
    l1.isEmpty; // returns boolean (is empty)
    l1.last; // returns last element
    l1.length; // returns length
    l1.map((item) => item.toUpperCase());
    l1.max; // return element with greatest value
    l1.reverse; // returns list in reverse order
    l1.sorted; // return sorted list
    l1.size; // returns length

    // math
    var nums = List(1,2,3,4,5);
    nums.product;
    nums.sum;
    nums.max;
    nums.min;
}

// ---
// maps (key/value)
// ---

def basicMaps(): Unit = {
    // immutable map
    val m1 = Map("Name" -> "Kakashi", "Age" -> 49, "isAwesome" -> true);
    // mutable map
    val m2 = Map("Name" -> "Kakashi", "Age" -> 49, "isAwesome" -> true);
    // access key
    val name = m1("Name");
    println(name);
    // add key
    m1 += ("Jutsu" -> "Chidori");
    // remove key
    m1 -= "Jutsu";
    // update element
    m1("Name") = "Kaka Sensei";
    // for loop
    for ((k,v) <- m1) {
        println(s"k: ${k}, v: ${v}");
    }
    // foreach
    m1.foreach((item) => println(s"k: ${item._1}, v: ${item._2}"));
    m1.foreach({case (key, value) => println(s"k: ${key}, v: ${value}")});

    // operators
    m1 ++ Map("Name" -> "Kaka Sensei"); // returns concatenated map (later k/v override older ones)

    // methods and attributes
    m1.contains("Name"); // returns boolean (does key exist)
    m1.count((item) => item._1 == "Name"); // return number of elements that satisfy predicate
    m1.filter((item) => item._1 == "Name"); // return map with only the elements that satisfy predicate
    m1.keys; // return keys (as collection)
    m1.size; // size of collection
    m1.values; // return values (as collection)
}

// ---
// arrays
// ---

def basicArrays(): Unit = {
    // collection of mutable values, fixed size, elements of same type. (use ArrayBuffer for changeable size)
    // arrays can be generic (Array[T])
    // compatible with sequences (Array[T] can be passed where Seq[T] is required)
    // arrays can be multi-dimensional

    var jonin = Array("Kakashi", "Iruka", "Konohamaru", "Yamato", "Itachi", "Gaara");
    // for loop
    for (j <- jonin) {
        println(j);
    }
    // foreach
    jonin.foreach((j) => println(j));
    // update
    jonin(0) = "Kaka Sensei";
    // methods and attributes
    a1.contains("Kakashi"); // returns boolean (array contains argument)
    a1.count((item) => item.length > 6) // return number of elements that satisfy predicate
    a1.distinct; // returns array with duplicates removed
    a1.filter(_.length > 6); // returns array with items that satisfy predicate (wildcard)
    a1.filter((item) => item.length > 6); // returns array with items that satisfy predicate
    a1.filterNot((item) => item.length > 6); // returns array with items that don't satisfy predicate
    a1.find((item) => item == "Kakashi"); // returns first match (if any)
    a1.foreach((item) => println(item)); // apply function to each element
    a1.head; // returns first element
    a1.indexOf("Konohamaru"); // returns index of first match. (no match, returns -1)
    a1.isEmpty; // returns boolean (is empty)
    a1.last; // returns last element
    a1.length;
    a1.map((item) => item.toUpperCase());
    a1.max; // return element with greatest value
    a1.reverse; // returns array in reverse order
    a1.sorted; // return sorted array
    a1.size;
    // operators
    a1 ++ a2; // returns concatenated array (elements from both)
    a1 :+ "Hiruzen"; // return array with item appended
    "Hiruzen" +: a1; // return array with item prepended
    a1 ::: a2; // return array with elements from both
}


// ---
// vectors
// ---

def basicVectors(): Unit = {
    // the go-to immutable sequence (as of scala 2.8)
    val v1 = Vector("Kakashi", "Iruka", "Konohamaru");
    v1(0); // return first element of vector
    val v2 = v1.updated(0, "Kaka Sensei"); // update value (assign to new variable)

    // operators
    v1 ++ v2; // returns concatenated vector (elements from both)
    v1 :+ "Hiruzen"; // return vector with appended element
    "Hiruzen" +: v1; // return vector with prepended element

    // methods
    v1.contains("Kakashi"); // returns boolean (vector contains argument)
    v1.count((item) => item.length > 6) // return number of elements that satisfy predicate
    v1.distinct; // returns vector with duplicates removed
    v1.filter(_.length > 6); // returns vector with items that satisfy predicate (wildcard)
    v1.filter((item) => item.length > 6); // returns vector with items that satisfy predicate
    v1.filterNot((item) => item.length > 6); // returns vector with items that don't satisfy predicate
    v1.find((item) => item == "Kakashi"); // returns first match (if any)
    v1.foreach((item) => println(item)); // apply function to each element
    v1.head; // returns first element
    v1.indexOf("Konohamaru"); // returns index of first match. (no match, returns -1)
    v1.isEmpty; // returns boolean (is empty)
    v1.last; // returns last element
    v1.length; // returns length
    v1.map((item) => item.toUpperCase());
    v1.max; // return element with greatest value
    v1.reverse; // returns vector in reverse order
    v1.sorted; // return sorted vector
    v1.size; // returns length
}

// ---
// sets
// ---

def basicSets(): Unit = {
    // immutable
    val s1 = Set("Kakashi, Iruka, Konohamaru");
    // mutable
    var s1 = Set("Kakashi, Iruka, Konohamaru");

    // operators
    s1 - "Kakashi"; // return set without element
    s1 + "Hiruzen"; // return set with additional element
    s1 & s2; // intersection betweeen sets (common)
    s1 &~ s2; // difference between sets (unique)
    s1 ++ s2; // returns set with all unique elements from both
    s1 -- s2; // creates new collection with elements from s1 (removing any common from s2)

    // methods and attributes
    s1.contains("Konohamaru"); // returns boolean (set contains argument)
    s1.count((item) => item.length > 6) // return number of elements that satisfy predicate
    s1.filter(_.length > 6); // returns set with items that satisfy predicate (wildcard)
    s1.filter((item) => item.length > 6); // returns set with items that satisfy predicate
    s1.filterNot((item) => item.length > 6); // returns set with items that don't satisfy predicate
    s1.find((item) => item == "Kakashi"); // returns first match (if any)
    s1.foreach((item) => println(item)); // apply function to each element
    s1.head; // returns first element
    s1.isEmpty; // returns boolean (is empty)
    s1.last; // returns last element
    s1.map((item) => item.toUpperCase());
    s1.max; // return element with greatest value
    s1.size;
}

// ---
// tuples
// ---

def basicTuples(): Unit = {
    // collection of heterogeneous, immutable elements
    var t1 = (15, "Hello!", true, 2.3f);
    t1.productIterator.foreach((item) => println(item));
}

// ---
// try catch
// ---


def basicExceptions(): Unit = {
    try {
        var N = 5/0;
    } catch {
        // Catch block contain cases.
        case i: IOException => {
            println("IOException occured.");
        }
        case a : ArithmeticException => {
            println("Arithmetic Exception occured.");
        }
    } finally {
        println("Finally Block");
    }
}

// ---
// either
// ---

// TODO


// ---
// classes
// ---

def basicClasses(): Unit = {
    // example 1 (constructor, default values/optional params, override)
    class Point(var x: Int = 0, var y: Int = 0) {
    // values
    val x: Int = x;
    val y: Int = y;
    // method
    def move(dx: Int, dy: Int): Point = new Point(x + dx, y + dy);
    // override
    override def toString: String = s"(${x}, ${y})";
    }

    // example 1 (class instantiation)
    val point1 = new Point(2, 3);
    point1.x; // 2
    println(point1);  // prints (2, 3)

    // example 2 (inheritance) (subclass inherits all members (fields/methods))
    class ColorPoint(u: Int, v: Int, c: String) extends Point(u, v) {
    val color: String = c;
    def compareWith(pt: ColorPoint): Boolean = (pt.x == x) && (pt.y == y) && (pt.color == color);
    override def move(dx: Int, dy: Int): ColorPoint = new ColorPoint(x + dy, y + dy, color);
    override def toString: String = s"x: ${x}, y: ${y}, color: ${color}";
    }

    val cp1 = new ColorPoint(3,4, "indigo");
    cp1.x;
    println(cp1);
}

// ---
// classes (access)
// ---

// access modifiers -- public, protected, private
    // no modifier (public) -- all
    // protected -- only class, companion, subclass (no package, no world)
    // private -- only class and companion (no subclass, package, world)

// ---
// classes (further reading)
// ---

// inner classes
    // https://www.geeksforgeeks.org/inner-class-in-scala/
// abstraction
    // https://www.geeksforgeeks.org/abstract-classes-in-scala/
// generic classes
    // https://www.geeksforgeeks.org/generic-classes-in-scala/

// ---
//
// ---
