<script>
    import { fly, fade } from 'svelte/transition';
    export let results;
    export let isLoading;
</script>

{#if isLoading && results.length === 0}
    <div class="hacker-card text-center text-gray-500 animate-pulse">
        <p>Executing Scan... Contacting GitHub servers...</p>
    </div>
{/if}

{#if results.length > 0 && !isLoading}
<div class="hacker-card" in:fade={{ duration: 600 }}>
    <h2 class="text-xl font-bold text-white mb-4">> Intel Report_</h2>
    <div class="space-y-4 max-h-[50vh] overflow-y-auto pr-2">
        {#each results as item, i (item.email)}
            <div
                class="bg-black/50 p-4 border-l-2 border-green-500/50"
                in:fly={{ x: -20, duration: 300, delay: i * 50 }}
            >
                <div class="flex justify-between items-start">
                    <p class="text-green-300 text-glow break-all font-bold">{item.email}</p>
                    <span class="bg-green-900/50 text-green-300 text-xs font-bold px-2 py-1 ml-4 whitespace-nowrap">
                        Hits: {item.count}
                    </span>
                </div>
                <div class="text-xs text-green-500/70 mt-2">
                    <span class="font-semibold">SOURCES:</span>
                    <span class="italic">{item.sources.join(', ')}</span>
                </div>
            </div>
        {/each}
    </div>
</div>
{/if}