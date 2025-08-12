import { json } from '@sveltejs/kit';
import { scrapeEmailsAndSources } from '$lib/scraper';

export async function POST({ request }) {
    try {
        const options = await request.json();
        if (!options?.username) {
            return json({ error: 'Username is required.' }, { status: 400 });
        }

        const rawResults = await scrapeEmailsAndSources(options);

        const emailData = new Map();

        for (const { email, source } of rawResults) {
            if (!emailData.has(email)) {
                emailData.set(email, { count: 0, sources: new Set() });
            }
            const data = emailData.get(email);
            data.count++;
            data.sources.add(source);
        }

        const aggregatedResults = Array.from(emailData.entries()).map(([email, data]) => ({
            email,
            count: data.count,
            sources: Array.from(data.sources),
        }));

        aggregatedResults.sort((a, b) => b.count - a.count);

        return json({ results: aggregatedResults });

    } catch (error) {
        console.error('[API Error]', error);
        return json({ error: error.message || 'An unknown server error occurred.' }, { status: 500 });
    }
}