<script>
	// import { initializeApp } from 'firebase/app';
	import {
		getFirestore,
		collection,
		addDoc,
		doc,
		getCountFromServer,
		setDoc
	} from 'firebase/firestore';
	import { firebaseApp } from '$lib/index.js';
	const db = getFirestore(firebaseApp);

	let name = ''; // User's collection name
	let entryTitle = ''; // Stores title content
	let entryContent = ''; // Stores textarea content

	// Save the journal entry to Firestore
	async function saveEntry() {
		const date = new Date();

		// const formattedDate = `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
		//The date should be in the format of DD-MM-YY
		const formattedDate = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
		const formattedTime = `${date.getHours()}.${date.getMinutes()}`;

		if (!entryTitle.trim() || !entryContent.trim()) {
			alert('Please add both a title and content before saving!');
			return;
		}

		// console.log(date)
		console.log(formattedDate);
		console.log(formattedTime);
		console.log(entryContent);
		console.log(entryTitle);

		try {
			const journalRef = collection(db, 'journalEntries');
			const nameRef = doc(journalRef, 'names');
			const userCollection = collection(nameRef, name);

			// Get the current entry count
			const countSnapshot = await getCountFromServer(userCollection);
			const entryNumber = countSnapshot.data().count + 1;

			// Add new journal entry
			const entryRef = doc(userCollection, `entry${entryNumber}`);

			await setDoc(entryRef, {
				title: entryTitle,
				content: entryContent,
				date: formattedDate,
				time: formattedTime
			});

			if (entryNumber === 1) {
				const journalAnalysisCol = collection(db, 'journalAnalysis');
				const analysisRef = doc(journalAnalysisCol, name);

				await setDoc(analysisRef, {
					lastAnalysis: 'Not analysed yet'
				});
			}

			window.location.href = `/journal?name=${name}`; // Navigate back to the journal page
		} catch (error) {
			console.error('Error saving entry:', error);
			alert('Failed to save the entry. Please try again.');
		}
	}

	import { onMount } from 'svelte';

	onMount(() => {
		console.log('New Entry Page Mounted');

		// Retrieve user name from query parameters
		const params = new URLSearchParams(window.location.search);
		name = params.get('name')?.toLowerCase().replace(/\s/g, '') || 'unknown';
		console.log('User name:', name);
	});
</script>

<div class="background">
	<div class="navbar">
		<div class="title">New Journal Entry</div>
		<div class="return">
			<a href="javascript:history.back()">Back</a>
		</div>
	</div>

	<textarea
		bind:value={entryTitle}
		placeholder="Enter the title of your journal entry..."
		class="title-input"
	></textarea>
	<textarea
		bind:value={entryContent}
		placeholder="Write your journal entry here..."
		class="content-input"
	></textarea>
	<button class="save-btn" on:click={saveEntry}>Save Entry</button>
</div>

<style>
	body {
		font-family: Arial, sans-serif;
		margin: 0;
		padding: 0;
		background-color: #081b3f;
		color: white;
	}

	.background {
		position: absolute;
		height: 100%;
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		background-color: #081b3f;
	}

	.navbar {
		position: absolute;
		top: 0;
		width: 100%;
		height: 50px;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #1b3a6f;
		padding: 1rem;
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

	.navbar .title {
		font-size: 1.5rem;
		font-weight: bold;
	}

	textarea {
		width: 100%;
		max-width: 600px;
		border: none;
		padding: 1rem;
		font-size: 1rem;
		resize: none;
		background-color: #1b3a6f;
		color: white;
	}

	textarea::placeholder {
		color: #aaa;
	}

	.title-input {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 75px;
		font-size: 1.2rem;
		border-bottom: none;
		border-top-left-radius: 5px;
		border-top-right-radius: 5px;
		background-color: cadetblue;
	}

	.content-input {
		height: 400px;
		border-top: none;
		border-bottom-left-radius: 5px;
		border-bottom-right-radius: 5px;
	}

	.save-btn {
		background-color: #20d5c8;
		color: white;
		font-size: 1rem;
		font-weight: bold;
		padding: 0.5rem 2rem;
		border-radius: 5px;
		text-decoration: none;
		transition: background-color 0.3s ease;
		text-align: center;
		display: inline-block;
		margin-top: 1rem;
	}

	.save-btn:hover {
		background-color: #1aa8a3;
	}
</style>
