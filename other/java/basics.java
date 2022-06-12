// -----------
// java
// -----------

// all code that runs in java must be inside a class
// the filename must match the class name
// main method is required in every program

// -----------
// hello world
// -----------

public class Hello {
    public static void main(String[] args) {
        System.out.println("Hello, Java!");
    }
}

// -----------
// comments
// -----------

// single line comment
/* multiline comment */


// -----------
// primitive types
// -----------

// primitive (not numeric)
String name = "Kakashi"; // String -- stores text values, surrounded by double quotes
char rank = 'J';// char -- stores single characters (or ascii values), surrounded by single quotes.
boolean isAwesome = true; // boolean -- true or false

// primitive number types (most common)
int age = 49; // int -- stores integers (~ 2 trillion)
double weight = 148.812d; // double -- stores fractional numbers (up to 15 decimal digits)

// primitive number types (less common)
float weight = 67.5f; // float -- stores floating point numbers (up to 7 decimal digits)
byte age = 49; // byte -- stores numbers (128)
short heightCM = 181; // short -- stores integers (~ 32k)
long heightIn = 71L; // long -- stores huge integers (~ 9 quintillion) (ends with 'L')

// -----------
// casting
// -----------

// widening casting -- going from smaller to larger size type. happens automatically.

int myInt = 9;
double myDouble = myInt; // Automatic casting: int to double

// narrowing casting -- going from larger to smaller size type. happens manually.

double myDouble = 9.78;
int myInt = (int) myDouble; // Manual casting: double to int


// -----------
// operators
// -----------

/*

 math 
 + -* / % ++ --

 assignment
 = += -= *= /= %= &= ^= |= >>= <<=

 comparison
 == != > < >= <=

 logical
 && || !

*/

// -----------
// string methods
// -----------

// escape special characters. \' \" \\
// other special characters:
    // \n \r \t \b \f

String s1 = "Hello!";
s1.concat(" How are you?"); // concatenate to end (also `s1 + s2` works for concatenation )
s1.charAt(0); // return char at specified index
s1.contains("l"); // return boolean (argument is in string)
s1.endsWith("!"); // return boolean (string ends with argument)
s1.equals("hello"); // return boolean (string matches argument exactly)
s1.equalsIgnoreCase("hello!"); // return boolean (string matches argument, ignoring case)
s1.indexOf("e"); // find argument in string and return index
s1.isEmpty(); // returns boolean (string is empty)
s1.length(); // get length of string
s1.replaceAll("Hello", "Hi"); // replace all instances of arg1 with arg2
s1.startsWith("He"); // returns boolean (string starts with argument)
s1.toLowerCase(); // return text as lowercase
s1.toUpperCase(); // return text as uppercase
s1.trim(); // returns string with whitespace (at ends) removed

// format
s2 = String.format("Hi! my name is %s", "Kakashi");

// -----------
// math methods (most work on doubles, few work on all types)
// -----------

double x = 5;
double y = 3;

// exponents
Math.abs(x); // return absolute value
Math.sqrt(x); // return square root
Math.cbrt(x); // return cube root
Math.pow(x, y); // return x ^ y
// rounding
Math.ceil(x); // rounded up to nearest integer
Math.round(x); // return x rounded to nearest integer
Math.floor(x); // rounded down to nearest integer
// comparison
Math.max(x, y); // return max value
Math.min(x, y); // return min value
// random
Math.random(); // returns double between 0 and 1
// log
Math.exp(x); // e ^ x
Math.log(x); // return ln(x)
Math.log10(x); // return base 10 log(x)
// trig
Math.toDegrees(x); // returns x in degrees
Math.toRadians(x); // returns x in radians
Math.cos(x); // returns cos (uses radians)
Math.sin(x); // returns sin (uses radians)
Math.tan(x); // returns tan (uses radians)
Math.acos(x); // returns arccosine (in radians)
Math.asin(x); // returns arcsine (in radians)
Math.atan(x); // returns arctangent (in radians)
Math.hypot(x, y); // returns hypoteneuse -- sqrt(x2 + y2)


// -----------
// conditional statements
// -----------

// if
int x = 0;

if (x < 0) {
    System.out.println("x is negative.");
} else if (x > 0) {
    System.out.println("x is positive.");
} else if (x == 0) {
    System.out.println("x is 0.");
} else {
    System.out.println("wtf.");
}

// ternary operator
int x = 5;
String result = (x % 2 == 0) ? "x is even." : "x is odd";

// switch

String hungry = "yes";

switch (hungry) {
    case "yes":
        System.out.println("Let's go get some food.");
        break;
    case "no":
        System.out.println("Maybe later...");
        break;
    default:
        System.out.println("I don't understand your response.");
}


// -----------
// loops
// -----------

// 'break' and 'continue' work here

// while
int i = 0;
while (i < 5) {
    System.out.println(i);
    i++;
}

// for
for (int i = 0; i < 5; i++) {
    System.out.println(i);
}

// for each
String[] cars = {"Volvo", "Tesla", "Toyota", "Honda"};
for (String car : cars) {
    System.out.println(car);
}


// -----------
// arrays
// -----------

String[] ninjas = {"Kakashi", "Iruka", "Itachi", "Konohamaru"};

// access elements
ninjas[0] = "Kakashi";

// capacity
ninjas.length; // length of array

// multidimensional array
int[][] numbers = {{1,2,3,4},{5,6,7,8}};
int x = numbers[0][1];


// -----------
// try catch finally
// -----------

// errors can be thrown

try {
    int[] myNumbers = {1, 2, 3};
    System.out.println(myNumbers[10]);
} catch (Exception e) {
    System.out.println("Something went wrong.");
} finally {
    System.out.println("Block complete.");
}


// -----------
// methods
// -----------

public class Hello {
  // method (no params)
  static void sayHello() {
    System.out.println("Hello!");
  }
  // method (withparams)
  static void greet(String fname) {
    System.out.println("Hey there, " + fname + "!");
  }
  // return
  static int addNums(int x, int y) {
      return x + y;
  }
  // main
  public static void main(String[] args) {
    sayHello();
    greet("Kakashi");
    int x = 3;
    int y = 5;
    int z = addNums(x, y);
    System.out.println(z);
  }
}

// call function in jupyter notebooks
Hello.greet("Kakashi");
Hello.addNums(5, 3);

// -----------
// classes and objects (class instances)
// -----------

// attributes & methods
    // static -- belongs to class (doesn't need an object)
    // public -- belongs to object (needs an object)
    // final -- can't be overwridden/modified
// attributes, methods, constructors
    // public --  accessible for all classes
    // protected -- only accessible in class, package, and subclass (no world)
    // no modifier -- only accessible in class/package (no subclass, no world)
    // private -- accessible only within declared class (no package, no subclass, no world)
// classes
    // final -- can't be inherited from
    // abstract -- doesn't create objects, methods are used by subclasses


// example (final)
public class MyClass {
  int x = 10; // to make unchangeable, `final int x = 10`

  public static void main(String[] args) {
    MyClass myObj = new MyClass();
    myObj.x = 25; // x is now 25
    System.out.println(myObj.x);
  }
}

// example (constructor)
public class Car {
  // attributes
  int modelYear;
  String modelName;
  // constructor
  public Car(int year, String name) {
    modelYear = year;
    modelName = name;
  }
  // main
  public static void main(String[] args) {
    Car myCar = new Car(1969, "Mustang"); // class instantiation (using constructor)
    System.out.println(myCar.modelYear + " " + myCar.modelName);
  }
}

// example (encapsulation) (like javascript closures)
public class Jonin {
    // attributes (private)
    private String name;
    private int age;
    // constructor
    public Jonin(String n, int a) {
        name = n;
        age = a;
    }
    // getter
    public String getName() {
        return name;
    }
    public int getAge() {
        return age;
    }
    // setter
    public void setName(String newName) {
        this.name = newName;
    }
    public void setAge(int newAge) {
        this.age = newAge;
    }
}

// -----------
// packages
// -----------

// built-in packages (from the java api)
// user-defined packages (third party)

import package.name.Class; // import a class
import package.name.*; // import whole package

// example (use package)
import java.util.Scanner;

class MyClass {
    public static void main(String[] args) {
        Scanner obj1 = new Scanner(System.in); // class instantiation
        System.out.println("Enter username");
        String userName = obj1.nextLIne();
        System.out.println("Username is: " + userName);
    }
}

// example (create package) (classname should match filename)
    // directory structure: root > packagename > class file
    // compile: `javac ./path/to/Class.java`
        // shortcuts for javac and build tools exist (Maven, Ant)
        // janky shortcut `find . -name "*.java" -print | xargs javac `
package mypack;

class MyPackageClass {
    public static void main(String[] args) {
        // code here
    }
}

// -----------
// arraylist (java.util.ArrayList)
// -----------

import java.util.ArrayList;
import java.util.Collections;

public class MyClass {
  public static void main(String[] args) {
    ArrayList<String> cars = new ArrayList<String>();
    cars.add("Volvo"); // add
    cars.add("BMW");
    cars.add("Ford");
    cars.add("Mazda");
    cars.get(0); // get
    cars.set(0, "Opel"); // set
    cars.remove(0); // remove
    cars.size(); // size
    Collections.sort(cars); // sort
    cars.clear(); // clear
    // for each
    for (String car : cars) {
        System.out.println(car);
    }
    // for loop
    for (int i =0; i < cars.size(); i++) {
        System.out.println(cars.get(i));
    }
  }
} 

// -----------
// hashmap
// -----------

// Import the HashMap class
import java.util.HashMap;

public class MyClass {
  public static void main(String[] args) {

    // Create a HashMap object called capitalCities
    HashMap<String, String> hm1 = new HashMap<String, String>();

    // Add keys and values (Country, City)
    hm1.put("England", "London"); // put
    hm1.put("Germany", "Berlin");
    hm1.put("Norway", "Oslo");
    hm1.put("USA", "Washington DC");
    hm1.get("England"); // get
    hm1.remove("England"); // remove
    hm1.size(); // size
    hm1.clear(); // clear
    System.out.println(hm1);
    // foreach (keys)
    for (String i : hm1.keySet()) {
        System.out.println(i);
    }
    // foreach (values)
    for (String i : hm1.values()) {
        System.out.println(i);
    }
    // foreach (k/v)
    for (Map.Entry<String, String> entry : hm1.entrySet()) {
        System.out.println(entry.getKey() + "/" + entry.getValue());
    }
  }
} 

// -----------
// wrappers
// -----------

// primitive types can't be used for Collection objects (ie ArrayList)
ArrayList<int> myNumbers = new ArrayList<int>(); // Invalid 
// use wrapper classes
ArrayList<Integer> myNumbers = new ArrayList<Integer>(); // Valid 

// wrapper objects have additional methods that can be used with them (primitive types don't have them)
    // https://www.w3schools.com/java/java_wrapper_classes.asp


// -----------
// more class stuff
// -----------

// inheritance -- https://www.w3schools.com/java/java_inheritance.asp
// inner classes -- https://www.w3schools.com/java/java_inner_classes.asp
// abstraction -- https://www.w3schools.com/java/java_abstract.asp
// interface -- https://www.w3schools.com/java/java_interface.asp

// -----------
// other concepts
// -----------

// time -- https://www.w3schools.com/java/java_date.asp
// files (i/o) -- https://www.w3schools.com/java/java_files.asp

// -----------
// 
// -----------
