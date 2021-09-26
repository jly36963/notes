<!-- SVELTE -->

# install
npm i --save svelte rollup-plugin-svelte
# config
rollup.config.js

<!-- hello world -->

<script>
  let name = 'world';
</script>

<h1>Hello {name}</h1>

<!-- attributes -->

<script>
  let src = 'https://photo-site.com/endpoint'
</script>

<img src={src} alt="Someone doing something somewhere.">
<img {src} alt="Someone doing something somewhere.">

<!-- style components -->

<style>
	p {
		color: purple;
		font-family: 'Comic Sans MS', cursive;
		font-size: 2em;
	}
</style>

<p>This is a paragraph.</p>

<!-- nested components -->

<script>
  import Nested from './Nested.svelte';
</script>

<style>
	p {
		font-size: 2em;
	}
</style>

<p>
  Styles will only apply to the elements in this component.
  Styles won't leak into nested components.
</p>
<Nested />

<!-- string as html -->

<script>
	let content = '<strong>Hello!</strong>';
</script>

<p>{@html content}</p>

<!-- click events -->

<script>
	const onClick = () => {
		console.log('hello!');
	};
</script>

<button on:click={onClick}>
	Click Me!
</button>

<!-- reactive declarations (values that depend on others) -->

<script>
	// state
	let count = 0;
	// dependent on state (yes, this is weird syntax)
	$: doubled = count * 2;
	// event handler
	const onClick = () => {
		count += 1;
	};
</script>

<button on:click={onClick}>
	Click Me!
</button>

<p>
	count: {count}
	<br>
	doubled: {doubled}
</p>

<!-- reactive statements (do something when state changes) -->

<script>
	// state
	let count = 0;
	// event handler
	const onClick = () => {
		count += 1;
	};
	// reactive statements
	$: console.log(`count: ${count}`); // single line
	$: {
		console.log(`count: ${count}`); // multiline
	}
	$: if (count > 10) {
		console.log(`count: ${count}`); // with condition
	}
</script>

<button on:click={onClick}>
	Click Me!
</button>

<p>count: {count}</p>

<!-- updating arrays -->

<script>
	let integers = [1];
	$: sum = integers.reduce((a, b) => a + b, 0);
	const pushInteger = () => {
		const lastInteger = integers[integers.length - 1]
		const nextInteger = lastInteger + 1;
		integers = [...integers, nextInteger]; // assignment triggers svelte's reactivity
	}
</script>

<button on:click={pushInteger}>
	Click Me!
</button>

<p>sum: {sum}</p>

<!-- props (parent) -->

<script>
	import Nested from './Nested.svelte'
</script>

<Nested answer={42}/>

<!-- props (child) -->

<script>
	export let answer; // yes, this is weird syntax
</script>

<p>answer: {answer}</p>

<!-- props (child) (default) -->

<script>
	export let answer = 8; // default value
</script>

<p>answer: {answer}</p>


<!-- spread props (parent) -->

<script>
	import Info from './Info.svelte';

	const pkg = {
		name: 'svelte',
		version: 3,
		speed: 'blazing',
		website: 'https://svelte.dev'
	};
</script>

<Info name={pkg.name} version={pkg.version} speed={pkg.speed} website={pkg.website}/>
<Info {...pkg} />

<!-- spread props (child) -->

<script>
	export let name;
	export let version;
	export let speed;
	export let website;
</script>

<p>
	The <code>{name}</code> package is {speed} fast.
	Download version {version} from <a href="https://www.npmjs.com/package/{name}">npm</a>
	and <a href={website}>learn more here</a>
</p>

<!-- if -->

<script>
	let user = { loggedIn: false };

	function toggle() {
		user.loggedIn = !user.loggedIn;
	}
</script>

{#if user.loggedIn}
	<button on:click={toggle}>
		Log out
	</button>
{/if}

{#if !user.loggedIn}
	<button on:click={toggle}>
		Log in
	</button>
{/if}


<!-- if else -->
<!-- # : / -->

<script>
	let user = { loggedIn: false };

	function toggle() {
		user.loggedIn = !user.loggedIn;
	}
</script>

{#if user.loggedIn}
	<button on:click={toggle}>
		Log out
	</button>
{:else}
	<button on:click={toggle}>
		Log in
	</button>
{/if}

<!-- if, else if, else  -->

<script>
	let x = 7;
</script>

{#if x > 10}
	<p>{x} is greater than 10</p>
{:else if 5 > x}
	<p>{x} is less than 5</p>
{:else}
	<p>{x} is between 5 and 10</p>
{/if}


<!-- each (loop over array) -->

<script>
	let cats = [
		{ id: 'J---aiyznGQ', name: 'Keyboard Cat' },
		{ id: 'z_AbfPXTKms', name: 'Maru' },
		{ id: 'OUtn3pvWmpg', name: 'Henri The Existential Cat' }
	];
</script>

<ul>
	{#each cats as cat}
		<li><a target="_blank" href="https://www.youtube.com/watch?v={cat.id}">
			{cat.name}
		</a></li>
	{/each}
</ul>

{#each cats as cat, i}
	<li><a target="_blank" href="https://www.youtube.com/watch?v={cat.id}">
		{i + 1}: {cat.name}
	</a></li>
{/each}

{#each cats as { id, name }}
	<li><a target="_blank" href="https://www.youtube.com/watch?v={id}">
		{name}
	</a></li>
{/each}

<!-- keyed each blocks (parent) -->

<script>
	import Thing from './Thing.svelte';
	let things = [
		{ id: 1, color: '#0d0887' },
		{ id: 2, color: '#6a00a8' },
		{ id: 3, color: '#b12a90' },
		{ id: 4, color: '#e16462' },
		{ id: 5, color: '#fca636' }
	];

	const handleClick = () => {
		things = things.slice(1);
	}
</script>

<button on:click={handleClick}>
	Remove first thing
</button>

{#each things as thing (thing.id)}
	<Thing current={thing.color}/>
{/each}

<!-- keyed each blocks (parent) -->

<script>
	// `current` is updated whenever the prop value changes...
	export let current;
	// ...but `initial` is fixed upon initialisation
	const initial = current;
</script>

<p>
	<span style="background-color: {initial}">initial</span>
	<span style="background-color: {current}">current</span>
</p>

<style>
	span {
		display: inline-block;
		padding: 0.2em 0.5em;
		margin: 0 0.2em 0.2em 0;
		width: 4em;
		text-align: center;
		border-radius: 0.2em;
		color: white;
	}
</style>

<!-- await blocks -->

<script>
	let number = (async () => {
		result = await getRandomNumber();
		return result;
	})
</script>

{#await promise then value}
	<p>the value is {value}</p>
{/await}

{#await promise}
	<p>...waiting</p>
{:then number}
	<p>The number is {number}</p>
{:catch error}
	<p style="color: red">{error.message}</p>
{/await}

<!-- events -->

<script>
	let m = { x: 0, y: 0 };

	function handleMousemove(e) {
		m.x = e.clientX;
		m.y = e.clientY;
	}
</script>

<div on:mousemove={handleMousemove}>
	The mouse position is {m.x} x {m.y}
</div>

<!-- events (inline) -->

<script>
	let m = { x: 0, y: 0 };
</script>

<div on:mousemove={e => m = { x: e.clientX, y: e.clientY }}>
	The mouse position is {m.x} x {m.y}
</div>

<!-- event modifiers -->
<!-- preventDefault, stopPropogation, passive, capture, once, self -->

<script>
	const handleClick = () => console.log('pressed');
</script>

<button on:click|once|preventDefault={handleClick}>
	Click me
</button>

<!-- displatch events (parent) -->

<script>
	import Inner from './Inner.svelte';
	const handleMessage = (e) => {
		console.log(e.type);
		console.log(e.detail.text);
	}
</script>

<Inner on:message={handleMessage}/>

<!-- displatch events (child) -->

<script>
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
	const sayHello = () => {
		dispatch('message', {
			text: 'Hello'
		});
	}
</script>

<button on:click={sayHello}>
	Click to say hello
</button>


<!-- event forwarding -->
<!-- https://svelte.dev/tutorial/event-forwarding -->
<!-- https://svelte.dev/tutorial/dom-event-forwarding -->

<!-- data binding (text inputs) -->

<script>
	// object
	let person = {
		firstName: '',
		lastName: '',
	}
	// reactive declaration
	$: fullName = `${person.firstName} ${person.lastName}`;
	// event handler
	const onSubmit = (e) => {
		e.preventDefault(); // can be handled by "on:click|preventDefault"
		console.log(fullName)
	}
</script>

<form>
	<input type="text" name="firstName" bind:value={person.firstName}>
	<br>
	<input type="text" name="lastName" bind:value={person.lastName}>
	<br>

	<button on:click={onSubmit}>
		Log
	</button>
</form>

<p>fullName: {fullName}</p>


<!-- data binding (numeric inputs) -->

<script>
	let a = 1;
	let b = 2;
</script>

<label>
	<input type=number bind:value={a} min=0 max=10>
	<input type=range bind:value={a} min=0 max=10>
</label>

<label>
	<input type=number bind:value={b} min=0 max=10>
	<input type=range bind:value={b} min=0 max=10>
</label>

<p>{a} + {b} = {a + b}</p>

<!-- checkbox -->

<script>
	let subscribe = false;
</script>

<label>
	<input type=checkbox bind:checked={subscribe}>
	Yes! Please subscribe me to further updates.
</label>

{#if subscribe}
	<p>Thank you. We will bombard your inbox and sell your personal details.</p>
{:else}
	<p>You must opt in to continue. If you're not paying, you're the product.</p>
{/if}

<button disabled={!subscribe}>
	Subscribe
</button>

<!-- group inputs (radio and checkbox) -->

<script>
	let scoops = 1;
	let flavours = ['Mint choc chip'];
	
	let menu = [
		'Cookies and cream',
		'Mint choc chip',
		'Raspberry ripple'
	];
	
	let scoopOptions = [
		'One Scoop',
		'Two Scoops',
		'Three Scoops',
	]

	function join(flavours) {
		if (flavours.length === 1) return flavours[0];
		return `${flavours.slice(0, -1).join(', ')} and ${flavours[flavours.length - 1]}`;
	}
</script>

<h2>Size</h2>

{#each scoopOptions as scoopOption}
	<label>
		<input type=radio bind:group={scoops} value={scoopOption} />
    {scoopOption}
	</label>
{/each}

<h2>Flavours</h2>

{#each menu as flavour}
	<label>
		<input type=checkbox bind:group={flavours} value={flavour}>
		{flavour}
	</label>
{/each}

{#if flavours.length === 0}
	<p>Please select at least one flavour</p>
{:else if flavours.length > scoops}
	<p>Can't order more flavours than scoops!</p>
{:else}
	<p>
		You ordered {scoops} {scoops === 1 ? 'scoop' : 'scoops'}
		of {join(flavours)}
	</p>
{/if}


<!-- textarea -->

<script>
	import marked from 'marked';
	let value = `Some words are *italic*, some are **bold**`;
</script>

<style>
	textarea { width: 100%; height: 200px; }
</style>

<textarea bind:value={value}></textarea>

{@html marked(value)}

<!-- select -->

<script>
	let questions = [
		{ id: 1, text: `Where did you go to school?` },
		{ id: 2, text: `What is your mother's name?` },
		{ id: 3, text: `What is another personal fact that an attacker could easily find with Google?` }
	];

	let selected;

	let answer = '';

	function handleSubmit() {
		alert(`answered question ${selected.id} (${selected.text}) with "${answer}"`);
	}
</script>

<style>
	input { display: block; width: 500px; max-width: 100%; }
</style>

<h2>Insecurity questions</h2>

<form on:submit|preventDefault={handleSubmit}>
	<select bind:value={selected} on:blur="{() => answer = ''}">
		{#each questions as question}
			<option value={question}>
				{question.text}
			</option>
		{/each}
	</select>

	<input bind:value={answer}>

	<button disabled={!answer} type=submit>
		Submit
	</button>
</form>

<p>selected question {selected ? selected.id : '[waiting...]'}</p>

<!-- select multiple -->

<script>
	let scoops = 1;
	let flavours = ['Mint choc chip'];
	
	let scoopOptions = [
		'One Scoop',
		'Two Scoops',
		'Three Scoops',
	]

	let menu = [
		'Cookies and cream',
		'Mint choc chip',
		'Raspberry ripple'
	];

	function join(flavours) {
		if (flavours.length === 1) return flavours[0];
		return `${flavours.slice(0, -1).join(', ')} and ${flavours[flavours.length - 1]}`;
	}
</script>

<h2>Size</h2>

{#each scoopOptions as scoopOption}
	<label>
		<input type=radio bind:group={scoops} value={scoopOption} />
    {scoopOption}
	</label>
{/each}

<h2>Flavours</h2>

<select multiple bind:value={flavours}>
	{#each menu as flavour}
		<option value={flavour}>
			{flavour}
		</option>
	{/each}
</select>

{#if flavours.length === 0}
	<p>Please select at least one flavour</p>
{:else if flavours.length > scoops}
	<p>Can't order more flavours than scoops!</p>
{:else}
	<p>
		You ordered {scoops} {scoops === 1 ? 'scoop' : 'scoops'}
		of {join(flavours)}
	</p>
{/if}

<!-- content editable -->

<script>
	let html = '<p>Write some text!</p>';
</script>

<div contenteditable="true" bind:innerHTML={html}></div>

<pre>{html}</pre>

<style>
	[contenteditable] {
		padding: 0.5em;
		border: 1px solid #eee;
		border-radius: 4px;
	}
</style>

<!-- each block bindings (use event handlers instead for immutable data) -->

<script>
	let todos = [
		{ done: false, text: 'finish Svelte tutorial' },
		{ done: false, text: 'build an app' },
		{ done: false, text: 'world domination' }
	];

	function add() {
		todos = todos.concat({ done: false, text: '' });
	}

	function clear() {
		todos = todos.filter(t => !t.done);
	}

	$: remaining = todos.filter(t => !t.done).length;
</script>

<style>
	.done {
		opacity: 0.4;
	}
</style>

<h1>Todos</h1>

{#each todos as todo}
	<div class:done={todo.done}>
		<input
			type=checkbox
			bind:checked={todo.done}
		>

		<input
			placeholder="What needs to be done?"
			bind:value={todo.text}
		>
	</div>
{/each}

<p>{remaining} remaining</p>

<button on:click={add}>
	Add new
</button>

<button on:click={clear}>
	Clear completed
</button>


<!-- media audio video (bindings) -->
<!-- https://svelte.dev/tutorial/media-elements -->


<!-- this (bindings) -->
<!-- https://svelte.dev/tutorial/bind-this -->


<!-- component bindings (parent) -->

<script>
	import Keypad from './Keypad.svelte';
	
	let pin;
	$: view = pin ? pin.replace(/\d(?!$)/g, '•') : 'enter your pin';
	
	function handleSubmit() {
		alert(`submitted ${pin}`);
	}
</script>

<h1 style="color: {pin ? '#333' : '#ccc'}">{view}</h1>

<Keypad bind:value={pin} on:submit={handleSubmit}/>

<!-- component bindings (child) -->

<script>
	import { createEventDispatcher } from 'svelte';

	export let value = '';

	const dispatch = createEventDispatcher();

	const select = num => () => value += num;
	const clear  = () => value = '';
	const submit = () => dispatch('submit');
</script>

<style>
	.keypad {
		display: grid;
		grid-template-columns: repeat(3, 5em);
		grid-template-rows: repeat(4, 3em);
		grid-gap: 0.5em
	}

	button {
		margin: 0
	}
</style>

<div class="keypad">
	<button on:click={select(1)}>1</button>
	<button on:click={select(2)}>2</button>
	<button on:click={select(3)}>3</button>
	<button on:click={select(4)}>4</button>
	<button on:click={select(5)}>5</button>
	<button on:click={select(6)}>6</button>
	<button on:click={select(7)}>7</button>
	<button on:click={select(8)}>8</button>
	<button on:click={select(9)}>9</button>

	<button disabled={!value} on:click={clear}>clear</button>
	<button on:click={select(0)}>0</button>
	<button disabled={!value} on:click={submit}>submit</button>
</div>

<!-- lifecycle (onMount) -->

<script>
	import { onMount } from 'svelte';

	let photos = [];

	const fetchPhotos = async () => {
		const res = await fetch(`https://jsonplaceholder.typicode.com/photos?_limit=20`);
		photos = await res.json();
	}

	onMount(fetchPhotos());
</script>

<style>
	.photos {
		width: 100%;
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		grid-gap: 8px;
	}

	figure, img {
		width: 100%;
		margin: 0;
	}
</style>

<h1>Photo album</h1>

<div class="photos">
	{#each photos as photo}
		<figure>
			<img src={photo.thumbnailUrl} alt={photo.title}>
			<figcaption>{photo.title}</figcaption>
		</figure>
	{:else}
		<!-- this block renders when photos.length === 0 -->
		<p>loading...</p>
	{/each}
</div>

<!-- lifecycle (onDestroy) -->

<script>
	import { onDestroy } from 'svelte';

	let seconds = 0;
	const interval = setInterval(() => seconds += 1, 1000);

	onDestroy(() => clearInterval(interval));
</script>

<p>
	The page has been open for
	{seconds} {seconds === 1 ? 'second' : 'seconds'}
</p>


<!-- beforeUpdate afterUpdate -->
<!-- https://svelte.dev/tutorial/update -->

<script>
	import { beforeUpdate, afterUpdate } from 'svelte';

	let count = 0;
	// event
	const onClick = () => {
		count += 1;
	};
	// lifecycle
	beforeUpdate(() => {
		console.log('before DOM has updated')
	})
	afterUpdate(() => {
		console.log('after DOM has updated')
	})
</script>


<button on:click={onClick}>
	Click Me!
</button>

<p>count: {count}</p>

<!-- writeable stores -->
<!-- https://svelte.dev/tutorial/writable-stores -->

<script>
	import { onDestroy } from 'svelte';
	import { writable } from 'svelte/store';
	// store
	const count = writable(0); // 'subscribe', 'update' and 'set' methods
	// state
	let count_value;
	// subscription
	const unsubscribe = count.subscribe(value => {
		count_value = value;
	});
	// update & set (store)
	const increment = () => {
		count.update(n => n + 1);
	}
	const decrement = () => {
		count.update(n => n - 1);
	}
	const reset = () => {
		count.set(0);
	}
	// lifecycle (cleanup)
	onDestroy(unsubscribe);
</script>

<h1>The count is {count_value}</h1>

<button on:click={increment}>+</button>
<button on:click={decrement}>-</button>
<button on:click={reset}>reset</button>

<!-- auto-subscriptions (easier stores) -->

<script>
	import { writable } from 'svelte/store';
	// store
	const count = writable(0); // 'subscribe', 'update' and 'set' methods
	// update & set (store)
	const increment = () => {
		count.update(n => n + 1);
	}
	const decrement = () => {
		count.update(n => n - 1);
	}
	const reset = () => {
		count.set(0);
	}
</script>

<h1>The count is {$count}</h1>

<button on:click={increment}>+</button>
<button on:click={decrement}>-</button>
<button on:click={reset}>reset</button>


<!-- readable stores -->

<script>
	import { readable } from 'svelte/store';

	// clock
	const start = (set) => {
		// interval
		const interval = setInterval(() => {
			set(new Date());
		}, 1000);
		// cleanup
		return () => {
			clearInterval(interval);
		}
	};
	// readable store
	const time = readable(new Date(), start);
	// formatter
	const formatter = new Intl.DateTimeFormat('en', {
		hour12: true,
		hour: 'numeric',
		minute: '2-digit',
		second: '2-digit'
	});
</script>

<h1>The time is {formatter.format($time)}</h1>

<!-- derived stores -->

<script>
	import { readable, derived } from 'svelte/store';

	// clock
	const begin = (set) => {
		// interval
		const interval = setInterval(() => {
			set(new Date());
		}, 1000);
		// cleanup
		return () => {
			clearInterval(interval);
		}
	};
	// readable store
	const time = readable(new Date(), begin);
	const start = new Date();
	// derived store
	const elapsed = derived(
		time, // store
		$time => Math.round(($time - start) / 1000) // callback
	);
	// formatter
	const formatter = new Intl.DateTimeFormat('en', {
		hour12: true,
		hour: 'numeric',
		minute: '2-digit',
		second: '2-digit'
	});
</script>

<h1>The time is {formatter.format($time)}</h1>
<p>
	This page has been open for
	{$elapsed} {$elapsed === 1 ? 'second' : 'seconds'}
</p>

<!-- custom stores -->

<script>
	import { writable } from 'svelte/store';
	// store
	const count = (() => {
		const { subscribe, set, update } = writable(0);
		return {
			subscribe,
			increment: () => update(n => n + 1),
			decrement: () => update(n => n - 1),
			reset: () => set(0)
		}
	})();
</script>

<h1>The count is {$count}</h1>

<button on:click={count.increment}>+</button>
<button on:click={count.decrement}>-</button>
<button on:click={count.reset}>reset</button>

<!-- store bindings -->

<script>
	import { writable, derived } from 'svelte/store';

	const name = writable('friend');
	const greeting = derived(
		name,
		$name => `Hello ${$name}!`
	);
</script>

<h1>{$greeting}</h1>
<input bind:value={$name}>

<!-- motion -->
<!-- https://svelte.dev/tutorial/tweened -->
<!-- https://svelte.dev/tutorial/spring -->
<!-- https://svelte.dev/tutorial/transition -->
<!-- https://svelte.dev/tutorial/adding-parameters-to-transitions -->
<!-- https://svelte.dev/tutorial/in-and-out -->
<!-- https://svelte.dev/tutorial/custom-css-transitions -->
<!-- https://svelte.dev/tutorial/custom-js-transitions -->
<!-- https://svelte.dev/tutorial/transition-events -->
<!-- https://svelte.dev/tutorial/local-transitions -->
<!-- https://svelte.dev/tutorial/deferred-transitions -->

<!-- animations -->
<!-- https://svelte.dev/tutorial/animate -->

<!-- actions -->
<!-- https://svelte.dev/tutorial/actions -->
<!-- https://svelte.dev/tutorial/adding-parameters-to-actions -->

<!-- classes -->
<!-- https://svelte.dev/tutorial/classes -->
<!-- https://svelte.dev/tutorial/class-shorthand -->


<!-- class directive (add a class, based on condition) -->

<script>
	let buttonVisible = false;
</script>

<button
	class:hidden={!buttonVisible}
	on:click={() => console.log('hi!')}
>
	
</button>

<!-- component composition (parent) -->

<div class="box">
	<slot>
		<p>No Content Provided (backup text)</p>
	</slot>
</div>

<!-- component composition (child) -->

<script>
	import Box from './Box.svelte';
</script>

<Box>
	<h2>Hello!</h2>
	<p>This is a box. It can contain anything.</p>
</Box>


<!-- named slots (parent) -->

<article class="contact-card">
	<h2>
		<slot name="name">
			<span class="missing">Unknown name</span>
		</slot>
	</h2>

	<div class="address">
		<slot name="address">
			<span class="missing">Unknown address</span>
		</slot>
	</div>

	<div class="email">
		<slot name="email">
			<span class="missing">Unknown email</span>
		</slot>
	</div>
</article>

<!-- named slots (child) -->

<script>
	import ContactCard from './ContactCard.svelte';
</script>

<ContactCard>
	<span slot="name">
		P. Sherman
	</span>

	<span slot="address">
		42 Wallaby Way<br>
		Sydney
	</span>
</ContactCard>


<!-- composition (slot props) -->
<!-- https://svelte.dev/tutorial/slot-props -->

<!-- context api (setContext getContext) -->
<!-- https://svelte.dev/tutorial/context-api -->

<!-- special elements (self) -->
<!-- https://svelte.dev/tutorial/svelte-self -->

<!-- special elements (component) -->
<!-- https://svelte.dev/tutorial/svelte-component -->

<!-- special elements (window) -->
<!-- https://svelte.dev/tutorial/svelte-window -->

<!-- special elements (window bindings) -->
<!-- https://svelte.dev/tutorial/svelte-window-bindings -->

<!-- special elements (body) -->
<!-- https://svelte.dev/tutorial/svelte-body -->

<!-- special elements (head) -->
<!-- https://svelte.dev/tutorial/svelte-head -->

<svelte:head>
	<link rel="stylesheet" href="tutorial/dark-theme.css">
</svelte:head>

<h1>Hello world!</h1>

<!-- special elements (options) -->
<!-- https://svelte.dev/tutorial/svelte-options -->

<!-- module context -->
<!-- https://svelte.dev/tutorial/sharing-code -->

<!-- module exports -->
<!-- https://svelte.dev/tutorial/module-exports -->


<!--  -->


<!--  -->


<!--  -->


<!--  -->


