import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import PocketBase from 'pocketbase';

export const load: PageServerLoad = async ({ params, locals }) => {
    try {
        const pbUrl = process.env.PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090';
        const adminPb = new PocketBase(pbUrl);
        const adminEmail = process.env.PB_ADMIN_EMAIL;
        const adminPassword = process.env.PB_ADMIN_PASSWORD;
        
        if (adminEmail && adminPassword) {
            await adminPb.admins.authWithPassword(adminEmail, adminPassword);
        }

        const group = await adminPb.collection('groups').getOne(params.id);
        
        // Use the simplest possible fetch to avoid v0.22/0.23 parameter conflicts
        const allTickets = await adminPb.collection('tickets').getFullList();
        
        const groupTickets = allTickets.filter(t => t.groupId === params.id);
        const availableTickets = allTickets.filter(t => t.userId === locals.user?.id && !t.groupId);

        console.log(`[Group Load] Group: ${group.name}, Tickets In Group: ${groupTickets.length}, Ungrouped Available: ${availableTickets.length}`);

        adminPb.authStore.clear();

        return {
            group: structuredClone(group),
            tickets: structuredClone(groupTickets),
            availableTickets: structuredClone(availableTickets)
        };
    } catch (e: any) {
        console.error("Group Load Error:", e);
        throw error(404, 'Group not found.');
    }
};

export const actions = {
    addTicket: async ({ request, params }) => {
        const data = await request.formData();
        const ticketId = data.get('ticketId') as string;

        const pbUrl = process.env.PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090';
        const adminPb = new PocketBase(pbUrl);

        try {
            const adminEmail = process.env.PB_ADMIN_EMAIL;
            const adminPassword = process.env.PB_ADMIN_PASSWORD;
            if (adminEmail && adminPassword) {
                 await adminPb.admins.authWithPassword(adminEmail, adminPassword);
            }
            await adminPb.collection('tickets').update(ticketId, { groupId: params.id });
            return { success: true };
        } catch (e) {
            console.error("Add Ticket Error:", e);
            return { success: false };
        } finally {
            adminPb.authStore.clear();
        }
    },
    updatePublic: async ({ request, params }) => {
        const data = await request.formData();
        const isPublic = data.get('isPublic') === 'true';

        const pbUrl = process.env.PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090';
        const adminPb = new PocketBase(pbUrl);

        try {
            const adminEmail = process.env.PB_ADMIN_EMAIL;
            const adminPassword = process.env.PB_ADMIN_PASSWORD;
            if (adminEmail && adminPassword) {
                 await adminPb.admins.authWithPassword(adminEmail, adminPassword);
            }
            await adminPb.collection('groups').update(params.id, { isPublic });
            return { success: true };
        } catch (e) {
            console.error("Update Public Error:", e);
            return { success: false };
        } finally {
            adminPb.authStore.clear();
        }
    }
};