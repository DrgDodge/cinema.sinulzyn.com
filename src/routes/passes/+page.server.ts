import { error, redirect } from '@sveltejs/kit';
import PocketBase from 'pocketbase';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user) {
        throw redirect(303, '/login');
    }

    const pbUrl = process.env.PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090';
    const adminPb = new PocketBase(pbUrl);

    let tickets: any[] = [];
    let groups: any[] = [];

    try {
        const adminEmail = process.env.PB_ADMIN_EMAIL;
        const adminPassword = process.env.PB_ADMIN_PASSWORD;
        
        if (!adminEmail || !adminPassword) {
            console.error("[Passes Load] CRITICAL: PB_ADMIN_EMAIL or PB_ADMIN_PASSWORD is not set in .env");
        } else {
            await adminPb.admins.authWithPassword(adminEmail, adminPassword);
        }

        // DEBUG: Fetch everything without filter first to see if they appear
        try {
            const rawTickets = await adminPb.collection('tickets').getFullList({
                sort: '-created'
            });
            console.log(`[Passes Load] RAW Tickets in DB: ${rawTickets.length}`);
            // Now filter manually for safety
            tickets = rawTickets.filter(t => t.userId === locals.user?.id);
        } catch (e) {
            console.log("[Passes Load] tickets fetch error");
        }

        try {
            const rawGroups = await adminPb.collection('groups').getFullList({
                sort: '-created'
            });
            console.log(`[Passes Load] RAW Groups in DB: ${rawGroups.length}`);
            // Now filter manually for safety
            groups = rawGroups.filter(g => g.userId === locals.user?.id);
        } catch (e) {
            console.log("[Passes Load] groups fetch error");
        }

        console.log(`[Passes Load] UserID: ${locals.user?.id}, Filtered Tickets: ${tickets.length}, Filtered Groups: ${groups.length}`);

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