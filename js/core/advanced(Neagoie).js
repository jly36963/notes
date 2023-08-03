// ---
// this
// ---

// this -- the object that the function is a property of

const obj1 = {
  // value
  name: "Landon",
  // function using value
  greet() {
    return `Hi! I'm ${this.name}.`;
  },
  // broken -- arrow functions don't bind 'this'
  brokenGreet: () => {
    return `Hi! I'm ${this.name}.`;
  },
};

// ---
// call, apply, bind
// ---

const basicCallApplyBind = () => {
  kakashi = {
    name: "Kakashi",
    health: 50,
    maxHealth: 100,
    heal() {
      this.health = this.maxHealth;
    },
    increaseMaxHealth(x) {
      this.maxHealth += x;
    },
  };
  yamato = {
    name: "Yamato",
    health: 60,
    maxHealth: 80,
  };
  iruka = {
    name: "Iruka",
    health: 40,
    maxHealth: 70,
  };

  // call

  kakashi.increaseMaxHealth.call(yamato, 10); // arg1: which object for 'this', ...args: arguments
  kakashi.heal.call(yamato);
  console.log(yamato); // 'yamato', 90, 90

  // bind (used in react class components -- https://reactjs.org/docs/handling-events.html )

  const healIruka = kakashi.heal.bind(iruka);
  healIruka();
  console.log(iruka);
};

// this + arrow function

const basicThisAndArrowFunctions = () => {
  const person = {
    name: "Landon",
    say() {
      return () => console.log(this); // no 'this' bound
    },
    sayWindow() {
      return function () {
        console.log(this); // 'this' is bound to window
      };
    },
  };
  person.say()(); // person
  person.sayWindow()(); // window
};

// ---
// cloning objects
// ---

const basicCloning = () => {
  const obj1 = { a: 1, b: 2, c: 3 };
  const obj2 = Object.assign({}, obj1); // assign (shallow)
  const obj3 = { ...obj1 }; // spread operator (shallow)
  const obj4 = JSON.parse(JSON.stringify(obj1)); // JSON (deep) (might cause performance issues)
};

// ---
// prototypal inheritance
// ---

// *** DEPRECATED ***

const basicPrototypalInheritance = () => {
  // __proto__ -- object used in lookup chain to resolve methods
  // __proto__ -- pointer up the chain to prototype: {...}
  const jonin = {
    name: "Kakashi",
    fireballJutsu: function () {
      return "fireball";
    },
  };
  const chunin = {
    name: "Iruka",
  };
  chunin.__proto__ = jonin;
  chunin.fireballJutsu();
};

// ---
//
// ---
