// ---
// C++
// ---

// online compiler
// http://cpp.sh/

// compile (mac) (ubuntu use gcc)
// g++ filename.cpp -o output_fn

// run (ubuntu)
// ./output_fn

// ---
// useful tools
// ---

// clang-tidy (linter)

// boost
// utility library for cpp

// ---
// format style
// ---

/*
add this line to settings.json in vscode (for google style)
"C_Cpp.clang_format_fallbackStyle": "{ BasedOnStyle: Google, IndentWidth: 4, ColumnLimit: 0}",
*/

// ---
// intro
// ---

// TODO

// ---
// imports
// ---

// 'include' must be at start of file
// 'include' statements don't need semicolons

#include <algorithm>
#include <array>
#include <iostream>
#include <string>

// ---
// namespace
// ---

using namespace std;  // std::cout -> cout

// ---
// declaring function prototypes
// ---

// functions must be declared before used.
// they can only be defined after main if declared before.

void printSectionHeader(string header);

// ---
// headers
// ---

void printSectionHeader(std::string header) {
    transform(header.begin(), header.end(), header.begin(), ::toupper);
    cout << header;
    cout << std::endl;  // end line
    return;
}

// ---
// basic I/O
// ---

// cin -- standard input stream
// cout -- standard output stream
// cerr -- standard error (output) stream
// clog -- standard logging (output) stream

void basicIO() {
    // namespace (std), scope operator (::), function (cout)
    std::cout << "Hello, world!" << std::endl;
    std::cout << "Hello again!" << std::endl;
}

// ---
// basic math
// ---

void basicMath() {
    int a = 2;
    int b = 4;
    int result = a + b - 2;
    cout << result << endl;
}

// ---
// declaration and types
// ---

void declarations() {
    int a = 4;  // c-like initialization
    int b(5);   // constructor initialization
    int c{6};   // uniform initialization
    /*
    auto b = a; // use type from "a"
    decltype(a) c = 3; // use type from "a"
    */
}

// ---
// basic types
// ---

void basicTypes() {
    int a = 75;
    uint b = 75u;
    long c = 75l;
    const float d = 3.14159;
    float e = 6.02e23f;
    float f = 1.6e-19f;
    std::string g = "Hello";
    char h = 'h';
    bool i = true;
    int *j = nullptr;

    cout << "int: " << a << endl;
    cout << "uint: " << b << endl;
    cout << "long: " << c << endl;
    cout << "const float: " << d << endl;
    cout << "float: " << e << endl;
    cout << "float: " << f << endl;
    cout << "string: " << g << endl;
    cout << "char: " << h << endl;
    cout << "bool: " << i << endl;
    cout << "pointer: " << j << endl;
}

// ---
// operators
// ---

void basicOperators() {
    // math operators
    int sum = 3 + 4 + 5;
    int diff = 5 - 3;
    int product = 2 * 4;
    int quotient = 6 / 3;
    int remainder = 5 % 2;

    // comma operator (only the output from the right-most expression is returned)
    int a, b;
    a = (b = 3, b + 2);  // a is 5, b is 3

    /*
    comparison operators:
    ==  !=  >=  <=  <  >
    */

    /*
    logical operators:
    !  ||  &&
    */

    /*
    bitwise operators:
    &  |  ^  ~  <<  >>
    */

    /*
    misc:
    a++ (increment)
    a += 3 (compound assignment)
    */

    /*
    priority:
    scope 
    ::

    postfix 
    () [] . ->

    prefix 
    ++ == ~ ! + - & * new delete sizeof

    pointer to member
    .* -> *

    scaling
    * / %

    addition
    + -

    bitwise
    relational
    equality
    exclusion
    inclusion
    conjunction
    disjunction
    assignmment
    sequencing
    */

    cout << "sum: " << sum << endl;
    cout << "diff: " << diff << endl;
    cout << "product: " << product << endl;
    cout << "quotient: " << quotient << endl;
    cout << "remainder: " << remainder << endl;
}

// ---
// control flow
// ---

void basicControlFlow() {
    // if, else if, else
    int a = 5;
    if (a > 3) {
        cout << a << " is greater than 3" << endl;
    } else if (a <= 3) {
        cout << a << " is less than or equal to 3" << endl;
    } else {
        cout << "How did we get here?" << endl;
    }
    // for loop
    for (int i = 0; i < 10; i++) {
        if (i % 2 == 1)
            continue;
        if (i >= 7)
            break;
        cout << i << endl;
    }
    // switch
    // TODO
}

// ---
// reflection
// ---

void reflection() {
    int a = 5;
    int sizeInBytes = sizeof(a);
}

// ---
// formatting
// ---

// printf & sprintf expect c-style strings.

void basicFormatting() {
    string name = "Kakashi";
    // printf -- format and print to stdout
    printf("My name is %s", name.c_str());
    cout << endl;
    // sprintf -- format and store in buffer
    char buffer[50];
    sprintf(buffer, "My name is %s", name.c_str());
    string greeting = buffer;
    cout << greeting << endl;
    // format -- available in c++20
}

// ---
// value/ref
// ---

// pass value
int add(int a, int b) { return a + b; }

// pass reference
void doubleInt(int &a) { a *= 2; }

void valueAndRef() {
    // value example
    int a = 3, b = 5;
    int sum = add(a, b);
    // reference example
    int c = 5;
    int d = c;
    doubleInt(d);

    printf("The sum of %i and %i is %i", a, b, sum);
    cout << endl;
    printf("%i doubled is %i", c, d);
    cout << endl;
}

// ---
// recursion
// ---

long factorial(long a) {
    if (a > 1)
        return (a * factorial(a - 1));
    else
        return 1;
}

void basicRecursion() {
    long a = 5;
    long result = factorial(a);
    cout << "The factorial of " << a << " is " << result << endl;
}

// ---
// overloading
// ---

int doubler(int a) { return 2 * a; }
long doubler(long a) { return 2 * a; }
float doubler(float a) { return 2 * a; }

void basicOverloading() {
    int a = 3;
    int doubledInt = doubler(a);
    long b = 4;
    long doubledLong = doubler(a);
    float c = 5;
    float doubledFloat = doubler(a);

    printf("%i doubled is %i", a, doubledInt);
    cout << endl;
    printf("%li doubled is %li", b, doubledLong);
    cout << endl;
    printf("%f doubled is %f", c, doubledFloat);
    cout << endl;
}

// ---
// return multiple
// ---

pair<int, string> halfIntAndGetSign(int a) {
    int halved = a / 2;
    string sign = a >= 0
                      ? a != 0
                            ? "positive"
                            : "zero"
                      : "negative";
    return make_pair(halved, sign);
}

void returnMultiple() {
    int a = 5;
    int halved;
    string sign;
    tie(halved, sign) = halfIntAndGetSign(a);  // unpack pair or tuple
    // auto [halved, sign] = halfIntAndGetSign(a); // structured bindings (c++17)
    printf("Half of %i (rounded down) is %i, and %i is %s", a, halved, a, sign.c_str());
    cout << endl;
}

// ---
// generics
// ---

template <typename T>
T maxFunc(T a, T b) { return (a > b) ? a : b; }

void basicGenerics() {
    cout << "max int: " << maxFunc(1, 3) << endl;
    cout << "max float: " << maxFunc(1.0, 3.0) << endl;
    cout << "max string: " << maxFunc("Kakashi", "Hatake") << endl;
}

// ---
// namespaces
// ---

namespace kakashi {
string name = "Kakashi Hatake";
int age = 27;
}  // namespace kakashi

namespace iruka {
string name = "Iruka Umino";
int age = 25;
}  // namespace iruka

void basicNamespaces() {
    // pull from namespace (using keyword)
    using kakashi::name;
    cout << name << endl;  // Kakashi Hatake
    // use namespaces
    cout << kakashi::name << endl;
    cout << kakashi::age << endl;
    cout << iruka::name << endl;
    cout << iruka::age << endl;
}

// ---
// arrays
// ---

void basicArrays() {
    // basic array (built in, inherited from C)
    int foo[5];                    // uninitialized array (with room for 5 elements)
    int bar[5] = {1, 2, 3, 4, 5};  // initizlized array (with values)
    int baz[] = {1, 2, 3, 4, 5};   // initialized array (assumed size)
    int second = bar[2];           // access 3rd element (zero-indexed)

    // multi-dimensional array
    int qux[3][3] = {{1, 2, 3}, {4, 5, 6}, {7, 8, 9}};

    // library array
    array<int, 5> quux = {1, 2, 3, 4, 5};
}

// ---
// character sequences
// ---

void basicCharSeq() {
    // null-teriminated character sequence
    char foo[10] = "Hello!";
    char bar[10] = {'H', 'e', 'l', 'l', 'o', '\0'};

    // convert string to c-string
    string baz = "Hello World";  // string
    int len = baz.length();      // length of string
    char qux[len + 1];           // initialize char array
    strcpy(qux, baz.c_str());    // copy contents
}

// ---
// pointers
// ---

// functions
int addOne(int a) { return a + 1; }
int subtractOne(int a) { return a - 1; }
// function as param to another function
int operation(int a, int (*func)(int)) { return (*func)(a); }

void basicPointers() {
    // address-of (&) and dereference (*) operators
    int foo = 5;            // assign value
    int *bar = &foo;        // get pointer to value
    const int *baz = &foo;  // read-only pointer
    int qux = *bar;         // dereference value
    cout << qux << endl;

    // pointers and arrays
    // arrays are pretty much pointers to their first elements.
    // arrays can be implicitly converted to a pointer (of the proper type)

    // pointer to function
    int result = operation(5, addOne);
}

// ---
// lambdas
// ---

// TODO
// https://docs.microsoft.com/en-us/cpp/cpp/lambda-expressions-in-cpp?view=msvc-160

// ---
// dynamic memory
// ---

// TODO
// https://www.cplusplus.com/doc/tutorial/dynamic/

// ---
// type aliasing
// ---

// any valid type can be aliased
// typedef char C; // "C" can be used as a type

// ---
// enums
// ---

namespace CardGame {
enum Suit {
    Spades,
    Clubs,
    Diamonds,
    Hearts
};
}

void basicEnums() {
    // use enum
    int suit = CardGame::Suit::Spades;
    // check enum
    if (suit == CardGame::Suit::Spades) {
        cout << "Spades" << endl;
    } else {
        cout << "Not Spades" << endl;
    }
}

// ---
// structs
// ---

struct Shinobi {
    string firstName;
    string lastName;
    int age;
};

// overload output operator (print ninja struct)
ostream &operator<<(ostream &os, const Shinobi &shinobi) {
    return os << "First Name: " << shinobi.firstName << endl
              << "Last Name: " << shinobi.lastName << endl
              << "Age: " << shinobi.age << endl;
}

void basicStructs() {
    // example 1
    struct Shinobi kakashi;         // create new instance of struct
    kakashi.firstName = "Kakashi";  // set members
    kakashi.lastName = "Hatake";    // set members
    kakashi.age = 27;               // set members

    // example 2 (pointer)
    struct Shinobi iruka;
    Shinobi *piruka = &iruka;
    iruka.firstName = "Iruka";   // regular set
    piruka->lastName = "Umino";  // set using pointer and dereference operator (->)
    (*piruka).age = 25;          // set member of dereferenced pointer

    // print struct
    cout << kakashi << endl;
    cout << iruka << endl;
}

// ---
// classes
// ---

// classes are similar to structs.
// classes can have functions as members.
// classes have optional access specifiers

// access specifiers
// private -- only members of same class
// protected -- members of same class or derived classes
// public -- accessible from anywhere the object is visible

// members
// constructor -- initialization method
// attribute -- data member
// method -- function member
// static member -- "class member", the same across all instances

class Ninja {
    // attributes

   private:
    string firstName;
    string lastName;
    int age;

    // constructor

   public:
    Ninja(string fn, string ln, int a) {
        firstName = fn;
        lastName = ln;
        age = a;
    }

    // getters & setters

   public:
    string getFirstName() { return firstName; }
    void setFirstName(string fn) { firstName = fn; }
    string getLastName() { return firstName; }
    void setLastName(string ln) { firstName = ln; }
    int getAge() { return age; }
    void setAge(int a) { age = a; }

    // methods

   public:
    void greet() {
        printf("Hello, my name is %s %s, and I'm %i years old.", firstName.c_str(), lastName.c_str(), age);
        cout << endl;
    }
    void sayHello() { cout << "Hello there!" << endl; }
    void sayHello(string name) {
        printf("Hello there, %s!", name.c_str());
        cout << endl;
    }
};

void basicClasses() {
    // classes
    Ninja kakashi("Kakashi", "Hatake", 27);
    Ninja iruka("Iruka", "Umino", 25);
    // const (read-only)
    const Ninja yamato("Tenzo", "Yamato", 24);
    // pointer
    Ninja *piruka = &iruka;
    // use public methods
    kakashi.greet();
    (*piruka).greet();
    piruka->sayHello("Kakashi");
}

// ---
// overloading operators
// ---

// TODO

// ---
// inheritance
// ---

// TODO

// ---
// polymorphism
// ---

// TODO

// ---
// type conversions
// ---

// TODO

// ---
// interfaces
// ---

// TODO

// ---
// strings
// ---

void basicStrings() {}

// ---
// main
// ---

// every program must have a 'main' function (in order to be ran)

int main() {
    printSectionHeader("basic I/O");
    basicIO();

    printSectionHeader("basic math");
    basicMath();

    printSectionHeader("basic types");
    basicTypes();

    printSectionHeader("basic operators");
    basicOperators();

    printSectionHeader("basic control flow");
    basicControlFlow();

    printSectionHeader("basic formatting");
    basicFormatting();

    printSectionHeader("value and ref");
    valueAndRef();

    printSectionHeader("basic recursion");
    basicRecursion();

    printSectionHeader("basic overloading");
    basicOverloading();

    printSectionHeader("return multiple");
    returnMultiple();

    printSectionHeader("basic generics");
    basicGenerics();

    printSectionHeader("basic namespaces");
    basicNamespaces();

    printSectionHeader("basic pointers");
    basicPointers();

    printSectionHeader("basic structs");
    basicStructs();

    printSectionHeader("basic classes");
    basicClasses();

    printSectionHeader("basic strings");
    basicStrings();

    return 0;  // end program, no errors
}

// ---
//
// ---

// ---
//
// ---
