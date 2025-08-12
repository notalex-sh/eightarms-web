import * as cheerio from 'cheerio';

async function scrapeEmailsAndSources(options) {
    const { username, maxRepos, pagesPerRepo, commitStrategy } = options;
    const repos = await getUserRepositories(username);
    if (repos.length === 0) {
        throw new Error("No public repositories found. User may not exist or has no public code.");
    }

    let allEmailsWithSources = [];
    const repoPromises = repos.slice(0, maxRepos).map(async (repo) => {
        const shas = await getCommitShas(username, repo, pagesPerRepo);
        const selectedShas = parseCommitRange(shas, commitStrategy);
        const patchPromises = selectedShas.map(async (sha) => {
            const patch = await getCommitPatch(username, repo, sha);
            if (patch) {
                const emailsFromPatch = extractEmailsFromPatch(patch, repo);
                allEmailsWithSources.push(...emailsFromPatch);
            }
        });
        await Promise.all(patchPromises);
    });
    await Promise.all(repoPromises);
    
    return allEmailsWithSources;
}


const userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15',
];

async function fetchWithRetry(url) {
    try {
        const response = await fetch(url, { headers: { 'User-Agent': userAgents[Math.floor(Math.random() * userAgents.length)] }});
        if (!response.ok) return null;
        return response;
    } catch (error) { return null; }
}

async function getUserRepositories(username) {
    const repos = new Set();
    const url = `https://github.com/${username}?tab=repositories`;
    const response = await fetchWithRetry(url);
    if (!response) return [];
    const html = await response.text();
    const $ = cheerio.load(html);
    $('a[itemprop="name codeRepository"]').each((i, el) => {
        const href = $(el).attr('href');
        if (href) repos.add(href.split('/').pop());
    });
    return Array.from(repos);
}

async function getCommitShas(username, repo, maxPages) {
    const shas = new Set();
    for (let i = 1; i <= maxPages; i++) {
        const url = `https://github.com/${username}/${repo}/commits?page=${i}`;
        const response = await fetchWithRetry(url);
        if (!response) break;
        const html = await response.text();
        const $ = cheerio.load(html);
        $('a[href*="/commit/"]').each((i, el) => {
            const href = $(el).attr('href');
            const shaMatch = href?.match(/\/commit\/([a-f0-9]{7,40})/);
            if (shaMatch?.[1]) shas.add(shaMatch[1]);
        });
    }
    return Array.from(shas);
}

function parseCommitRange(commits, spec) {
    const rangeMatch = spec.match(/\[\s*(\d+)\s*,\s*(\d+)\s*\]/);
    if (rangeMatch) {
        const top = parseInt(rangeMatch[1], 10);
        const bottom = parseInt(rangeMatch[2], 10);
        if (commits.length <= top + bottom) return commits;
        return [...commits.slice(0, top), ...commits.slice(-bottom)];
    }
    if (/^\d+$/.test(spec)) return commits.slice(0, parseInt(spec, 10));
    return spec.toLowerCase() === 'all' ? commits : [];
}

async function getCommitPatch(username, repo, sha) {
    const url = `https://github.com/${username}/${repo}/commit/${sha}.patch`;
    const response = await fetchWithRetry(url);
    return response ? response.text() : '';
}

function extractEmailsFromPatch(patch, repo) {
    const emailRegex = /(?:From|Author|Committer|Signed-off-by|Co-authored-by):.*?<(.+?)>/g;
    const emails = [];
    let match;
    while ((match = emailRegex.exec(patch)) !== null) {
        emails.push({ email: match[1], source: repo });
    }
    return emails;
}


export { scrapeEmailsAndSources };