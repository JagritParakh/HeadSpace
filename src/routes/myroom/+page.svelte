<script>
    let name = '';
    let currentMood = 'Mood not set'; // Default mood

    import { onMount } from 'svelte';

    // Function to update the mood
    function updateMood() {
        const userMood = prompt('Enter your mood:'); // Prompt the user to input a mood
        if (userMood && userMood.trim() !== '') {
            currentMood = userMood.trim(); // Update the mood
        }
    }

     // Utility to get the days in a month
     function getDaysInMonth(year, month) {
        return new Date(year, month + 1, 0).getDate();
    }

    // Move to the previous or next month
    function changeMonth(direction) {
        selectedDate.setMonth(selectedDate.getMonth() + direction);
        selectedDate = new Date(selectedDate); // Trigger reactivity
    }

    // Select a specific date
    function selectDate(day) {
        selectedDate.setDate(day);
        selectedDate = new Date(selectedDate); // Trigger reactivity
        alert(`Selected date: ${selectedDate.toDateString()}`);
    }

    onMount(() => {
        const params = new URLSearchParams(window.location.search);
        name = params.get('name')?.toLowerCase().replace(/\s/g, '') || 'unknown';
        console.log('User name:', name);
    });
</script>

<div class="background">
    <div class="navbar">
        <div class="title">My Room</div>
        <div class="return">
            <a href="/home?name={name}">Home</a>
        </div>
    </div>
    <div class="left-panel">
        <div class="mood" on:click={updateMood}>
            Mood: {currentMood}
        </div>
        
        <div>
            <a href="/journal?name={name}" class="bookmark-button journal">Journal</a>
        </div>
    </div>
    <div class="right-panel">
        <div class="neko">
            <a href="https://icallhelpline.org/" target="_blank" rel="noopener noreferrer" aria-label="iCall Helpline">
                <image src="/neko.gif" alt="neko" class="neko"></image>
            </a>
            
        </div>
        <div class = "Notes">
            
        </div>
    </div>
</div>

<style>
    .body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
        color: aliceblue;
    }
    .neko{
		position: absolute;
		bottom: 0;
		right: 5%;
		height: 200px;
		width: 200px;
		object-fit: contain;
	}

    .background {
        position: absolute;
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        background-color: #081b3f;
    }

    .navbar {
        z-index: 1000;
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

    .navbar .title {
        font-size: 1.5rem;
        font-weight: bold;
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
        left: 0px;
        width: 30%;
        height: 100%;
        background-color: #1E3A8A;
        color: white;
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding-top: 50px;
        padding-left: 1%;
        padding-right: 1%;
    }

    .mood {
        height: 100px;
        margin: 5%;
        width: 90%;
        background-color: #1b6f28;
        color: white;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        font-size: 1.2rem;
        font-weight: bold;
        border-radius: 8px;
        cursor: pointer;
        transition: background-color 0.3s ease;
    }

    .mood:hover {
        background-color: #2a8f39;
    }

    .schedule {
        height: 40%;
        margin: 5%;
        width: 90%;
        background-color: #1b6f28;
        color: white;
        display: flex;
        flex-direction: column-reverse;
        justify-content: center;
        align-items: center;
    }

    .journal {
        height: 50px;
        align-content: center;
        padding: 0 2rem;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        text-decoration: none;
        display: inline-block;
        background-color: #8a2be2;
        color: white;
        font-size: 1rem;
        font-weight: bold;
        text-align: center;
        width: 92%;
        position: absolute;
        bottom: 0;
        transition: height 0.3s ease, line-height 0.3s ease, padding 0.3s ease;
    }

    .bookmark-button:hover {
        height: 70px; /* Increase height on hover */
        padding: 0.5rem 8rem; /* Maintain consistent horizontal padding */
    }

    .right-panel {
        position: absolute;
        right: 0px;
        width: 30%;
        height: 100%;
        background-color: #1E3A8A;
        color: white;
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding-top: 50px;
        padding-left: 1%;
        padding-right: 1%;
    }

    .music {
        height: 200px;
        margin-top: 15%;
        margin-left: 5%;
        margin-right: 5%;
        border-radius: 10px;
        width: 90%;
        background-color: #1b6f28;
        color: white;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
</style>
