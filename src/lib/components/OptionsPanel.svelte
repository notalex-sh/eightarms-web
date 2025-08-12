<script>
    import { run } from 'svelte/legacy';

    let {
        speed = $bindable(),
        maxRepos = $bindable(),
        pagesPerRepo = $bindable(),
        commitStrategy = $bindable(),
        isLoading
    } = $props();

    const presets = {
        fast: { maxRepos: 5, pagesPerRepo: 2, commitStrategy: '[5,5]' },
        medium: { maxRepos: 10, pagesPerRepo: 3, commitStrategy: '[10,10]' },
        slow: { maxRepos: 25, pagesPerRepo: 5, commitStrategy: 'all' }
    };
    function applyPreset(s) { if (s !== 'custom') { const p = presets[s]; maxRepos=p.maxRepos; pagesPerRepo=p.pagesPerRepo; commitStrategy=p.commitStrategy; } }
    run(() => {
        applyPreset(speed);
    });
</script>

<div class="hacker-card space-y-6">
    <div>
        <h2 class="text-xl font-bold text-white mb-4">> Configuration_</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label class="block mb-2 text-gray-400" for="speed">Scan Profile</label>
                <select id="speed" bind:value={speed} disabled={isLoading} class="cyber-input">
                    <option value="fast">Fast</option>
                    <option value="medium">Medium</option>
                    <option value="slow">Slow</option>
                    <option value="custom">Custom</option>
                </select>
            </div>
             <fieldset disabled={speed !== 'custom' || isLoading} class="space-y-4 md:space-y-0 md:grid md:grid-cols-3 md:gap-4 col-span-1 md:col-span-2 md:border-l md:border-green-500/20 md:pl-4 transition-opacity" class:opacity-40={speed !== 'custom'}>
                 <div>
                    <label for="max-repos">Max Repos</label>
                    <input type="number" id="max-repos" bind:value={maxRepos} class="cyber-input mt-1 md:mt-0" />
                </div>
                <div>
                    <label for="pages">Pages/Repo</label>
                    <input type="number" id="pages" bind:value={pagesPerRepo} class="cyber-input mt-1 md:mt-0" />
                </div>
                <div>
                    <label for="commits">Commits</label>
                    <input type="text" id="commits" bind:value={commitStrategy} class="cyber-input mt-1 md:mt-0" />
                </div>
            </fieldset>
        </div>
    </div>
</div>