import { error, redirect } from '@sveltejs/kit';
import PocketBase from 'pocketbase';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user) {
        throw redirect(303, '/login');
    }

    const pbUrl = process.env.PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090';
    const adminPb = new PocketBase(pbUrl);

    try {
        const adminEmail = process.env.PB_ADMIN_EMAIL;
        const adminPassword = process.env.PB_ADMIN_PASSWORD;
        
        if (!adminEmail || !adminPassword) {
            console.error("[Passes Load] CRITICAL: PB_ADMIN_EMAIL or PB_ADMIN_PASSWORD is not set in .env");
        } else {
            await adminPb.admins.authWithPassword(adminEmail, adminPassword);
        }

        // Fetch tickets and groups using the Admin client to ensure we see everything
        const tickets = await adminPb.collection('tickets').getFullList({
            filter: `userId = "${locals.user.id}"`,
            sort: '-created'
        });

        const groups = await adminPb.collection('groups').getFullList({
            filter: `userId = "${locals.user.id}"`,
            sort: '-created'
        });

        console.log(`[Passes Load] User: ${locals.user.email}, Tickets: ${tickets.length}, Groups: ${groups.length}`);

        adminPb.authStore.clear();

        return {
            tickets: structuredClone(tickets),
            groups: structuredClone(groups)
        };
    } catch (e) {
        console.error("History Load Error:", e);
        return { tickets: [], groups: [] };
    }
};