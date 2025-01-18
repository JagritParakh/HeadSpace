<script>
	// import { initializeApp } from 'firebase/app';
	import {
		getAuth,
		GoogleAuthProvider,
		signInWithPopup,
		onAuthStateChanged
	} from 'firebase/auth';

	// Firebase configuration
	import { firebaseApp } from "$lib/index.js";
	const auth = getAuth(firebaseApp);

	const provider = new GoogleAuthProvider();

	let user = null; // To store user information

	// Handle Google Login
	async function loginWithGoogle() {
		try {
			const result = await signInWithPopup(auth, provider);
			user = result.user;
			console.log('User logged in:', user);
			const name = user.displayName;
			// Convert name to lowercase and remove all whitespaces. E.g "Jagrit Parakh" => "jagritparakh"
			const displayName = name.toLowerCase().replace(/\s/g, '');
			// Optionally redirect to a dashboard or homepage
			window.location.href = `/home?name=${displayName}`; // Replace with your desired route
		} catch (error) {
			console.error('Error logging in with Google:', error.message);
		}
	}

	// Monitor authentication state
	onAuthStateChanged(auth, (currentUser) => {
		user = currentUser;
		if (user) {
			console.log('User is logged in:', user);
		}
	});
</script>

<style>
	body {
		margin: 0;
		font-family: Arial, sans-serif;
		background-color: #081b3f;
		color: white;
	}

	.container {
		text-align: center;
		padding: 2rem;
	}

	.login-card {
		background-color: #1b3a6f;
		padding: 2rem;
		border-radius: 10px;
		display: inline-block;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
	}

	.login-card h1 {
		margin-bottom: 1rem;
		font-size: 2rem;
		color: #20d5c8;
	}

	.login-card p {
		font-size: 1rem;
		margin-bottom: 2rem;
		color: #ccc;
	}

	.login-card button {
		background-color: #20d5c8;
		color: white;
		border: none;
		padding: 0.75rem 2rem;
		border-radius: 5px;
		font-size: 1.2rem;
		cursor: pointer;
		transition: background-color 0.3s ease;
	}

	.login-card button:hover {
		background-color: #1aa8a3;
	}
</style>

<div class="container">
	<div class="login-card">
		<h1>Login</h1>
		<p>Sign in to your TherapyAI account using your Google account.</p>
		<button on:click={loginWithGoogle}>Login with Google</button>
	</div>
</div>
