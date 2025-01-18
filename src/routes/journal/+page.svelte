<script>
	// import { initializeApp } from 'firebase/app';
	import {
		getFirestore,
		collection,
		getDocs,
		doc,
		setDoc,
		getDoc
	} from 'firebase/firestore';

	import { firebaseApp } from "$lib/index.js";
	import { model } from "$lib/gemini.js"

	const db = getFirestore(firebaseApp);

	let entries = []; // Store journal entries
	let loading = true; // Show loading indicator
	let userCollectionName = ''; // Example user's collection
	let lastAnalysis = ''; // Store the last analysis from AI
	let isAnalyzing = false; // Show loading state for analysis

	async function genAnalysis() {
		if (entries.length === 0) return; // Prevent analysis without entries

		isAnalyzing = true;
		try {
			const lastEntry = entries[entries.length - 1];
			const response = await model.generateContent(
				`You are tasked with analyzing a journal entry of a person. Your response should be in one line in this format. Emotion: x, Advice: y. Make sure that 'x' is a single word and 'y' is a short sentence. The journal entry is: ${lastEntry.content}`
			);
			lastAnalysis = response.response.text(); // Store the generated analysis

			// Save the analysis in Firestore
			const analysis = response.response.text();
			const analysisCollection = collection(db, 'journalAnalysis');
			const analysisRef = doc(analysisCollection, userCollectionName);
			await setDoc(analysisRef, {
				lastAnalysis: analysis
			});
		} catch (error) {
			console.error('Error generating analysis:', error);
		} finally {
			isAnalyzing = false;
		}
	}

	// Fetch journal entries from Firebase
	async function fetchEntries() {
		try {
			console.log('fetchEntries started');

			const journalRef = collection(db, 'journalEntries');
			const nameRef = doc(journalRef, 'names');
			const userCollection = collection(nameRef, userCollectionName);

			console.log('Fetching entries...');
			const querySnapshot = await getDocs(userCollection);

			if (querySnapshot.empty) {
				console.log('No entries found');
				return;
			}

			entries = [];
			querySnapshot.forEach((doc) => {
				entries.push({
					id: doc.id,
					...doc.data(),
				});
				console.log('Fetched doc:', doc.id, doc.data());
			});

			console.log('Entries:', entries);
		} catch (error) {
			console.error('Error fetching entries:', error);
		}
	}

	async function checkLastAnalysis() {
		const analysisCollection = collection(db, 'journalAnalysis');
		const analysisRef = doc(analysisCollection, userCollectionName);

		const analysisDoc = await getDoc(analysisRef);
		if(analysisDoc.data().lastAnalysis !== "Not analysed yet") {
			lastAnalysis = analysisDoc.data().lastAnalysis;
		}
	}

	// Navigate to the New Entry Page
	const goToNewEntryPage = () => {
		window.location.href = `/new-entry?name=${encodeURIComponent(userCollectionName)}`;
	};

	// Navigate to the Read Entry Page
	const goToReadPage = (entryNum) => {
		window.location.href = `/read-entry?name=${encodeURIComponent(userCollectionName)}&entry=${encodeURIComponent(entryNum)}`;
	};

	import { onMount } from 'svelte';

	onMount(async () => {
		const params = new URLSearchParams(window.location.search);
		userCollectionName = params.get('name')?.toLowerCase().replace(/\s/g, '') || 'unknown';
		console.log('User name:', name);

		console.log('checking for last analysis')
		await checkLastAnalysis();
		
		console.log('Calling fetchEntries...');
		await fetchEntries();
		loading = false;
		console.log('fetchEntries completed');

		
	});
</script>

<div class="background">

	<div class="navbar">
		<div class="title">Journal</div>
		<div class="return">
			<a href="/home?name={userCollectionName}">Back</a>
		</div>
	</div>
	<div class="container">
		<div class = "left-panel">
			{#if loading}
				<p>Loading...</p>
			{:else if entries.length === 0}
				<p>No journal entries found. Click the button below to add one!</p>
			{:else}
				{#each entries as entry (entry.id)}
					<div
						class="entry"
						on:click={() => goToReadPage(entry.id)}
						role="button"
						tabindex="0"
						aria-label="Open journal entry"
					>
						<div class="entry-header">
							<div>Date: {entry.date}</div>
							<div>Time: {entry.time}</div>
						</div>
						<div class="entry-content">{entry.title}</div>
					</div>
				{/each}
			{/if}
			<button class="new-entry-btn" on:click={goToNewEntryPage}>+ New Entry</button>
		</div>

		<div class="right-panel">
			<div class = "image">
				Image
			</div>
			<div class = "status">
				{#if loading}
					<p>Loading...</p>
				{:else if lastAnalysis}
					<p>{lastAnalysis}</p>
				{:else}
					<p>No previous analysis available</p>
				{/if}
			</div>
			<div class = "analysis">
				<button
					class="analyse-btn"
					on:click={genAnalysis}
					disabled={entries.length === 0 || isAnalyzing}
					>
					{isAnalyzing ? 'Analyzing...' : 'Analyse now'}
				</button>
			</div>
		</div>

	</div>
	
	
</div>

<style>
	body {
		font-family: Arial, sans-serif;		
		color: white;
	}

	.background {		
		height: 100%;
		width: 100%;
		background-color: #081b3f;
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


	.entry {
		background-color: #87a7df;
		border-radius: 5px;
		margin-bottom: 1rem;
		padding: 1rem;
		cursor:pointer;
		transition: background-color 0.3s ease;
	}

	.entry:hover {
		background-color: #1a4a8f;
	}

	.entry-header {
		display: flex;
		justify-content: space-between;
		font-size: 0.9rem;
		color: red;
		margin-bottom: 0.5rem;
	}

	.entry-content {
		font-size: 1.2rem;
	}

	.new-entry-btn {
		background-color: #20d5c8;
		color: rgb(0, 0, 0);
		font-size: 1rem;
		font-weight: bold;
		padding: 0.5rem 2rem;
		border-radius: 5px;
		text-decoration: none;
		display: inline-block;
		transition: background-color 0.3s ease;
		
		text-align: center;
	}

	.new-entry-btn:hover {
		background-color: #1aa8a3;
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

	.left-panel {
		position: absolute;
		height: 100%;
		width: 75%;
		padding: 1rem;
		gap: 1rem;
		left: 0;
	}

	.right-panel{
		position: absolute;
		width:25%;
		height: 100%;
		
		background-color: #aaa;
		right: 0;
	}

	.container {
		height: 100vh;
        width: 100%;
        display: flex;        
	}

	.container .right-panel .image {
		height: 50%;
		width: 90%;
		background-color: #dc1a1a;
		margin: 1rem ;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.container .right-panel .status {
		height: 20%;
		width: 100%;
		background-color: #dc1a1a;
		margin-bottom: 2rem;
	}
	.container .right-panel .analysis {
		position: relative;
		height: 5%;
		width: 100%;
		bottom: 0px;
		background-color: #dc981a;
	}

	.analyse-btn {
		padding: 0.5rem 1rem;
		font-size: 1rem;
		color: black;
		background-color: white;
		border: none;
		border-radius: 5px;
		cursor: pointer;
		transition: background-color 0.3s ease;
	}

	.analyse-btn:disabled {
		background-color: #ccc;
		cursor: not-allowed;
	}
</style>
