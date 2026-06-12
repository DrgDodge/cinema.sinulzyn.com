import { error } from '@sveltejs/kit';
import PocketBase from 'pocketbase';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
    try {
        const pbUrl = process.env.PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090';
        const adminPb = new PocketBase(pbUrl);
        const adminEmail = process.env.PB_ADMIN_EMAIL;
        const adminPassword = process.env.PB_ADMIN_PASSWORD;
        
        if (adminEmail && adminPassword) {
            await adminPb.admins.authWithPassword(adminEmail, adminPassword);
        }
        
        // Fetch securely via Admin bypass in case the user's PocketBase has restrictive public rules
        const ticket = await adminPb.collection('tickets').getOne(params.id);
        adminPb.authStore.clear();

        // Pass is private by default: Ensure the current user is the owner
        if (!locals.user || ticket.userId !== locals.user.id) {
            throw error(403, 'This pass is private.');
        }

        return { ticket: structuredClone(ticket) };
    } catch (e: any) {
        if (e.status === 403) throw e;
        console.error("Pass Load Error:", e);
        throw error(404, 'Cinema Pass not found or has been deleted.');
    }
};