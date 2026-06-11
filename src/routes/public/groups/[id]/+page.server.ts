import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import PocketBase from 'pocketbase';

export const load: PageServerLoad = async ({ params }) => {
    try {
        const pbUrl = process.env.PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090';
        const adminPb = new PocketBase(pbUrl);
        const adminEmail = process.env.PB_ADMIN_EMAIL;
        const adminPassword = process.env.PB_ADMIN_PASSWORD;
        
        if (adminEmail && adminPassword) {
            await adminPb.admins.authWithPassword(adminEmail, adminPassword);
        }

        // Fetch the group and verify it is public
        const group = await adminPb.collection('groups').getOne(params.id);
        
        if (!group.isPublic) {
            adminPb.authStore.clear();
            throw error(403, 'This group is private.');
        }

        const tickets = await adminPb.collection('tickets').getFullList({
            filter: `groupId = "${params.id}"`,
            sort: 'created'
        });

        adminPb.authStore.clear();

        return {
            group: structuredClone(group),
            tickets: structuredClone(tickets)
        };
    } catch (e: any) {
        if (e.status) throw e;
        console.error("Public Group Load Error:", e);
        throw error(404, 'Group not found.');
    }
};