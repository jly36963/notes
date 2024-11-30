// ---
// Constants
// ---

const USER_URL = "https://jsonplaceholder.typicode.com/users/1";

// ---
// Examples
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

const _basicPromiseFetch = () => {
	const fetchUser = () => {
		return fetch(USER_URL)
			.then((response) => response.json())
			.catch((e) => {
				throw e;
			});
	};

	fetchUser().then(console.log).catch(console.error);
};

const _basicAsyncAwait = async () => {
	const fetchUserAsync = async () => {
		const response = await fetch(USER_URL);
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
