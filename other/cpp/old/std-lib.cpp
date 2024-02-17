// ------------
// standard library
// ------------

// categories
  // containers
  // general utilities
  // iterators
  // algorithms
  // diagnostics
  // strings
  // I/O
  // localization
  // language support
  // numerics

// ------------
// containers
// ------------

// containers
  // vector -- one dimensional arrays
  // list -- double-linked lists
  // deque -- double-ended queues
  // queue -- FIFO queues and priority queues
  // stack -- stacks
  // map -- dictionaries (associative arrays)
  // set -- sets
  // bitset -- bitset

// containers are all template classes which contain:
  // typedefs iterator, reverse_iterator, and others
  // empty(), clear(), erase(), size(), max_size(), begin(), end(), rbegin(), rend(), swap(), get_allocator()

// ------------
// container examples
// ------------

// vector
  // like array, except dynamically sized. (automatically resizes upon insertion/deletion)
  // begin -- returns iterator or const_iterator (depending on the const-qualification of the object)
  // cbegin -- always returns const_iterator
  // rbegin -- reverse iterator or reverse const_iterator
  // crbegin -- always returns reverse const_iterator

#include <iostream>
#include <string>
#include <vector> 
using namespace std; 
  
int main() { 
  vector<int> v1; 
  for (int i = 1; i <= 5; i++) 
    v1.push_back(i); 
  
  // element access
  v1.at(4); // return element at index 4
  v1[2] // return element at index 2
  v1.front(); // return first element
  v1.back(); // return last element
  // iterators
  v1.begin(); // iterator (or const_iterator)
  v1.end(); // end
  v1.cbegin(); // const_iterator
  v1.cend(); // end
  v1.rbegin(); // reverse iterator (or reverse const_itetator)
  v1.rend(); // end
  v1.crbegin(); // reverse const_iterator
  v1.crend(); // end
  // capacity
  v1.empty(); // returns boolean (container is empty)
  v1.size(); // returns number of elements
  v1.max_size(); // returns the maximum possible number of elements
  v1.reserve(1e6); // reserve space for # of elements
  v1.capacity(); // return current space allocation (as number of elements)
  // modifiers
  v1.clear(); // clear all elements
  v1.insert(v1.begin(), 5); // insert element (args: location, element)
  v1.emplace(v1.begin(), 5); // insert element (args: location, element)
  v1.erase(v.begin()); // remove element at specified location(s)
  v1.push_back(3); // add element to end of vector 
  v1.emplace_back(3); // add element to end of vector
  v1.pop_back(); // remove last element
  v1.resize(4); // fill/remove elements until number of elements equals the argument.
  v1.swap(v2); // swap two vectors
  v1.assign(5, 10); // fill array with 10, 5 times {10,10,10,10,10}
  // iterators example
  cout << "Output of begin and end: "; 
  for (auto i = g1.begin(); i != g1.end(); ++i) 
    cout << *i << " "; 
  
  cout << "\nOutput of cbegin and cend: "; 
  for (auto i = g1.cbegin(); i != g1.cend(); ++i) 
    cout << *i << " "; 
  
  cout << "\nOutput of rbegin and rend: "; 
  for (auto ir = g1.rbegin(); ir != g1.rend(); ++ir) 
    cout << *ir << " "; 
  
  cout << "\nOutput of crbegin and crend : "; 
  for (auto ir = g1.crbegin(); ir != g1.crend(); ++ir) 
    cout << *ir << " "; 
  
  return 0; 
} 


// list 
  // like vector. vectors are contiguous in memory, lists are non-contiguous (spread out)
  // insertion and deletion are easier for lists (vectors have to shift elements to remain contiguous)

#include <iostream>
#include <list>
#include <string>
using namespace std;

int main(int, char**) {

}

// list functions
int main() {
  list <int> list1;
  for (int i = 0; i < 10; ++i) {
    list1.push_back(i)
  }
  // element access
  list1.front(); // access first element
  list1.back(); // access last element
  // iterators
  list1.begin(); // return iterator/const_iterator
  list1.cbegin(); // return const_iterator
  list1.rbegin(); // return reverse iterator
  list1.crbegin(); // return reverse const_iterator
  // capacity
  list1.empty(); // checks if empty
  list1.size(); // returns number of elements
  list1.max_size(); // returns the maximum possible number of elements
  // modifiers
  list1.clear(); // clear contents
  list1.insert(list1.begin(), 0); // args: location, value (extends list, copies element into position)
  list1.emplace(list1.begin(), 2); // args: location, value (extends list, constructs element into position)
  list1.push_back(3); // adds element to end of list (copy into place)
  list1.emplace_back(5); // adds element to end of list (construct in place)
  list1.pop_back(); // remove last element, reduce size by 1
  list1.push_front(3); // adds element to beginning of list (copy into place)
  list1.emplace_front(5); // adds element to beginning of list (construct in place)
  list1.pop_front(); //  remove first element, reduce size by 1
  list1.remove(5); // removes all elements that are equal to argument.
  list1.resize(2); // remove or fill elements until int argument is matched. (optional second arg is fill value)
  list1.swap(list2); // swap contents of two lists
  list1.sort(); // sort in ascending order
  list1.reverse(); // reverse the list
  list1.remove_if(even); // bool even(const int& value) { return (value % 2) == 0;}
  // iteration example
  list<string> names;   // default constructor makes it empty
  names.push_back("zeus");
  names.push_front("odin");
  names.push_front("ra");
  names.push_back("danu");
  for (list<string>::iterator i = names.begin(); i != names.end(); i++) {
    cout << *i << '\n';
  }

  return 0;
}

// map
  // `i->first` is the same as `(*i).first` 

#include <iostream>
#include <map>
#include <string>
using namespace std;

int main(int, char**) {
  map<string, int> m1;
  m1["kakashi"] = 48;
  m1["iruka"] = 46;
  m1["konohamaru"] = 29;
  m1["itachi"] = 21;
  // access elements
  m1["konohamaru"];
  m1.at("iruka");
  // iterators
    // same as list and vector
  // capacity
  m1.empty(); // returns boolean (container is empty)
  m1.size(); // returns number of elements
  m1.max_size(); // returns the maximum possible number of elements
  // modifiers
  m1.clear(); // clear contents
  m1.insert({"yamato", 46}); // insert element
  m1.insert_or_assign({"yamato", 46}); // insert or assign element (returns inserted ? 1 : 0)
  m1.emplace({"yamato", 46}); // 
  m1.try_emplace({"yamato", 46}); // 
  m1.erase("itachi"); // erase element by key
  m1.swap(m2); // swap contents of two maps
  m1.extract("itachi"); // unlinks node, returns node handle, invalidates iterators, blocks pointers/references.  
  // lookup
  m1.count("kakashi"); // returns boolean (key in container)
  m1.find("kakashi"); // find element with key equivalent to argument
  m1.contains("itachi"); // returns boolean (element in container with key equivalent to argument) (C++20)
  // iterator example
  map<string, int>::iterator itr;
  for (itr = m1.begin(); itr != m1.end(); ++itr) { 
    cout << "key: " << itr->first << endl;
    cout << "value: " << itr->second << endl;
  } 
  // find example
  map<string, int>::iterator i =  m1.find("kakashi");
  if (i != m1.end()) {
    cout << (*i).second << '\n' << m1.size() << '\n'; // first = key, second = value
  }

  return 0;
}



// ------------
// general utilities
// ------------

// variadic functions
  // https://en.cppreference.com/w/cpp/utility/variadic

// error handling
  // https://en.cppreference.com/w/cpp/error

// environment (std::system)
  // https://en.cppreference.com/w/cpp/utility/program/system

// ------------
// iterators
// ------------

// iterators
    // https://www.geeksforgeeks.org/iterators-c-stl/
    // https://en.cppreference.com/w/cpp/iterator/iterator


// ------------
// algorithms
// ------------

// algorithms
  // the containers use these algorithms

// ------------
// diagnostics
// ------------

// stdexcept -- defines some standard exception classes thrown by many library operations
// cassert -- contains the assert() macro
// cerrno -- C-style error handling, needed to support legacy code


// ------------
// strings
// ------------

int main() {
  string s1 = "Hello there!"; // text, must have double quotes, std::string
  // iterators
  s1.begin(); //
  s1.end(); //
  s1.cbegin(); //
  s1.cend(); //
  s1.rbegin(); //
  s1.rend(); //
  s1.crbegin(); //
  s1.crend(); //
  // capacity
  s1.size(); // return length of string
  s1.length(); // return length of string
  s1.max_size(); // return maximum size of string
  s1.capacity(); // return size of allocated storage
  s1.reserve(); // request a change in capacity
  s1.clear(); // clear contents
  s1.empty(); // returns boolean (string is empty)
  // element access
  s1[0]; // get char at string index
  s1.at(0); // get char at string index
  s1.front(); // get first char
  s1.back(); // get last char
  // modifiers
  s1 += "\n"; // append
  s1.append("\nHello!"); // append additional characters
  s1.append("\nHello!", s1.begin() + 1, s1.end()); // append additional characters (substring)
  s1.push_back('\n'); // add character to end of string
  s1.pop_back(); // remove last character of string
  s1.assign("Hello, I'm the new string!"); // assign new value to string (replace old contents)
  s1.assign(10, '*') // fill (args: n consecutive copies of c)
  s1.insert(0, "Hello!"); // insert characters into string, before position (args: position, string)
  s1.insert(s1.begin() + 3, "Hello!"); // insert characters into string, before position (args: position, string)
  s1.erase(); // clear contents
  s1.erase(s1.begin(), s1.end() - 3); // erase at position, for length (args: start, end) (can also be start, length)
  s1.swap(); // 
  s1.replace(0, 10, "Hello!"); // replace string (args: start position, length, replacement)
  s1.replace(s1.begin(), s1.end(), "Hello!"); // replace string (args: begin iterator, end iterator, replacement)
  // operations
  s1.data(); //
  s1.copy(ch1, 13, 0); // target char array, length, starting position
  s1.find(); //
  s1.rfind(); //


  return 0;
}

// ------------
// I/O
// ------------

// I/O
  // ios -- basic stream types and ops
  // streambuf -- buffers for streams
  // istream -- input stream template class
  // ostream -- output stream template class
  // iostream -- standard streams like cin/cout
  // fstream -- files to/from streams
  // sstream -- strings to/from streams
  // iomanip -- some stream manipulators


// ------------
// localization
// ------------

// localization
  // isalpha(), isdigit(), isalnum(), isspace(), ispunct(), istcntrl(), isupper(), islower(), toupper(), tolower()

// ------------
// language support
// ------------

// language
  // limits -- numeric limits
  // new -- dynamic memory management
  // typeinfo -- RTTI support
  // exception -- exception class

// ------------
// numerics
// ------------

// numerics
  // complex -- a class for complex numbers
  // valarray -- numeric vectors and operations
  // numeric -- generalized numeric operations: accumulate(), partial_sum(), adjacent_difference(), inner_product()
  // cmath -- mathematical functions
  // cstdlib -- C-style random numbers, abs(), fabs(), div()


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




// ------------
//
// ------------




// ------------
//
// ------------




