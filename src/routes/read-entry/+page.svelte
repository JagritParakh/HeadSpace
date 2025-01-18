<script>
    import { initializeApp } from 'firebase/app';
	import {
		getFirestore,
		doc,
		getDoc
	} from 'firebase/firestore';
	import { firebaseApp } from "$lib/index.js";
	const db = getFirestore(firebaseApp);

	let name = 'unknown'; // User name from query parameters
	let entryNum = 'unknown'; // Entry number from query parameters
	let title = '';
	let content = '';
	let date = '';
	let time = '';
	let loading = true; // Show loading indicator

	// Fetch the journal entry data
	async function fetchEntry() {
		try {
			const journalRef = doc(db, 'journalEntries/names', name, entryNum);
			const docSnap = await getDoc(journalRef);

			if (docSnap.exists()) {
				const data = docSnap.data();
				title = data.title || 'Untitled';
				content = data.content || 'No content available.';
				date = data.date || 'Unknown';
				time = data.time || 'Unknown';
			} else {
				console.error('No such entry found!');
			}
		} catch (error) {
			console.error('Error fetching entry:', error);
		} finally {
			loading = false;
		}
	}

	import { onMount } from 'svelte';
	onMount(async () => {
		
		// Retrieve user name and entry number from query parameters
		const params = new URLSearchParams(window.location.search);
		name = params.get('name')?.toLowerCase().replace(/\s/g, '') || 'unknown';
		entryNum = params.get('entry')?.toLowerCase().replace(/\s/g, '') || 'unknown';

		console.log('User name:', name);
		console.log('Entry number:', entryNum);

		await fetchEntry();
	});
</script>

<div class="navbar">
	<div class="title">Read Journal Entry</div>
	<div class="return">
		<a href="javascript:history.back()">Back</a>
	</div>
</div>

<div class="container">
	{#if loading}
		<p>Loading entry...</p>
	{:else}
		<div class="entry">
			<div class="entry-header">
				<h2>{title}</h2>
				<p>Date: {date}</p>
				<p>Time: {time}</p>
			</div>
			<div class="entry-content">{content}</div>
		</div>
	{/if}
</div>

<style>
	body {
		font-family: Arial, sans-serif;
		margin: 0;
		padding: 0;
		background-color: #081b3f;
		color: white;
	}

	.navbar {
		height: 50px;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #1b3a6f;
		padding: 1rem;
	}

	.navbar .title {
		font-size: 1.5rem;
		font-weight: bold;
	}

	.container {
		padding: 1rem;
		width: 80%;
	}

	.entry {
		background-color: #1b3a6f;
		border-radius: 5px;
		padding: 1rem;
		margin: 1rem 0;
	}

	.entry-header {
		margin-bottom: 1rem;
	}

	.entry-header h2 {
		margin: 0;
		font-size: 1.8rem;
	}

	.entry-header p {
		margin: 0.5rem 0;
		color: #f80000;
	}

	.entry-content {
		font-size: 1.2rem;
		line-height: 1.6;
	}

	.navbar .return {   
        position: absolute;   
        height: 50px; 
        background-color: #e2886f;                          
        right: 0;
        padding: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>
