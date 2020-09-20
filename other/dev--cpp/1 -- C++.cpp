// ------------
// C++
// ------------

// online compiler
  // http://cpp.sh/

// compile (ubuntu)
  // gcc filename.cpp -o output_fn
// run (ubuntu)
  // ./output_fn

// ------------
// intro
// ------------

// every program must have a 'main' function (in order to be ran)
// a file that has only functions will not be ran until it is linked to somethin executable.
// 'include' must be at start of file
// 'include' statements don't need semicolons

#include <iostream>

int main()
{
  std::cout << "Hello, world!"; // namespace (std), scope operator (::), function (cout)
  std::cout << std::endl;   // end line
  std::cout << "Hello again!";  // print next line
  return 0; // end program, no errors
}

// ------------
//  varibles
// ------------

// scope
  // local -- inside function or block
  // params -- inside definition of function
  // global -- outside of functions

#include <iostream>

int main()
{
  // variables
  int a = 1, b = 2, c = 3; // multiple assignment
  int sum = a + b + c;
  int diff = a - b - c;
  int prod = a * b * c;
  int quot = a / b / c;

  // output
  std::cout << sum;
  std::cout << std::endl;
  std::cout << diff;
  std::cout << std::endl;
  std::cout << prod;
  std::cout << std::endl;
  std::cout << quot;
  std::cout << std::endl;

  // return
  return 0; // end program, no errors
}

// ------------
// namespace
// ------------

// namespace -- kind of like destructuring in js

#include <iostream>
using namespace std;

int main()
{
  cout << "Hello World!";
  return 0;
}

// ------------
// escaped characters
// ------------

#include <iostream>

int main()
{
  std::cout << "Hello, world! \n"; 
  std::cout << "Hello again!";   
  return 0;             
}

// ------------
// comments
// ------------

// single line

// multiline \
multiline part 2

/* self-closing */


// ------------
// variables
// ------------

#include <iostream>
using namespace std;

int main()
{
  // assignment
  int myInt = 15; // integer variable
  myInt = 10; // reassignment
  const int myConst = 15; // const -- cannot be changed
  float myFloat = 5.99; // float (up to 7 decimal digits) (4 bytes)
  double myDouble = 5.99; // double (up to 15 decimal digits) (8 bytes)
  char myLetter = 'a'; // single letter, must have single quotes
  char myASCII = 65; // ascii value for 'a'
  string myText = "Hello there!"; // text, must have double quotes, std::string
  bool myBoolean = true;
  // output
  cout << myText;
  // end
  return 0;
}

// ------------
// constants
// ------------

// constants (literals) -- fixed values that the program may not alter

// ------------
// concatenate
// ------------

#include <iostream>
using namespace std;

int main()
{
  string name = "Itachi";
  // output
  cout << name << ", you are truly a kind child.";
  // end
  return 0;
}

// ------------
// uninitialized & cin
// ------------

#include <iostream>
using namespace std;

int main()
{
  int x, y;
  int sum;
  cout << "Type a number: ";
  cin >> x;
  cout << "Type another number: ";
  cin >> y;
  sum = x + y;
  cout << "Sum is: " << sum;
}

// ------------
// getline (cin doesn't like whitespace)
// ------------

#include <iostream>
using namespace std;

int main()
{
  string fullName;
  cout << "Type your full name: ";
  getline(cin, fullName);
  cout << "Your name is: " << fullName;
}

// ------------
// boolean
// ------------

#include <iostream>
using namespace std;

int main()
{
  bool isCodingFun = true;
  bool isCppHard = false;
  cout << isCodingFun << "\n"; // Outputs 1 (true)
  cout << isCppHard;       // Outputs 0 (false)
}

// ------------
// cerr (standard error stream)
// ------------

int main() {
   char str[] = "Unable to read....";
   cerr << "Error message : " << str << "\n";
}

// ------------
// operators
// ------------

// arithmetic 
// + - * / % ^ ++ --

// assignment
// = += -= *= /= %= ^=
// &= |= >>= <<=

// comparison 
// == != > >= < <=

// logical
// && || !

// ternary
// ? :


// ------------
// strings (methods)
// ------------

// concatenate 
string name1 = "Kakashi";
string name2 = "Hatake";
string name = name1 + " " + name2;
cout << name;

// methods
string txt = "I could have been there for you more.";
txt[0]; // indexing
txt[0] = 'i';
txt.length(); // length of string

// ------------
// math
// ------------

#include <cmath>

int x;
x = max(5,10); // return max value
x = min(5,10); // return min value
x = sqrt(64);
x = round(2.6);
x = log(2);

const float pi = 3.14159;
x = abs(pi);
x = ceil(pi);
x = cbrt(pi);
x = floor(pi);
x = power(pi,2); // pi ^ 2
x = hypot(3,4); // 5 (a2 + b2 = c2)
x = exp(pi);
x = sin(pi);
x = cos(pi);
x = tan(pi);
x = asin(pi);
x = acos(pi);
x = atan(pi);

// ------------
// boolean, conditional logic, control flow
// ------------

// evaluate boolean

int x = 10;
int y = 9;
cout << (x > y); // 1
cout << (x == 10); // 1

// if

string name = "Yamato";
if (name == "Yamato") {
  cout << "Hello Yamato!";;
} else if (name == "Kakashi") {
  cout << "Hello Kakashi!";
} else {
  cout << "Hello there!";
}

// ternary operator
string cloudy = true;
string smallTalk = (cloudy) ? "It's cloudy outside." : "It's sunny today!";

// switch (case must be a value, not a number to evaluate)
int myNum = 3;
switch (myNum) {
case 1:
  cout << "number is 1.";
  break;
case 2:
  cout << "number is 2.";
  break;
case 3:
  cout << "number is 3.";
  break;
default:
  cout << "number is not 1, 2, or 3.";
}

// while
int x = 1;
while (x <= 10) {
  cout << x << "\n";
  x++;
}

// for loop 
for (int i = 0; i <= 10; i++) {
  cout << i << "\n";
}

// nexted logic (for loop)
for (int i = 0; i <= 10; i++) {
  if (i == 0) {
    continue; // skip current iteration (break would break out of loop)
  } else if (i % 2 == 0) {
    cout << "even number" << "\n";
  } else {
    cout << i << "\n";
  }
}

// ------------
// arrays (type, name, # of elements)
// ------------

// int
int myNums[3] = {10, 20, 30};

// string
string cars[4] = {"Volvo", "BMW", "Ford", "Mazda"};
cout << cars[0]; // Volvo
cars[0] = "Honda";

// iterate
for (int i = 0; i < 4; i++) {
  cout << cars[i] << '\n';
}

// omit array size
string cars[] = {"Toyota", "Audi", "Hyundai"}; // static size, only as big as you make it.

// empty space
string cars[5] = {"Volvo", "BMW", "Ford"}; // array will preserve space (2 spots)
cars[3] = {"Toyota"}; // add 4th element
cars[4] = {"Tesla"}; // add 5th element

// ------------
// char arrays
// ------------

char name[20]; // array of up to 20 characters


// ------------
// references and pointers
// ------------

// reference
string food = "Pizza"; // food
string &meal = food; // reference to food
cout << food << "\n" << meal << "\n"; // same thing

// memory address
string food = "Pizza";
cout << &food; // location in memory

// pointers (store memory address as variable value)
string food = "Pizza";
string* pointer = &food;
cout << food << "\n"; // Pizza
cout << &food << "\n"; // memory address
cout << pointer << "\n"; // memory address
cout << *pointer << "\n"; // Pizza

// reassign variable (by reassigning pointer)
string food = "Pizza";
string* pointer = &food;
*pointer = "Burger";
cout << food << "\n"; // Burger


// ------------
// functions
// ------------

// declaration -- function name, return type, params
// definition -- body of the function

// code optimization (declare before main, define after main)
// declare
void hello(); 
// main
int main() {
  hello(); // call function
  return 0;
}
// define
void hello() {
  cout << "Hello There" << "\n";
}


// void -- no return value
void hello() {
  cout << "Hello There!" << "\n";
}
hello(); // call function

// void with params/args
void greeting(string name) {
  cout << "Hello there, " << name << "\n";
}
greeting('Hiruzen');

// return int
float add(float x, float y) {
  return x + y
}

int main() {
  float sum = add(5.35, 6.36);
  cout << sum;
  return 0;
}

// function overloading
  // if two functions use different types but do the samething, overload.
  // overload looks like 'int add(int x, int y)' and 'double add(double x, double y)'


// ------------
// classes and objects
// ------------

// everything in C++ is associated with classes and objects, along with their attributes and methods.
// access specifiers (controls how members (attributes and methods) can be accessed):
  // public -- members are accessible from outside the class
  // private -- members can only be viewed/accessed within the class (default if not specified)
  // protected -- members can only be accessed in inherited classes.

class Person {
  public: 
    // attributes
    string name;
    int age;
    // methods
    void greeting() {
      cout << "Hello! my name is " << name << '\n';
    }
};

// define method (outside class definition)
  // methods can be defined outside, but they must be declared inside class definition.
  // example `void Person::hello() {cout << "Hello!" << "\n";}`

int main() {
  Person kakashi; // instantiate
  kakashi.age = 42; // set attributes
  kakashi.name = "Kakashi"; // set attributes
  kakashi.greeting(); // call instance method
  return 0;
}

// ------------
// constructors (special class method called during instantiation)
// ------------

class Person {
  public:
    // attributes
    string name;
    int age;
    // constructor
    Person (string n, int a) {
      name = n;
      age = a;
    }
    // methods
    void greeting() {
      cout << "Hello! my name is " << name << '\n';
    }
};

// constructor can happen outside declaration
  // Person::Person(string n, int a) {...}

int main() {
  Person kakashi("Kakashi Hatake", 27);
  kakashi.greeting();
  return 0;
}


// ------------
// classes (access private members) (encapsulation) (abstraction)
// ------------

class Person {
  private:
    // private attribute
    string name;
  public:
    // constructor
    Person (string n) {
      name = n;
    }
    // setter
    void setName(string n) {
      name = n;
    }
    // getter
    string getName() {
      return name;
    }
};

int main() {
  Person kakashi("Kakashi");
  kakashi.setName("Kakashi Hatake");
  cout << kakashi.getName();
  return 0;
}


// ------------
// inheritance
// ------------

// Base class (parent)
class Vehicle {
  public:
    string brand = "Ford";
    void honk() {
      cout << "Beep, Beep! \n" ;
    }
};

// Derived class (child)
class Car: public Vehicle {
  public:
    string model = "Mustang";
};

int main() {
  Car myCar;
  myCar.honk();
  cout << myCar.brand + " " + myCar.model;
  return 0;
} 

// ------------
// inheritance (access specifiers)
// ------------

// Base class
class Employee {
  protected: // Protected access specifier
    int salary;
};

// Derived class
class Programmer: public Employee {
  public:
    int bonus;
    void setSalary(int s) {
      salary = s;
    }
    int getSalary() {
      return salary;
    }
};

int main() {
  Programmer myObj;
  myObj.setSalary(50000);
  myObj.bonus = 15000;
  cout << "Salary: " << myObj.getSalary() << "\n";
  cout << "Bonus: " << myObj.bonus << "\n";
  return 0;
} 

// ------------
// structures
// ------------

// structure -- defined data type which allows for combination of data items of different kinds.
// member access operator -- `.`
// strcpy -- copies string from source (arg2) to destination (arg1)

struct Books {
  char title[50];
  char author[50];
  char subject[100];
  int book_id;
} book;

// declaration -- struct as parameter
void printBook( struct Books book );

int main() {
  struct Books Book1; // declare Book1 (type Book)
  struct Books Book2; // declare Book2 (type Book)
  // Book1 specification
  strcpy(Book1.title, "Learn C++ Programming");
  strcpy(Book1.author, "Chand Miyan");
  strcpy(Book1.subject, "C++ Programming");
  Book.book_id = 6495407;
  // Book2 specification
  strcpy(Book1.title, "Telecom Billing");
  strcpy(Book1.author, "Yakit Singha");
  strcpy(Book1.subject, "Telecom");
  Book.book_id = 6495700;
  // print books
  printBook( Book1 );
  printBook( Book2 );
  // end
  return 0;
}

// definition -- struct as parameter
void printBook( struct Books book ) {
  cout << "title: " << book.title << "\n";
  cout << "author: " << book.author << "\n";
  cout << "subject: " << book.subject << "\n";
  cout << "book_id: " << book.book_id << "\n";
}

// ------------
// structures (pointer)
// ------------

// structure -- defined data type which allows for combination of data items of different kinds.
// `&Book1` -- pointer
// `book->title` -- access member of structure (using pointers)

struct Books {
  char title[50];
  char author[50];
  char subject[100];
  int book_id;
} book;

// declaration -- struct as parameter
void printBook( struct Books book );

int main() {
  struct Books Book1; // declare Book1 (type Book)
  struct Books Book2; // declare Book2 (type Book)
  // Book1 specification
  strcpy(Book1.title, "Learn C++ Programming");
  strcpy(Book1.author, "Chand Miyan");
  strcpy(Book1.subject, "C++ Programming");
  Book.book_id = 6495407;
  // Book2 specification
  strcpy(Book1.title, "Telecom Billing");
  strcpy(Book1.author, "Yakit Singha");
  strcpy(Book1.subject, "Telecom");
  Book.book_id = 6495700;
  // print books
  printBook( &Book1 );
  printBook( &Book2 );
  // end
  return 0;
}

// definition -- struct as parameter
void printBook( struct Books book ) {
  cout << "title: " << book->title << "\n";
  cout << "author: " << book->author << "\n";
  cout << "subject: " << book->subject << "\n";
  cout << "book_id: " << book->book_id << "\n";
}

// ------------
// typedef
// ------------

// alias the types created. easier struct definition

typedef struct {
  char title[50];
  char author[50];
  char subject[100];
  int book_id;
} Books;

// declaration
Books Book1, Book2;


// ------------
// transfer ownership
// ------------

// move semantics revolve around the idea of transferring ownership of resources instead of copying them

// copy example
std::vector<data> v0;
std::vector<data> v1 = v0;

// transfer ownership (C++11 and later)
std::vector<data> v0;
std::vector<data> v1 = std::move(v0) // transfer contents of v0 into v1


// ------------
// lvalues and rvalues
// ------------

// lvalue -- locator value (represents an object that occupies an identifiable location  in memory)
// rvalue -- an expression that does NOT represent an object occuping some identifiable location in memory

// example, an assignment expects an lvalue as the left operand
int var = 4; // assignment
4 = var; // error

// ref and pointer
int a = 0;
int* a_ptr = &a; // pointer (address of lvalue)
int& a_ref = a; // reference


// ------------
// ifstream, ofstream, fstream (input/output file streams)
// ------------

#include <fstream>

// open -- arg1: path, arg2: mode (functionality)
    // modes -- ios::app, ios::ate, ios::in, ios::out, ios::trunc 

// append
ofstream outfile;
outfile.open("file.dat", ios::app);

// write or truncate (overwrite)
ofstream outfile;
outfile.open("file.dat", ios::out | ios::trunc);

// read and write
ofstream outfile;
outfile.open("file.dat", ios::out | ios::in);

// ------------
// fstream (read/write) (example 1)
// ------------

// writing on a text file
#include <iostream>
#include <fstream>
using namespace std;

int main () {
  ofstream myfile ("example.txt");
  if (myfile.is_open())
  {
  myfile << "This is a line.\n";
  myfile << "This is another line.\n";
  myfile.close();
  }
  else cout << "Unable to open file";
  return 0;
}

// reading a text file
#include <iostream>
#include <fstream>
#include <string>
using namespace std;

int main () {
  string line;
  ifstream myfile ("example.txt");
  if (myfile.is_open())
  {
  while ( getline (myfile,line) )
  {
    cout << line << '\n';
  }
  myfile.close();
  }
  else cout << "Unable to open file"; 
  return 0;
}


// ------------
// fstream (read/write)
// ------------

#include <fstream>
#include <iostream>
using namespace std;
 
int main () {
  // variable
  char data[100];
  // open a file in write mode.
  ofstream outfile;
  outfile.open("file1.dat");
  // get input (name)
  cout << "Enter your name: "; 
  cin.getline(data, 100);
  // write inputted data into the file.
  cout << "Writing to the file" << endl;
  outfile << data << endl;
  // get input (age)
  cout << "Enter your age: "; 
  cin >> data;
  cin.ignore();
  // again write inputted data into the file.
  outfile << data << endl;
  // close the opened file.
  outfile.close();

  // open a file in read mode.
  ifstream infile; 
  infile.open("file1.dat"); 
  // read data from file
  cout << "Reading from the file" << endl; 
  infile >> data; 
  // print data
  cout << data << endl;
  // again read the data from the file and display it.
  infile >> data; 
  cout << data << endl; 
  // close the opened file.
  infile.close();

  return 0;
}

// ------------
// exception handling
// ------------

#include <typeinfo>

float divide(float a, float b) {
  if (b == 0) {
  throw "Error: Division by 0."; // throw error
  }
  float c = a / b; // divide
  return c;
}

int main() {
  cout << "dividing..." << endl;
  // variables
  float a = 5;
  float b = 0;
  try {
  float quotient = divide(a,b);
  cout << "quotient: " << quotient << endl;
  } catch (const char* msg) {
  // catch error
  cout << msg << endl; // error to stout
  cerr << msg << endl; // error to sterr
  }
  // end
  return 0;
}


// ------------
// dynamic memory
// ------------

// new/delete operators

int main () {
  double* pvalue  = NULL; // Pointer initialized with null
  pvalue  = new double;  // Request memory for the variable
  *pvalue = 29494.99;  // Store value at allocated address
  cout << "Value of pvalue : " << *pvalue << endl;
  delete pvalue;    // free up the memory.
  return 0;
}

// dynamic memory allocation for arrays

int main() {
  // array
  char* pvalue  = NULL;         // Pointer initialized with null
  pvalue  = new char[20];       // Request memory for the variable
  delete [] pvalue;             // Delete array pointed to by pvalue
  // multi-dimensional array
  double** pvalue  = NULL;      // Pointer initialized with null 
  pvalue  = new double [3][4];  // Allocate memory for a 3x4 array 
  delete [] pvalue;            // Delete array pointed to by pvalue
  // end
  return 0;
}

// ------------
// namespaces
// ------------

// first name space
namespace space1 {
  void hello() {
    cout << "Hi!" << endl;
  }
}
// second name space
namespace space2 {
  void hello() {
    cout << "Hello there!" << endl;
  }
}

int main () {
  space1::hello(); // Calls function from space1.
  space2::hello(); // Calls function from space2.
  // end
  return 0;
}

// ------------
// template functions
// ------------

// functions can only work with one data type (overloading is one solution to this)
// function templates let you use one function for multiple different data types.
  // `T` will serve as a type placeholder. 
  // The compiler will generate a new version of the function using an argument's data type.

template <class T>
T Larger(T a, T b) {
	return (a > b) ? a : b;
}
int main()
{
  // variables
	int i1 = 5, i2 = 10;
	float f1 = 12.4, f2 = 10.2;
	char c1 = 'z', c2 = 'Z';
  // instantiate template & call function
  cout << Larger(i1, i2) <<" is larger." << endl;
  cout << Larger(f1, f2) <<" is larger." << endl;
  cout << Larger(c1, c2) << " has larger ASCII value." << endl;
  // end
	return 0;
}

// ------------
// class templates
// ------------

// calculator example -- works with int, float, and double

template <class T>
class Calculator
{
private:
	T num1, num2;
	
public:
  // constructor
	Calculator(T n1, T n2)
	{
		num1 = n1;
		num2 = n2;
	}
	
  // methods
	void displayResult()
	{
		cout << "Numbers are: " << num1 << " and " << num2 << "." << endl;
		cout << "Sum: " << add() << endl;
		cout << "Difference: " << subtract() << endl;
		cout << "Product: " << multiply() << endl;
		cout << "Quotient: " << divide() << endl;
	}
	T add() { return num1 + num2; }
	T subtract() { return num1 - num2; }
	T multiply() { return num1 * num2; }
	T divide() { return num1 / num2; }
};

int main()
{
  // create Calculator objects (type specified for the compiler)
	Calculator<int> intCalc(2, 1);
	Calculator<float> floatCalc(2.4, 1.2);
	// call displayResult method for each object
	cout << "Int results:" << endl;
	intCalc.displayResult();
	cout << endl << "Float results:" << endl;
	floatCalc.displayResult();
	// end
	return 0;
}

// ------------
// preprocessors
// ------------

// preprocessors -- #define, #include, #if, #else, #line

// define -- this processor directive creates symbolic constants (macros).
#define PI 3.14159

int main () {
   cout << "Value of PI :" << PI << endl; 
   return 0;
}

// define (function)
#define MIN(a,b) (((a)<(b)) ? a : b)

int main () {
   int i = 100, j = 30;   
   cout <<"The minimum is " << MIN(i, j) << endl;
   return 0;
}


// ------------
// multithreading
// ------------

// beyond my current skill levle lol


// ------------
//
// ------------




// ------------
//
// ------------




// ------------
//
// ------------




// ------------
//
// ------------




// ------------
//
// ------------




// ------------
//
// ------------




// ------------
//
// ------------




// ------------
//
// ------------




// ------------
//
// ------------




// ------------
//
// ------------




// ------------
//
// ------------




// ------------
//
// ------------




// ------------
//
// ------------




// ------------
//
// ------------




// ------------
//
// ------------




// ------------
//
// ------------



