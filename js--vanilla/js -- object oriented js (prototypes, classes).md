# OBJECT ORIENTED JS (OOJS) (UDEMY)

```js

// using 'this' in the global scope refers to the window object.

// ----------------
// object literals
// ----------------

const kakashi = {
  name: 'Kakashi',
  age: 41
};

console.log(kakashi);
console.log(kakashi.age);

// ----------------
// constuctor function (Person)
// ----------------

function Person(name, dob){
  this.name = name,
  this.birthday = new Date(dob),
  this.calculateAge = function(){
    const diff = Date.now() - this.birthday.getTime();
    const ageDate = new Date(diff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }
};

const landon = new Person('Landon', '05-19-1992');
console.log(landon); // Person {name: "Landon", birthday: '05-19-1992'}
console.log(landon.calculateAge()); // 26

// ----------------
// prototypes (objects inherit from their prototypes.)
// ----------------

// prototypes are objects.
// objects inherit properties/methods from their prototypes
// object literals inherit from prototype 'Object.prototype'.
// objects created with 'Person' constructor inherit from 'Person.prototype'.

function Person(firstName, lastName, dob){
  this.firstName = firstName,
  this.lastName = lastName,
  this.birthday = new Date(dob)
  // prototype methods rather than constructor methods (moved to below)
};

// calculateAge as a prototype method
Person.prototype.calculateAge = function(){
  const diff = Date.now() - this.birthday.getTime();
  const ageDate = new Date(diff);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

// getFullName as a prototype method
Person.prototype.getFullName = function(){
  return `${this.firstName} ${this.lastName}`;
}

const landon = new Person('Landon', 'Yarrington', '05-19-1992');
console.log(landon); // Person {name: "Landon", birthday: '05-19-1992'}
console.log(landon.calculateAge()); // 26
console.log(landon.getFullName()); // Landon Yarrington

// ----------------
// prototypal inheritance
// ----------------

// Person constructor
function Person(firstName, lastName){
  this.firstName = firstName;
  this.lastName = lastName;
}

// 'Person' prototype method
Person.prototype.greeting = function(){
  return `Hello! my name is ${this.firstName} ${this.lastName}`;
}

const kakashi = new Person('Kakashi', 'Shapiro');

// Teacher constructor (inherits from Person)
function Teacher(firstName, lastName, subject){
  Person.call(this, firstname, lastName);
  this.subject = subject;
}

// inherit 'Person' prototype methods
Teacher.prototype = Object.create(Person.prototype);

// make Teacher.prototype return Teacher() (inside '__proto__' object)
Teacher.prototype.constructor = Teacher;

// create new greeting method (prototype)
Teacher.prototype.teacherGreeting = function(){
  return `Hello! My name is ${this.firstName} ${this.lastName}.
  I teach ${this.subject}!`;
}

const kakashi = new Teacher('Kakashi', 'Hatake', 'Physical Education');
console.log(kakashi.greeting());
console.log(kakashi.teacherGreeting());


// ----------------
// Object.create
// ----------------

const personPrototypes = {
  greeting: function() {
    return `Hello there ${this.firstName} ${this.lastName}`;
  }
}

// syntax 1
const mary = Object.create(personPrototypes);
mary.firstName = 'Mary';
mary.lastName = 'Williams';
mary.age = 30;

// syntax 2
const brad = Object.create(personPrototypes, {
  firstName: {value: 'Jamie'},
  lastName: {value: 'Davis'},
  age: {value: 30}
});


// ----------------
// ES6 classes (more like Python, Java, C#, Ruby classes)
// ----------------

// still like ES5 constructors/prototypes, but syntax is more like classes.

class Person {
  constructor(firstName, lastName, dob){
    this.firstName = firstName;
    this.lastName = lastName;
    this.birthday = new Date(dob);
  }

  greeting() {
    return `Hello there ${this.firstName} ${this.lastName}`;
  }

  calculateAge() {
    const diff = Date.now() - this.birthday.getTime();
    const ageDate = new Date(diff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }

  // static method (stand-alone method. independent of instantiated objects.)
  static addNumbers(x, y) {
    return x + y;
  }
}

const mary = new Person('Mary', 'Williams', '11-13-1980');
console.log(mary);
console.log(mary.calculateAge());
console.log(Person.addNumbers(1,2));


// ----------------
// inheritance ES6 (sub-classes)
// ----------------

class Person {
  constructor(firstName, lastName) {
    this.firstName = firstName;
    this.lastname = lastName;
  }

  greeting() {
    return `Hello! My name is ${this.firstName} ${this.lastName}`;
  }
}

class Teacher extends Person {
  constructor(firstName, lastName, subject) {
    super(firstName, lastName);

    this.subject = subject;
  }
}

const kakashi = new Teacher('Kakashi', 'Hatake', 'Physical Education');
console.log(kakashi);
// Teacher extends Person -- Person methods on Teacher object should work.
console.log(kakashi.greeting());

// ----------------
//
// ----------------


// ----------------
//
// ----------------


// ----------------
//
// ----------------
```




























# OBJECT ORIENTED JS (OOJS) (MDN / W3SCHOOLS)
## creating an object
``` js
// creates an empty object
var object1 = {};
// creates a person object
var person1 = {
  name: ['Bob', 'Smith'],
  age: 32,
  gender: 'male',
  interests: ['music', 'skiing'],
  bio: 'name: ' + this.name.join(' ') + '\n' +
  'age: ' + this.age + '\n' +
  'gender: ' + this.gender + '\n' +
  'interests: ' + this.interests.join(', ')
  }
}

// objects within objects
var person2 = {
  name: {
    first: 'Bob',
    last: 'Smith'
  };
};
person2.name.first // "Bob"
person2.name.last // "Smith"
person2['name']['first'] // "Bob"
person2['name']['last'] // "Smith"

// update object members
person2.name.first = 'Bobert';
```

## constructor functions
```js
// normal function (use constructor instead)
function createNewPerson(name, age, gender) {
  var obj = {}
  obj.name = name;
  obj.age = age;
  obj.gender = gender;
  return obj;
};

// object instance
var kakashi = createNewPerson('Kakashi', 41, 'male');

// constructor function
function Person(name, age, gender) {
  this.name = name;
  this.age = age;
  this.gender = gender;
};

// object instance
var kakashi = new Person('Kakashi', 41, 'male');
```

## put it all together
``` js

function Person(first, last, age, gender, interests) {
  this.name = {
    'first': first,
    'last' : last
  };
  this.age = age;
  this.gender = gender;
  this.interests = interests;
  this.bio = 'name: ' + this.name.first + '\n' +
  'age: ' + this.age + '\n' +
  'gender: ' + this.gender + '\n' +
  'interests: ' + this.interests.join(', ')
};

var kakashi = new Person('Kakashi', 'Hatake', 41, 'male', ['running', 'chopping wood']);

// defining Teacher() constructor function
function Teacher(first, last, age, gender, interests, subject) {
  Person.call(this, first, last, age, gender, interests);

  this.subject = subject
};

// fixes something. this shit makes no sense :D
Teacher.prototype = Object.create(Person.prototype);
Teacher.prototype.constructor = Teacher;

// Teacher object instance
var kakashi1 = new Teacher('Kakashi', 'Hatake', 41, 'male', 'running', 'physical education');
```

## JSON
https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/JSON
## VALIDATE JSON
https://jsonlint.com/

## PARSING JSON
https://www.w3schools.com/js/js_json_parse.asp

```js
// response from server
'{ "name":"John", "age":30, "city":"New York"}'
// convert text to js object
var obj = JSON.parse('{ "name":"John", "age":30, "city":"New York"}');
```

```html
<!-- use object in page  -->
<p id="demo"></p>

<script>
document.getElementById("demo").innerHTML = obj.name + ", " + obj.age;
</script>
```

## PARSING NESTED JSON OBJECTS
```js
myObj = {
    "name":"John",
    "age":30,
    "cars": {
        "car1":"Ford",
        "car2":"BMW",
        "car3":"Fiat"
    }
 }

 x = myObj.cars.car2; // x = "BMW"
 ```




















END
