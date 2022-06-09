// ---
// async
// ---

// ---
// promises
// ---

const _basicPromises = () => {
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
};

// ---
// fetch (promise based request)
// ---

const _basicPromiseFetch = () => {
  const fetchUser = () => {
    return fetch("https://jsonplaceholder.typicode.com/users/1")
      .then((response) => response.json())
      .catch((e) => {
        throw e;
      });
  };

  fetchUser().then(console.log).catch(console.error);
};

// ---
// async / await
// ---

const _basicAsyncAwait = async () => {
  const fetchUserAsync = async () => {
    const response = await fetch(
      "https://jsonplaceholder.typicode.com/users/1",
    );
    const user = await response.json();
    return user;
  };

  try {
    const result = await fetchUserAsync();
    console.log(result);
  } catch (err) {
    console.error(err);
  }
};

// ---
//
// ---
