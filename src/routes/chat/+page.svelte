<script>
    import { onMount, afterUpdate } from 'svelte';
    import { model } from '$lib/gemini.js';

    let userInput = '';
    let chatLog = [];
    let loading = false;
    let chatContainer;
    let name = ''
    function goHome() {
        window.location.href = `/home?name=${name}`;
    }

    afterUpdate(() => {
        if (chatContainer) {
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }
    });

    async function sendMessage() {
        if (!userInput.trim()) return;

        chatLog = [...chatLog, { sender: 'user', message: userInput }];
        const userMessage = userInput;
        userInput = '';
        loading = true;

        try {
            const response = await model.generateContent(
                `You are a therapist talking to a patient. Like a therapist, analyse the users message and try to give them some advice on their problem: ${userMessage}. Don't make the response too long. For context, this is the previous chatlog: ${chatLog.map(chat => chat.message).join(' ')}.`
            );
            const msg = response.response.text();

            chatLog = [...chatLog, { sender: 'bot', message: msg }];
        } catch (error) {
            console.error('Error communicating with the AI:', error);
            chatLog = [...chatLog, { sender: 'bot', message: 'An error occurred. Please try again later.' }];
        } finally {
            loading = false;
        }
        console.log(chatLog);
    }
    onMount(() =>{
        const params = new URLSearchParams(window.location.search);
		name = params.get('name')?.toLowerCase().replace(/\s/g, '') || 'unknown';
		
        chatLog = [{ sender: 'bot', message: 'Hello! How can I help you today?' }];
    })
</script>

<div class="navbar">
    <button class="back-button" on:click={goHome}>⟵</button>
    <div class="title">Therapist</div>
</div>

<div class="chat-wrapper">
    <div bind:this={chatContainer} class="chat-log">
        {#each chatLog as chat, index}
            <div class="chat-message {chat.sender}">
                <p>{chat.message}</p>
            </div>
        {/each}

        {#if loading}
            <div class="chat-message bot typing">
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
            </div>
        {/if}
    </div>

    <form on:submit|preventDefault={sendMessage} class="input-container">
        <input
            type="text"
            placeholder="Send a message..."
            bind:value={userInput}
            class="input-field"
            autocomplete="off"
        />
        <button type="submit" class="send-btn">Send</button>
    </form>
</div>

<style>
    :root {
        --background-color: #343541;
        --bot-message-color: #444654;
        --user-message-color: #10a37f;
        --input-background-color: #40414f;
        --text-color: #ffffff;
    }

    html, body {
        margin: 0;
        padding: 0;
        height: 100%;
    }

    .navbar {
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: var(--bot-message-color);
        color: var(--text-color);
        padding: 10px;
        position: sticky;
        top: 0;
        z-index: 10;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    }

    .back-button {
        position: absolute;
        left: 15px;
        background: none;
        border: none;
        color: var(--text-color);
        font-size: 1.5rem;
        cursor: pointer;
    }

    .title {
        font-size: 1.2rem;
        font-weight: bold;
    }

    .chat-wrapper {
        display: flex;
        flex-direction: column;
        width: 100vw;
        height: calc(100vh - 50px);
        background-color: var(--background-color);
        color: var(--text-color);
    }

    .chat-log {
        flex-grow: 1;
        padding: 20px;
        overflow-y: auto;
        background-color: var(--background-color);
    }

    .chat-message {
        max-width: 70%;
        margin-bottom: 15px;
        padding: 12px 18px;
        line-height: 1.4;
        font-size: 1rem;
        border-radius: 12px;
    }

    .chat-message.user {
        margin-left: auto;
        background-color: var(--user-message-color);
        color: var(--text-color);
        text-align: left;
    }

    .chat-message.bot {
        margin-right: auto;
        background-color: var(--bot-message-color);
        color: var(--text-color);
        text-align: left;
    }

    .input-container {
        display: flex;
        padding: 15px;
        background-color: var(--input-background-color);
        border-top: 1px solid #555;
    }

    .input-field {
        flex-grow: 1;
        padding: 12px;
        border: none;
        font-size: 1rem;
        background-color: var(--bot-message-color);
        color: var(--text-color);
        border-radius: 8px;
    }

    .send-btn {
        margin-left: 10px;
        padding: 12px 20px;
        border: none;
        background-color: var(--user-message-color);
        color: var(--text-color);
        cursor: pointer;
        border-radius: 8px;
    }
</style>
