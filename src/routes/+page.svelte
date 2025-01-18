<script>
    import { onMount } from 'svelte';

    let inspirationalQuote = 'test';
    let theme = 'blue';
    let themes = ['blue', 'maroon', 'rose', 'orange'];
    let currentThemeIndex = 0;

    onMount(() => {
        document.documentElement.classList.toggle('blue', theme === 'blue');
    });

    function toggleTheme() {
        currentThemeIndex = (currentThemeIndex + 1) % themes.length;
        theme = themes[currentThemeIndex];
        document.documentElement.classList.toggle('blue', theme === 'blue');
        document.documentElement.classList.toggle('maroon', theme === 'maroon');
        document.documentElement.classList.toggle('rose', theme === 'rose');
        document.documentElement.classList.toggle('orange', theme === 'orange');
    }

    function handleLogin() {
        window.location.href = '/login';
    }

    function handleSignup() {
        window.location.href = '/signup';
    }

    function handleGetStarted() {
        window.location.href = '/signup';
    }
</script>


<style>
	body {
		margin: 0;
		font-family: Arial, sans-serif;
		background-color: #081b3f;
		color: white;
	}

	.navbar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem 2rem;
		background-color: #1b3a6f;
		position: sticky;
		top: 0;
		z-index: 1000;
	}

	.navbar .logo {
		font-size: 1.5rem;
		font-weight: bold;
		color: #20d5c8;
	}

	.navbar .auth-buttons {
		display: flex;
		gap: 1rem;
	}

	.navbar button {
		background-color: #20d5c8;
		color: white;
		border: none;
		padding: 0.5rem 1.5rem;
		border-radius: 5px;
		font-size: 1rem;
		cursor: pointer;
		transition: background-color 0.3s ease;
	}

	.navbar button:hover {
		background-color: #1aa8a3;
	}

	.hero {
		text-align: center;
		padding: 4rem 2rem;
		background: linear-gradient(to bottom, #081b3f, #1b3a6f);
		min-height: calc(100vh - 72px);
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.hero h1 {
		font-size: 3rem;
		margin-bottom: 1rem;
	}

	.hero p {
		font-size: 1.2rem;
		margin-bottom: 2rem;
		color: #ddd;
		max-width: 600px;
	}

	.hero button {
		background-color: #20d5c8;
		color: white;
		border: none;
		padding: 0.75rem 2rem;
		border-radius: 5px;
		font-size: 1.2rem;
		cursor: pointer;
		transition: background-color 0.3s ease;
	}

	.hero button:hover {
		background-color: #1aa8a3;
	}
</style>

<div class="navbar">
	<div class="logo">TherapyAI</div>
	<div class="auth-buttons">
		<button on:click={handleLogin}>Login</button>
		<button on:click={handleSignup}>Sign Up</button>
	</div>
</div>

<div class="hero">
	<h1>Welcome to TherapyAI</h1>
	<p>Your personalized mental wellness companion. Start journaling your thoughts or connect with our AI therapist today.</p>
	<button on:click={handleGetStarted}>Get Started</button>
</div>
