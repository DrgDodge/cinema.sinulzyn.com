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

        let group = await adminPb.collection('groups').getOne(params.id);
        
        // Auto-initialize slug if it doesn't exist
        if (!group.slug) {
            const randomSlug = Math.random().toString(36).substring(2, 10);
            group = await adminPb.collection('groups').update(params.id, { slug: randomSlug });
        }
        
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
    updateSlug: async ({ request, params }) => {
        const data = await request.formData();
        let slug = data.get('slug') as string;

        if (!slug || slug.trim() === '') {
            return { success: false, error: 'Link cannot be empty.' };
        }

        // Clean slug: lowercase, remove non-alphanumeric except dashes/underscores
        slug = slug.toLowerCase().replace(/[^a-z0-9-_]/g, '');

        const pbUrl = process.env.PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090';
        const adminPb = new PocketBase(pbUrl);

        try {
            const adminEmail = process.env.PB_ADMIN_EMAIL;
            const adminPassword = process.env.PB_ADMIN_PASSWORD;
            if (adminEmail && adminPassword) {
                await adminPb.admins.authWithPassword(adminEmail, adminPassword);
            }

            // Check if slug is unique
            const existing = await adminPb.collection('groups').getFullList({
                filter: `slug = "${slug}" && id != "${params.id}"`
            });

            if (existing.length > 0) {
                return { success: false, error: 'This link is already taken.' };
            }

            await adminPb.collection('groups').update(params.id, { slug });
            return { success: true };
        } catch (e: any) {
            console.error("Update Slug Error:", e);
            return { success: false, error: 'Failed to update link.' };
        } finally {
            adminPb.authStore.clear();
        }
    },
    updatePublic: async ({ request, params }) => {
        const data = await request.formData();
        const isPublic = data.get('isPublic') === 'true';

        console.log(`[Update Public] Attempting update for Group: ${params.id}, target state: ${isPublic}`);

        const pbUrl = process.env.PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090';
        const adminPb = new PocketBase(pbUrl);

        try {
            const adminEmail = process.env.PB_ADMIN_EMAIL;
            const adminPassword = process.env.PB_ADMIN_PASSWORD;
            
            if (!adminEmail || !adminPassword) {
                throw new Error("Missing Admin Credentials");
            }

            await adminPb.admins.authWithPassword(adminEmail, adminPassword);

            // Double check if field exists, if not try to add it dynamically
            try {
                const group = await adminPb.collection('groups').getOne(params.id);
                if (group.isPublic === undefined) {
                    console.log("[Update Public] 'isPublic' field missing in DB. Attempting to add it...");
                    await adminPb.collections.update('groups', {
                        'fields+': [{ name: 'isPublic', type: 'bool' }]
                    });
                }
            } catch (e) {
                console.log("[Update Public] Schema check failed, proceeding anyway.");
            }

            await adminPb.collection('groups').update(params.id, { isPublic: isPublic });
            console.log(`[Update Public] SUCCESS: Group ${params.id} is now ${isPublic ? 'PUBLIC' : 'PRIVATE'}`);
            
            return { success: true };
        } catch (e: any) {
            console.error("[Update Public] FAILED:", e.status || '500', e.message);
            console.dir(e.response?.data || {}, { depth: null });
            return { success: false, error: e.message };
        } finally {
            adminPb.authStore.clear();
        }
    }
};