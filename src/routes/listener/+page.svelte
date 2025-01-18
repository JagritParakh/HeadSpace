<script>
	import { onMount } from 'svelte';
	import { firebaseApp } from '$lib/index.js';
	import {
		getFirestore,
		collection,
		doc,
		setDoc,
		query,
		orderBy,
		onSnapshot,
		getCountFromServer
	} from 'firebase/firestore';

	let messages = [];
	let userInput = '';
	let loading = false;
	let anonymousName = '';
	let name = '';

	const db = getFirestore(firebaseApp);
	const forumCollection = collection(db, 'forumChat');

	// Generate anonymous username
	function generateAnonymousName(name) {
		const encrypted = btoa(name);
		return `Anonymous-${encrypted}`;
	}

	// Fetch current user info and listen to messages
	onMount(() => {
		const params = new URLSearchParams(window.location.search);
		name = params.get('name')?.toLowerCase().replace(/\s/g, '') || 'unknown';
		anonymousName = generateAnonymousName(name);

		// Listen to messages
		const q = query(forumCollection, orderBy('date', 'asc'), orderBy('time', 'asc'));

		// Listen to changes in the collection
		const unsubscribe = onSnapshot(q, (snapshot) => {
			messages = snapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data()
			}));

			// Scroll to the bottom
			const chatDiv = document.querySelector('.chat');
			chatDiv.scrollTop = chatDiv.scrollHeight;
		});

		// Clean up the listener on unmount
		return () => unsubscribe();
	});

	// Submit message
	async function sendMessage() {
		if (!userInput.trim()) return;

		loading = true;
		const date = new Date();
		const formattedDate = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
		const formattedTime = `${date.getHours()}.${date.getMinutes()}`;

		// Fetch the current count of messages
		const countSnapshot = await getCountFromServer(forumCollection);
		const msgNumber = countSnapshot.data().count + 1;

		const msgRef = doc(forumCollection, `msg${msgNumber}`);

		try {
			await setDoc(msgRef, {
				author: name || 'Unknown User',
				date: formattedDate,
				time: formattedTime,
				value: userInput.trim()
			});

			userInput = ''; // Clear input
		} catch (error) {
			console.error('Error adding message:', error);
		} finally {
			loading = false;
		}
	}
</script>

<div class="background">
	<div class="left-panel">
		<div class="container">
			<div class="friends">
				<button class="buttons">Friends</button>
			</div>
			<div class="listeners">
				<button class="buttons">Listeners</button>
			</div>
			<div class="groups">
				<button class="buttons">Groups</button>
			</div>
            <div class="neko">
                <a href="https://icallhelpline.org/" target="_blank" rel="noopener noreferrer" aria-label="iCall Helpline">
					<image src="/neko.gif" alt="neko" class="neko"></image>
				</a>
                
            </div>
		</div>
		<div class="helpline">
			<a href="https://icallhelpline.org/" target="_blank" rel="noopener noreferrer" aria-label="iCall Helpline"> 
				<button class="buttons">Helpline</button>
			</a>
		</div>
	</div>
	<div class="right-panel">
		<div class="navbar">
			<div class="title">HeadSpace</div>
			<div class="return">
				<a href="/home?name={name}">Home</a>
			</div>
		</div>
		<div class="container">
			<div class="chat">
				{#each messages as message (message.id)}
					<div class="message">
						<p><strong>Anonymous-{btoa(message.author).slice(0, 10)}:</strong></p>
						<p>{message.value}</p>
						<small>{message.date} {message.time}</small>
					</div>
				{/each}
			</div>
			<div class="input">
                <input
                    type="text"
                    placeholder="Type your message..."
                    class="input-field"
                    bind:value={userInput}
                />
                <button type="submit" class="send-btn" on:click|preventDefault={sendMessage} disabled={loading}>
                    Send
                </button>
            </div>
		</div>
	</div>
</div>

<style>
	body {
		font-family: Arial, sans-serif;
		margin: 0;
		padding: 0;
	}

    .neko{
		position: absolute;
		bottom: 0;
		right: 79%;
		height: 200px;
		width: 200px;
		object-fit: contain;
	}
	.background {
		height: 100vh;
		width: 100%;
		display: flex;
		background-color: rgba(4, 35, 76, 1);
	}

	.left-panel {
		width: 30%;
		height: 100%;
		background-color: #1E3A8A;
		color: white;
		display: flex;
		flex-direction: column;
	}

	.right-panel {
		width: 70%;
		background-color: #2563EB;
		color: white;
		display: flex;
		flex-direction: column;
	}

	.container {
		flex-grow: 1;
		display: flex;
		flex-direction: column;
	}

	.friends,
	.listeners,
	.groups,
	.helpline {
		background-color: #3B82F6;
		height: 25px;
	}

	.buttons {
		height: 100%;
		width: 100%;
		background-color: #8a2be2;
		padding: 10px;
		display: flex;
		justify-content: center;
		align-items: center;
		color: white;
		border: none;
		cursor: pointer;
	}

	.chat {
		background-color: #3B82F6;
		flex-grow: 1;
		overflow-y: auto;
		padding: 10px;
	}

	.message {
		margin-bottom: 10px;
		background-color: #e9ecef;
		color: black;
		padding: 10px;
		border-radius: 5px;
	}

	.input {
		height: 50px;
		display: flex;
		align-items: center;
		padding: 5px;
		background-color: white;
		width: 95%;
		margin: 0 auto;
		border-radius: 5px;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	}

	.input-field {
		flex-grow: 1;
		padding: 10px;
		border: 1px solid #ddd;
		border-radius: 5px;
		color: black; /* Set the font color to black */
	}

	.send-btn {
		padding: 10px 20px;
		background-color: #007bff;
		color: white;
		border: none;
		border-radius: 5px;
		cursor: pointer;
		margin-left: 10px;
	}

	.send-btn:disabled {
		background-color: #ccc;
		cursor: not-allowed;
	}

	.navbar {
		height: 50px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background-color: #1E3A8A;
		padding: 0 10px;
	}

	.navbar .title {
		font-size: 1.5rem;
		font-weight: bold;
	}

	.navbar .return a {
		color: white;
		text-decoration: none;
	}
</style>
