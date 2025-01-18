<script>
	import { onMount } from 'svelte';
	import { firebaseApp } from '$lib/index.js';

	let inspirationalQuote = '';
	let name = '';

	async function fetchQuote() {
		const response = await fetch('https://api.quotable.io/random');
		const data = await response.json();
		inspirationalQuote = data.content;
	}

	onMount(async () => {
		await fetchQuote();

		const params = new URLSearchParams(window.location.search);
		name = params.get('name')?.toLowerCase().replace(/\s/g, '') || 'unknown';
		console.log('User name:', name);
	});
	function togglePopup() {
		showPopup = !showPopup;
	}
</script>

<div class="background">
	<div class="background-1">
		<div class="navbar">
			<img src="/logo.png" alt="logo" class="logo" />
		</div>
	</div>

	<div class="main-bg-container">
		<a href="/listener?name={name}" class="side-link-l">Listeners</a>

		<div class="main-bg"><img src="/bg3.gif" alt="bg3" class="bg" /></div>

		<a href="/myroom?name={name}" class="side-link">My Room</a>
		
	</div>

	<div class="quote-section">
		{inspirationalQuote}
	</div>

	<div class="bookmark-buttons">
		<a href="/journal?name={name}" class="bookmark-button journal">Journal</a>
		<a href="/chat?name={name}" class="bookmark-button schedule">AI Therapist</a>
	</div>
	<div class="neko">
		<a href="https://icallhelpline.org/" target="_blank" rel="noopener noreferrer" aria-label="iCall Helpline">
			<image src="/neko.gif" alt="neko" class="neko"></image>
		</a>
	</div>
</div>

<style>
	body {
		font-family: Arial, sans-serif;
		margin: 0;
		padding: 0;
	}

	.neko {
		position: absolute;
		bottom: 0;
		right: 39%;
		height: 200px;
		width: 200px;
		object-fit: contain;
	}

	.logo {
		width: 300px; /* Adjust the width as needed */
		height: auto; /* Maintain aspect ratio */
		object-fit: contain; /* Ensure the image fits within the container */
	}

	.background {
		position: absolute;
		height: fill-available;
		width: fill-available;

		flex-grow: 0;
		background-color: rgba(4, 35, 76, 1);
	}

	.background-1 {
		height: fit-content;
		width: fill-available;
		flex-grow: 0;
		background: #4f7ed6;
		flex-direction: column;
	}

	.navbar {
		height: 100px;
		flex-shrink: 0;

		display: flex;
		justify-content: center;
		align-items: center;
		background: linear-gradient(87deg, rgba(0, 208, 255, 0.5) -10.35%, rgba(0, 0, 0, 0) 118.16%),
			linear-gradient(85deg, rgba(0, 0, 0, 0) -37.4%, rgba(63, 4, 92, 0.5) 110.65%),
			linear-gradient(90deg, #10367e 0.07%, #1c62e4 100%);

		padding: 1rem;
	}

	.bg {
		height: 100%;
		width: 100%;
		object-fit: cover;
	}
	.main-bg-container {
		/* width: 1440px; */
		height: 520px;
		flex-shrink: 0;

		display: flex;
		align-items: stretch;
		justify-content: space-between;
		height: 300px;
	}

	.main-bg {
		flex-grow: 1;
		display: flex;
		justify-content: center;
		align-items: center;
		color: #333;
		font-size: 2rem;
		font-weight: bold;
	}

	.side-link {
		position: absolute;
		right: 0;
		height: 300px;
		writing-mode: vertical-rl;
		transform: rotate(180deg);
		text-decoration: none;
		color: white; /*font color*/
		font-size: 1rem;
		font-weight: bold;
		background: #10367e6d;
		text-align: center;
		padding: 1rem;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 50px; /* Fixed width for the side links */
		transition: background-color 0.3s ease;
	}
	.side-link-l {
		position: absolute;
		left: 0;
		height: 300px;
		writing-mode: vertical-rl;
		transform: rotate(180deg);
		text-decoration: none;
		color: white; /*font color*/
		font-size: 1rem;
		font-weight: bold;
		background: #10367e6d;
		text-align: center;
		padding: 1rem;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 50px; /* Fixed width for the side links */
		transition: background-color 0.3s ease;
	}

	.side-link:hover {
		color: cyan;
		background-color: #10367e;
		opacity: 1;
		transition: 0.5s;
	}

	.side-link-l:hover {
		color: cyan;
		background-color: #10367e;
		opacity: 1;
		transition: 0.5s;
	}

	.quote-section {
		width: 1440px;
		height: 150px;
		flex-shrink: 0;

		font-weight: bold;
		font-style: italic;

		color: aliceblue;
		background: linear-gradient(87deg, rgba(0, 208, 255, 0.5) -10.35%, rgba(0, 0, 0, 0) 118.16%),
			linear-gradient(85deg, rgba(0, 0, 0, 0) -37.4%, rgba(63, 4, 92, 0.5) 110.65%),
			linear-gradient(90deg, #10367e 0.07%, #1c62e4 100%);
		text-align: center;
		padding: 1.5rem;
		font-size: 1.5rem;
		width: 100%; /* Full screen width */
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
		box-shadow: 0px 12px 10px 0px rgba(0, 0, 0, 0.5);
	}

	.bookmark-buttons {
		display: flex;
		justify-content: space-between;

		padding: 0 4rem; /* Buttons closer to the screen edges */
		background-color: rgba(4, 35, 76, 1);
	}

	.bookmark-button {
		width: 45%; /* Adjusted width to fit both buttons */
		flex-shrink: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #20d5c8;
		text-decoration: none;
		color: rgb(0, 15, 53);
		font-size: 2rem;
		font-weight: bold;
		padding: 0.5rem 1rem; /* Adjusted padding */
		border-radius: 0 0 5px 5px;
		text-align: center;
		height: 81px;
		line-height: 50px;
		transition:
			height 0.3s ease,
			padding 0.3s ease;
		box-shadow: 5px 5px 5px 5px rgba(0, 0, 0, 0.25);
	}

	.bookmark-button.schedule {
		background-color: #8a2be2;
	}

	.bookmark-button:hover {
		height: 101px; /* Increase height on hover */
		line-height: 70px; /* Adjust line-height to keep text centered */
		padding: 0.5rem 8rem; /* Maintain consistent horizontal padding */
	}

	.popup {
		display: flex;
		justify-content: center;
		align-items: center;
		position: fixed;
		z-index: 1;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		overflow: auto;
		background-color: rgba(0, 0, 0, 0.4);
	}

	.popup-content {
		background-color: #fefefe;
		margin: auto;
		padding: 20px;
		border: 1px solid #888;
		width: 80%;
		max-width: 500px;
		border-radius: 10px;
	}

	.close {
		color: #aaa;
		float: right;
		font-size: 28px;
		font-weight: bold;
		cursor: pointer;
	}

	.close:hover,
	.close:focus {
		color: black;
		text-decoration: none;
		cursor: pointer;
	}
</style>
