import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user) {
        throw redirect(303, '/login');
    }

    try {
        // Fetch tickets and groups for the current user
        // We use fullList to get everything
        const tickets = await locals.pb.collection('tickets').getFullList({
            filter: `userId = "${locals.user.id}"`,
            sort: '-created'
        });

        const groups = await locals.pb.collection('groups').getFullList({
            filter: `userId = "${locals.user.id}"`,
            sort: '-created'
        });

        return {
            tickets: structuredClone(tickets),
            groups: structuredClone(groups)
        };
    } catch (e) {
        console.error("History Load Error:", e);
        return { tickets: [], groups: [] };
    }
};