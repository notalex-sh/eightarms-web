<script>
    import { onMount } from 'svelte';
    import { fly } from 'svelte/transition';
    import ResultsDisplay from '$lib/components/ResultsDisplay.svelte';
    import OptionsPanel from '$lib/components/OptionsPanel.svelte';
    import DocsPanel from '$lib/components/DocsPanel.svelte';
    import Spinner from '$lib/components/Spinner.svelte';

    let username = '';
    let results = [];
    let isLoading = false;
    let error = '';

    let speed = 'medium';
    let maxRepos = 10;
    let pagesPerRepo = 3;
    let commitStrategy = '[10,10]';
		
	let isAuthenticated = false;
    let passwordInput = '';
    let authError = '';

    onMount(() => {
        if (sessionStorage.getItem('isAuthenticated')) {
            isAuthenticated = true;
        }
    });

    async function handlePassword() {
        authError = '';
        try {
            const res = await fetch('/api/auth');
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Could not connect to auth service.');
            }

            const correctPassword = data.password;

            if (passwordInput === correctPassword) {
                isAuthenticated = true;
                sessionStorage.setItem('isAuthenticated', 'true'); 
            } else {
                authError = 'ACCESS DENIED';
                passwordInput = '';
            }
        } catch (e) {
            authError = `Authentication Error: ${e.message}`;
        }
    }

    async function handleSubmit() {
        if (!username || isLoading) return;
        isLoading = true;
        error = '';
        results = [];

        try {
            const response = await fetch('/api/scrape', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, maxRepos, pagesPerRepo, commitStrategy })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error);
            results = data.results;
        } catch (e) {
            error = e.message;
        } finally {
            isLoading = false;
        }
    }
</script>

<div class="min-h-screen bg-black text-green-400 font-mono p-4 sm:p-8">
	{#if !isAuthenticated}
		<div in:fly={{ y: -20, duration: 400, delay: 100 }} class="flex flex-col items-center justify-center h-screen">
			<div class="hacker-card p-8 text-center max-w-sm w-full">
				<h1 class="text-2xl font-bold text-white mb-4">> SECURE TERMINAL_</h1>
				<p class="text-gray-500 mb-4 text-sm">Authorization Required</p>
				<form on:submit|preventDefault={handlePassword}>
					<input
						class="cyber-input text-center tracking-[0.5em]"
						type="password"
						placeholder="PASSWORD"
						bind:value={passwordInput}
					/>
					<button class="w-full mt-4 bg-green-500/20 hover:bg-green-500/40 text-white font-bold py-2 px-4 border border-green-500/30 transition-all" type="submit">
						[AUTHENTICATE]
					</button>
				</form>
                {#if authError}
                    <p class="text-red-500 text-center animate-pulse mt-4">{authError}</p>
                {/if}
			</div>
		</div>
	{:else}
		<div class="max-w-4xl mx-auto flex flex-col space-y-8">
			<header
				class="flex justify-center"
				in:fly={{ y: -20, duration: 400, delay: 100 }}
			>
				<pre class="text-green-400 text-sm text-glow">
{`         ______
        /      \\
       /        \\
       |          |
    )  o        o   (
   (    \\      /    )        GitHub Email Intelligence
     \\__/||||||\\___/ _
   \\____/ |||| \\____/ \`
   ,-.___/ || \\___,-._
  /    ___/  \\___    \\
     _/         \`--`}
				</pre>
			</header>

            <div class="text-center text-gray-400 text-sm -mt-4" in:fly={{ y: -20, duration: 400, delay: 200 }}>
                <p>
                    This tool scans public GitHub commit data to uncover email addresses associated with a target user.
                </p>
            </div>

			<main
				class="w-full"
				in:fly={{ y: -20, duration: 400, delay: 300 }}
			>
				<form on:submit|preventDefault={handleSubmit} class="relative mb-6">
					<input
						class="w-full bg-gray-900/80 border border-green-500/30 text-lg p-4 rounded-none focus:outline-none focus:ring-1 focus:ring-green-400 transition-all placeholder-gray-700"
						type="text"
						placeholder="TARGET_USERNAME >"
						bind:value={username}
						disabled={isLoading}
					/>
					<button class="absolute top-1/2 right-4 -translate-y-1/2 text-green-400 hover:text-white transition-colors text-glow text-lg font-bold" type="submit" disabled={isLoading}>
						{#if isLoading} <Spinner /> {:else} [EXECUTE] {/if}
					</button>
				</form>

				{#if error}<p class="text-red-500 text-center animate-pulse">{error}</p>{/if}

				<ResultsDisplay {results} {isLoading} />
			</main>

			<aside
				class="w-full"
				in:fly={{ y: -20, duration: 400, delay: 500 }}
			>
				<OptionsPanel bind:speed bind:maxRepos bind:pagesPerRepo bind:commitStrategy {isLoading} />
				<div class="mt-8">
					<DocsPanel />
				</div>
			</aside>
		</div>
	{/if}
</div>