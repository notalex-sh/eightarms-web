import { json } from '@sveltejs/kit';
import { EIGHTARMS_PASSWORD } from '$env/static/private';

/**
 * @type {import('./$types').RequestHandler}
 * This endpoint securely provides the application password.
 * It uses the EIGHTARMS_PASSWORD environment variable if available,
 * otherwise it falls back to a default demo password.
 */
export function GET() {
    const password = EIGHTARMS_PASSWORD || 'eightarmsdemo';

    if (!EIGHTARMS_PASSWORD) {
        console.warn("Warning: EIGHTARMS_PASSWORD environment variable not set. Falling back to default demo password.");
    }

    return json({ password: password });
}
