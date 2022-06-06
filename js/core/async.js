// ---
// async
// ---

// ---
// promises
// ---

// promise
const myPromise = new Promise((resolve, reject) => {
  const someCondition = true;
  if (someCondition) {
    resolve("Success!");
  } else {
    reject("Failure!");
  }
});

// use promise value -- then & catch (and chaining 'then')
myPromise
  .then((value) => `It worked! ${value}`) // use resolve value (pass to next '.then' if applicable)
  .then((value) => console.log(value)) // use output of first 'then'
  .catch((error) => console.log(error)); // use reject value

// ---
// fetch (promise based request)
// ---

const fetchUser = () => {
  let data, error;
  fetch("https://jsonplaceholder.typicode.com/users/1")
    .then((response) => response.json())
    .then((json) => (data = json)) // store json in 'data'
    .catch((err) => (error = console.log(err) || err)); // store err in 'error'
  return { data, error }; // one will have value, other will be undefined;
};

const apiResponse = fetchUser();

// ---
// async / await
// ---

const fetchUserAsync = async () => {
  try {
    const apiResponse = await fetch(
      "https://jsonplaceholder.typicode.com/users/1"
    );
    const user = await apiResponse.json();
    return { data: user, error: null };
  } catch (err) {
    return { data: null, error: err };
  }
};

// ---
//
// ---
