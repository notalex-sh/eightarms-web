<script>
    import { fly } from 'svelte/transition';
    let showDocs = $state(true);
</script>

<div class="hacker-card">
    <button onclick={() => showDocs = !showDocs} class="w-full text-left">
        <h2 class="text-xl font-bold text-white mb-2">> Operational Doctrine_ {showDocs ? '[-]' : '[+]'}</h2>
    </button>
    
    {#if showDocs}
    <div class="text-sm text-gray-400 space-y-4 mt-2 transition-all" in:fly={{ y: -10, duration: 300 }}>
        <div>
            <h3 class="font-bold text-green-400 text-glow">Methodology</h3>
            <p>This tool conducts <span class="text-white">covert reconnaissance</span> by passively scraping publicly accessible commit metadata. The entire operation is performed without authentication, leaving no direct trace to the inquiring party and mimicking the behavior of a standard web user.</p>
            <ol class="list-decimal list-inside space-y-1 mt-2">
                <li><span class="text-gray-300">Target Enumeration:</span> Identifies public repositories for the target handle.</li>
                <li><span class="text-gray-300">SHA Acquisition:</span> Scans commit histories to retrieve unique commit SHA identifiers. This is the core of the passive intelligence gathering.</li>
                <li><span class="text-gray-300">Patch Interception:</span> Downloads the raw `.patch` file for each commit, which contains explicit, unaltered author and committer metadata.</li>
                <li><span class="text-gray-300">Metadata Exploitation:</span> Parses `Author`, `Committer`, and `Signed-off-by` headers to extract email addresses and other sensitive intel.</li>
            </ol>
        </div>
         <div>
            <h3 class="font-bold text-green-400 text-glow">Intel Analysis</h3>
            <p>Results are aggregated and sorted by frequency to identify primary email addresses and operational patterns.</p>
             <ul class="list-disc list-inside space-y-1 mt-2">
                <li><span class="text-gray-300">Hits:</span> The total number of commits an email is associated with, indicating operational frequency.</li>
                <li><span class="text-gray-300">Sources:</span> The unique repositories (theaters of operation) where the email was discovered.</li>
            </ul>
        </div>
        <div>
            <a href="https://www.notalex.sh/blog/githubosint" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:underline text-glow-blue">
                [ Full Technical Doctrine & Theory ]
            </a>
        </div>
    </div>
    {/if}
</div>