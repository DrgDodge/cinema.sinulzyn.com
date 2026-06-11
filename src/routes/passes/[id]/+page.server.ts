import { error } from '@sveltejs/kit';
import PocketBase from 'pocketbase';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
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

        return { ticket: structuredClone(ticket) };
    } catch (e: any) {
        console.error("Pass Load Error:", e);
        throw error(404, 'Cinema Pass not found or has been deleted.');
    }
};